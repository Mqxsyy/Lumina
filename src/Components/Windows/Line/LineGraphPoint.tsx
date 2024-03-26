import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { RemapValue, RoundDecimal } from "API/Lib";
import Div from "Components/Div";
import { StyleColors } from "Style";
import { GetWindow, Windows } from "Windows/WindowSevice";

interface Props {
	Id: number;
	Position: UDim2;
	LockHorizontal?: number;
	UpdatePoint: (id: number, time: number, value: number) => void;
	RemovePoint?: (id: number) => void;
}

export default function LineGraphPoint({
	Id,
	Position,
	LockHorizontal = -1,
	UpdatePoint,
	RemovePoint = undefined,
}: Props) {
	const [isDragging, setIsDragging] = useState(false);

	const onMouseButton1Down = () => {
		setIsDragging(true);
	};

	const onMouseButton1Up = () => {
		setIsDragging(false);
		RunService.UnbindFromRenderStep("MoveGraphPoint");
	};

	const onMouseButton2Up = () => {
		if (RemovePoint === undefined) return;
		RemovePoint(Id);
	};

	useEffect(() => {
		if (isDragging) {
			RunService.BindToRenderStep("MoveGraphPoint", 110, () => {
				const window = GetWindow(Windows.ValueGraph)!;
				const mousePosition = window.GetRelativeMousePosition();

				const percentX = mousePosition.X / window.AbsoluteSize.X;
				const percentY = mousePosition.Y / window.AbsoluteSize.Y;

				const x = RoundDecimal(math.clamp(percentX, 0.1, 0.9), 0.01);
				const y = RoundDecimal(math.clamp(1 - percentY, 0.1, 0.9), 0.01);

				if (LockHorizontal !== -1) {
					UpdatePoint(Id, LockHorizontal, RemapValue(y, 0.1, 0.9, 0, 1));
					return;
				}

				UpdatePoint(Id, RemapValue(x, 0.1, 0.9, 0, 1), RemapValue(y, 0.1, 0.9, 0, 1));
			});
		}

		return () => {
			RunService.UnbindFromRenderStep("MoveGraphPoint");
		};
	});

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
