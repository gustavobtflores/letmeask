import { useHistory } from "react-router-dom";
import illustrationImg from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";
import googleIconImg from "../assets/img/google-icon.svg";
import { Button } from "../components/Button";
import "../assets/scss/auth.scss";
import { useAuth } from "../hooks/useAuth";

export function Home() {
	const history = useHistory();
	const { user, signInWithGoogle } = useAuth();

	async function handleNewRoom() {
		if (!user) {
			await signInWithGoogle();
		}
		history.push("/rooms/new");
	}

	return (
		<div id="page-auth">
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
					<form>
						<input type="text" placeholder="Digite o código da sala" />
						<Button>Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
