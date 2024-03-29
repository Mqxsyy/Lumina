import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import Div from "Components/Div";
import { StyleColors } from "Style";

interface Props {
	Id: number;
	Position: UDim2;
	TimeLock?: number;
	OnSelect: (id: number, isTimeLocked: boolean) => void;
	UpdatePoint: (id: number, horizontalLock: number) => void;
	RemovePoint?: (id: number) => void;
}

export default function LineGraphPoint({
	Id,
	Position,
	TimeLock = -1,
	OnSelect,
	UpdatePoint,
	RemovePoint = undefined,
}: Props) {
	const onMouseButton1Down = () => {
		OnSelect(Id, TimeLock !== -1);

		RunService.BindToRenderStep("MoveGraphPoint", Enum.RenderPriority.Input.Value, () => {
			UpdatePoint(Id, TimeLock);
		});
	};

	const onMouseButton1Up = () => {
		RunService.UnbindFromRenderStep("MoveGraphPoint");
	};

	const onMouseButton2Up = () => {
		if (RemovePoint === undefined) return;
		RemovePoint(Id);
	};

	return (
		<Div
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={Position}
			Size={UDim2.fromOffset(6, 6)}
			BackgroundColor={StyleColors.Highlight}
			onMouseButton1Down={onMouseButton1Down}
			onMouseButton1Up={onMouseButton1Up}
			onMouseButton2Up={onMouseButton2Up}
		>
			<uicorner CornerRadius={new UDim(1, 0)} />
		</Div>
	);
}
