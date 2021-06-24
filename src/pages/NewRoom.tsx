import illustrationImg from "../assets/img/illustration.svg";
import logoImg from "../assets/img/logo.svg";
import "../assets/scss/auth.scss";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../contexts/AuthContext";

export function NewRoom() {
	// const { user } = useContext(AuthContext);

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
					<h2>Criar uma nova sala</h2>
					<form>
						<input type="text" placeholder="Nome da sala" />
						<Button>Entrar na sala</Button>
					</form>
					<p>
						Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
