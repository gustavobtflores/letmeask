import logoImg from "../assets/img/logo.svg";
import { Button } from "../components/Button";
import checkImg from "../assets/img/check.svg";
import answerImg from "../assets/img/answer.svg";

import "../assets/scss/room.scss";
import { RoomCode } from "../components/RoomCode";
import { useHistory, useParams } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
import { Toaster } from "react-hot-toast";
import deleteImg from "../assets/img/delete.svg";

import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

type RoomParams = {
	id: string;
};

export function AdminRoom() {
	// const { user } = useAuth();
	const history = useHistory();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const { title, questions } = useRoom(roomId);

	async function handleEndRoom() {
		database.ref(`rooms/${roomId}`).update({
			endedAt: new Date(),
		});

		history.push("/");
	}

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm("Tem certeza que você deseja excluir essa pergunta")) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		}
	}

	async function handleCheckQuestionAsAnswered(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true,
		});
	}

	async function handleHighlightQuestion(questionId: string) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true,
		});
	}

	return (
		<div id="page-room">
			<Toaster />
			<header>
				<div className="content">
					<img src={logoImg} alt="letmeask" />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined onClick={handleEndRoom}>
							Encerrar sala
						</Button>
					</div>
				</div>
			</header>
			<main className="content">
				<div className="room-title">
					<h1>Sala {title}</h1>
					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>
				<div className="question-list">
					{questions.map((question) => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
								isAnswered={question.isAnswered}
								isHighlighted={question.isHighlighted}
							>
								{!question.isAnswered && (
									<>
										<button
											type="button"
											onClick={() => {
												handleCheckQuestionAsAnswered(question.id);
											}}
										>
											<img
												src={checkImg}
												alt="Marcar pergunta como respondida"
											/>
										</button>

										<button
											type="button"
											onClick={() => {
												handleHighlightQuestion(question.id);
											}}
										>
											<img src={answerImg} alt="Dar destaque a pergunta" />
										</button>
									</>
								)}

								<button
									type="button"
									onClick={() => {
										handleDeleteQuestion(question.id);
									}}
								>
									<img src={deleteImg} alt="Remover pergunta" />
								</button>
							</Question>
						);
					})}
				</div>
			</main>
		</div>
	);
}
