import Roact, { useEffect, useRef } from "@rbxts/roact";
import { ColorField } from "API/Fields/ColorField";
import Div from "Components/Div";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { LoadColorPickerAPI } from "../Pickers.tsx/ColorPicker";
import { RunService } from "@rbxts/services";

const DOUBLE_CLICK_TIME = 0.25;

interface Props {
	Id: number;
	Position: UDim2;
	Color: ColorField;
	UpdateTime: ((id: number, time: number) => void) | undefined;
	RemovePoint: ((id: number) => void) | undefined;
}

export default function ColorRampPoint({ Id, Position, Color, UpdateTime, RemovePoint }: Props) {
	const lastClickTime = useRef(0);
	const colorWindow = useRef<DockWidgetPluginGui>();

	const onMouseButton1Down = () => {
		if (os.clock() - lastClickTime.current < DOUBLE_CLICK_TIME) {
			LoadColorPickerAPI(Color);
			colorWindow.current!.Enabled = true;
			return;
		}

		if (UpdateTime !== undefined) {
			RunService.BindToRenderStep("ColorRampPoint", Enum.RenderPriority.Input.Value, () => {
				const window = GetWindow(Windows.ColorRamp)!;
				const mousePosition = window.GetRelativeMousePosition();

				const padding = window.AbsoluteSize.X * 0.1;
				const max = window.AbsoluteSize.X * 0.8;
				const x = math.clamp(mousePosition.X - padding, 0, max);
				UpdateTime(Id, x / max);
			});
		}

		lastClickTime.current = os.clock();
	};

	const onMouseButton1Up = () => {
		if (UpdateTime === undefined) return;
		RunService.UnbindFromRenderStep("ColorRampPoint");
	};

	const onMouseButton2Down = () => {
		if (RemovePoint === undefined) return;
		RemovePoint(Id);
	};

	useEffect(() => {
		colorWindow.current = GetWindow(Windows.ColorPicker);
	});

	return (
		<Div
			AnchorPoint={new Vector2(0.5, 0)}
			Position={Position}
			Size={UDim2.fromOffset(10, 10)}
			onMouseButton1Down={onMouseButton1Down}
			onMouseButton1Up={onMouseButton1Up}
			onMouseButton2Down={onMouseButton2Down}
		>
			<imagelabel Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1} Image={"rbxassetid://13873199961"} />
		</Div>
	);
}
