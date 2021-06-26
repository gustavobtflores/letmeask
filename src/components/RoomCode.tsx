import toast from "react-hot-toast";
import copyImg from "../assets/img/copy.svg";
import "../assets/scss/room-code.scss";

type RoomCodeProps = {
	code: string;
};

export function RoomCode(props: RoomCodeProps) {
	async function copyRoomCodeToClipboard() {
		await navigator.clipboard.writeText(props.code);
		toast.success("Copiado para área de transferência");
	}

	return (
		<button className="room-code" onClick={copyRoomCodeToClipboard}>
			<div>
				<img src={copyImg} alt="Copy room code" />
			</div>
			<span>Sala #{props.code}</span>
		</button>
	);
}
