import Roact, { useEffect, useRef } from "@rbxts/roact";
import Div from "Components/Div";
import { StyleColors } from "Style";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;
	ConnectionId?: number;
	MouseButton1Down?: (element: TextButton) => void;
	MouseButton1Up?: (element: TextButton) => void;
	UpdateConnecton?: (element: TextButton) => void;
}

export default function ConnectionPoint({
	AnchorPoint = new Vector2(0, 0),
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	ConnectionId = undefined,
	MouseButton1Down = undefined,
	MouseButton1Up = undefined,
	UpdateConnecton = undefined,
}: Props) {
	const connectionPointRef = useRef(undefined as undefined | TextButton);

	useEffect(() => {
		if (ConnectionId === undefined) return;
		if (UpdateConnecton === undefined) return;

		UpdateConnecton(connectionPointRef.current!);
	}, [connectionPointRef.current?.AbsolutePosition, ConnectionId]);

	return (
		<textbutton
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			SizeConstraint="RelativeYY"
			BackgroundTransparency={1}
			AutoButtonColor={false}
			Text={""}
			Active={true}
			ref={connectionPointRef}
			Event={{
				InputBegan: (element, input) => {
					if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
					if (MouseButton1Down === undefined) return;

					MouseButton1Down(element);
				},

				InputEnded: (element, input) => {
					if (input.UserInputType !== Enum.UserInputType.MouseButton1) return;
					if (MouseButton1Up === undefined) return;

					MouseButton1Up(element);
				},
			}}
		>
			<uipadding
				PaddingBottom={new UDim(0, 5)}
				PaddingLeft={new UDim(0, 5)}
				PaddingRight={new UDim(0, 5)}
				PaddingTop={new UDim(0, 5)}
			/>

			<Div Size={UDim2.fromOffset(Size.X.Offset - 10, Size.Y.Offset - 10)} SizeConstaint="RelativeYY">
				<uicorner CornerRadius={new UDim(2, 0)} />
				<uistroke Color={StyleColors.Highlight} Thickness={2} />
				<uipadding
					PaddingBottom={new UDim(0, 2)}
					PaddingLeft={new UDim(0, 2)}
					PaddingRight={new UDim(0, 2)}
					PaddingTop={new UDim(0, 2)}
				/>

				{ConnectionId !== undefined && (
					<frame
						Size={UDim2.fromOffset(Size.X.Offset - 14, Size.Y.Offset - 14)}
						BackgroundColor3={StyleColors.Highlight}
					>
						<uicorner CornerRadius={new UDim(2, 0)} />
					</frame>
				)}
			</Div>
		</textbutton>
	);
}
