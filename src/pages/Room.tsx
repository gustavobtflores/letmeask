import logoImg from "../assets/img/logo.svg";
import { Button } from "../components/Button";
import "../assets/scss/room.scss";
import { RoomCode } from "../components/RoomCode";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<
	string,
	{
		author: {
			name: string;
			avatar: string;
		};
		content: string;
		isAnswered: boolean;
		isHighlighted: boolean;
	}
>;

type RoomParams = {
	id: string;
};

type Question = {
	id: string;

	author: {
		name: string;
		avatar: string;
	};
	content: string;
	isAnswered: boolean;
	isHighlighted: boolean;
};

export function Room() {
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const [newQuestion, setNewQuestion] = useState("");
	const [questions, setQuestions] = useState<Question[]>([]);
	const [title, setTitle] = useState("");

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`);

		roomRef.on("value", (room) => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

			const parsedQuestions = Object.entries(firebaseQuestions).map(
				([key, value]) => {
					return {
						id: key,
						content: value.content,
						author: value.author,
						isHighlighted: value.isHighlighted,
						isAnswered: value.isAnswered,
					};
				}
			);
			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
		});
	}, [roomId]);

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault();

		if (newQuestion.trim() === "") {
			return;
		}

		if (!user) {
			toast.error("Você deve estar logado");
			return;
		}

		const question = {
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar,
			},
			isHighlighted: false,
			isAnswered: false,
		};

		await database.ref(`rooms/${roomId}/questions`).push(question);

		setNewQuestion("");
	}

	return (
		<div id="page-room">
			<Toaster />
			<header>
				<div className="content">
					<img src={logoImg} alt="letmeask" />
					<RoomCode code={roomId} />
				</div>
			</header>

			<main className="content">
				<div className="room-title">
					<h1>Sala {title}</h1>
					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea
						placeholder="O que você deseja perguntar?"
						onChange={(event) => setNewQuestion(event.target.value)}
						value={newQuestion}
					/>

					<div className="form-footer">
						{user ? (
							<div className="user-info">
								<img src={user.avatar} alt={user.name} />
								<span>{user.name}</span>
							</div>
						) : (
							<span>
								Para enviar uma pergunta, <button>faça seu login</button>.
							</span>
						)}
						<Button type="submit" disabled={!user}>
							Enviar pergunta
						</Button>
					</div>
				</form>
			</main>
		</div>
	);
}
