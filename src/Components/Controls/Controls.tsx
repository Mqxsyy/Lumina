import Roact from "@rbxts/roact";
import { Div } from "../Div";
import { ControlButton } from "./ControlButton";
import { GetNodeSystems } from "Services/NodeSystemService";
import { ClearParticles } from "API/FolderLocations";
import ExportAPI from "API/ExportAPI";
import ExportAsScript from "API/VFXScriptCreator";

const CANVAS_PADDING = 5;
const BUTTONS_PADDING = 5;
const BUTTON_WIDTH = 125;
const BUTTON_HEIGHT = 25;

export function Controls() {
	const Start = () => {
		const nodeSystems = GetNodeSystems();
		nodeSystems.forEach((nodeSystem) => {
			nodeSystem.data.system.Run();
		});
	};

	const Stop = () => {
		const nodeSystems = GetNodeSystems();
		nodeSystems.forEach((nodeSystem) => {
			nodeSystem.data.system.Stop();
		});
	};

	const ClearLeftover = () => {
		ClearParticles();
	};

	const Export = () => {
		ExportAPI();
		ExportAsScript();
	};

	return (
		<Div
			AnchorPoint={new Vector2(1, 0)}
			Position={new UDim2(1, -CANVAS_PADDING, 0, CANVAS_PADDING)}
			Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT * 2 + BUTTONS_PADDING)}
		>
			<ControlButton
				Position={UDim2.fromOffset(0, 0)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Start"
				MouseButton1Down={Start}
			/>
			<ControlButton
				Position={UDim2.fromOffset(0, BUTTON_HEIGHT + BUTTONS_PADDING)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Stop"
				MouseButton1Down={Stop}
			/>
			<ControlButton
				Position={UDim2.fromOffset(0, (BUTTON_HEIGHT + BUTTONS_PADDING) * 2)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Clear Leftover"
				MouseButton1Down={ClearLeftover}
			/>
			<ControlButton
				Position={UDim2.fromOffset(0, (BUTTON_HEIGHT + BUTTONS_PADDING) * 3)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Export"
				MouseButton1Down={Export}
			/>
		</Div>
	);
}
