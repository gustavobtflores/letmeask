import { useHistory } from "react-router-dom";
import illustrationImg from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";
import googleIconImg from "../assets/img/google-icon.svg";
import { Button } from "../components/Button";
import "../assets/scss/auth.scss";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import toast, { Toaster } from "react-hot-toast";

export function Home() {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();
	const [roomCode, setRoomCode] = useState("");

	async function handleNewRoom() {
		if (!user) {
			await signInWithGoogle();
		}
		history.push("/rooms/new");
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if (roomCode.trim() === "") {
			return;
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get();

		if (!roomRef.exists()) {
			toast.error("Essa sala não existe");
			return;
		}

		if (roomRef.val().endedAt) {
			toast.error("Essa sala foi encerrada");
			return;
		}

		history.push(`/rooms/${roomCode}`);
	}

	return (
		<div id="page-auth">
			<Toaster />
			<aside>
				<img
					src={illustrationImg}
					alt="Ilustração simbolizando perguntas e respostas"
				/>
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo real</p>
			</aside>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="LetMeAsk" />
					<button className="create-room" onClick={handleNewRoom}>
						<img src={googleIconImg} alt="Logo do Google" />
						Crie a sua sala com o Google
					</button>
					<div className="separator">ou entre em uma sala</div>
					<form onSubmit={handleJoinRoom}>
						<input
							type="text"
							placeholder="Digite o código da sala"
							onChange={(event) => setRoomCode(event.target.value)}
							value={roomCode}
						/>
						<Button>Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
