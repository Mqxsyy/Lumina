import Roact from "@rbxts/roact";
import Div from "../Div";
import { ControlButton } from "./ControlButton";
import { GetAllSystems } from "Services/NodeSystemService";
import ExportAPI from "API/ExportAPI";
import ExportAsScript from "API/VFXScriptCreator";
import { SaveToFile } from "Services/Saving/SaveService";
import { LoadFromFile } from "Services/Saving/LoadService";

const CANVAS_PADDING = 5;
const BUTTONS_PADDING = 5;
const BUTTON_WIDTH = 125;
const BUTTON_HEIGHT = 25;

export function Controls() {
	const Start = () => {
		const nodeSystems = GetAllSystems();
		nodeSystems.forEach((nodeSystem) => {
			nodeSystem.data.system.Run();
		});
	};

	const Stop = () => {
		const nodeSystems = GetAllSystems();
		nodeSystems.forEach((nodeSystem) => {
			nodeSystem.data.system.Stop();
		});
	};

	const Export = () => {
		ExportAPI();
		const conversionFiles = ExportAsScript();
		conversionFiles.forEach((conversionFile) => {
			const saveData = SaveToFile();
			saveData.Parent = conversionFile;
		});
	};

	const Save = () => {
		SaveToFile();
	};

	const Load = () => {
		LoadFromFile();
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
				Text="Export"
				MouseButton1Down={Export}
			/>
			<ControlButton
				Position={UDim2.fromOffset(0, (BUTTON_HEIGHT + BUTTONS_PADDING) * 3)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Save"
				MouseButton1Down={Save}
			/>
			<ControlButton
				Position={UDim2.fromOffset(0, (BUTTON_HEIGHT + BUTTONS_PADDING) * 4)}
				Size={UDim2.fromOffset(BUTTON_WIDTH, BUTTON_HEIGHT)}
				Text="Load"
				MouseButton1Down={Load}
			/>
		</Div>
	);
}
