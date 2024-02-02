import Roact, { useEffect, useState } from "@rbxts/roact";
import { StyleColors } from "Style";

interface Props {
	startPos: Vector2;
	endPos: Vector2;
	zIndex: number;
	rerender: boolean;
}

interface LineSegment {
	length: number;
	position: Vector2;
	rotation: number;
}

export function SimpleLine({ startPos, endPos, zIndex, rerender }: Props) {
	const [startSegment, setStartSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });
	const [middleSegment, setMiddleSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });
	const [endSegment, setEndSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });

	const [forceRerender, setForceRerender] = useState(false);

	useEffect(() => {
		const xDistance = endPos.X - startPos.X;

		const startPos2 = startPos.add(new Vector2(xDistance * 0.2, 0));
		const endPos2 = endPos.sub(new Vector2(xDistance * 0.2, 0));

		const startSegment = {
			position: startPos,
			length: startPos2.sub(startPos).Magnitude,
			rotation: 0,
		} as LineSegment;
		setStartSegment(startSegment);

		const vectorDiff = endPos2.sub(startPos2);
		const rotationRad = math.atan2(vectorDiff.Y, vectorDiff.X);

		const middleSegement = {
			position: startPos2.add(endPos2.sub(startPos2).mul(0.5)),
			length: vectorDiff.Magnitude,
			rotation: math.round(math.deg(rotationRad)),
		} as LineSegment;
		setMiddleSegment(middleSegement);

		const endSegment = {
			position: endPos,
			length: endPos.sub(endPos2).Magnitude,
			rotation: 0,
		} as LineSegment;
		setEndSegment(endSegment);
	}, [startPos, endPos, rerender]);

	return (
		<>
			<frame
				AnchorPoint={
					startSegment.position.X < endSegment.position.X ? new Vector2(0, 0.5) : new Vector2(1, 0.5)
				}
				Position={UDim2.fromOffset(startSegment.position.X, startSegment.position.Y)}
				Rotation={startSegment.rotation}
				Size={UDim2.fromOffset(startSegment.length + 1, 3)}
				BackgroundColor3={StyleColors.hex200}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				ZIndex={zIndex}
			>
				<uicorner CornerRadius={new UDim(1, 10)} />
			</frame>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromOffset(middleSegment.position.X, middleSegment.position.Y)}
				Rotation={middleSegment.rotation}
				Size={UDim2.fromOffset(middleSegment.length + 2, 3)}
				BackgroundColor3={StyleColors.hex200}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				ZIndex={zIndex}
			>
				<uicorner CornerRadius={new UDim(1, 10)} />
			</frame>
			<frame
				AnchorPoint={
					startSegment.position.X < endSegment.position.X ? new Vector2(1, 0.5) : new Vector2(0, 0.5)
				}
				Position={UDim2.fromOffset(endSegment.position.X, endSegment.position.Y)}
				Rotation={endSegment.rotation}
				Size={UDim2.fromOffset(endSegment.length + 1, 3)}
				BackgroundColor3={StyleColors.hex200}
				BackgroundTransparency={0}
				BorderSizePixel={0}
				ZIndex={zIndex}
			>
				<uicorner CornerRadius={new UDim(1, 10)} />
			</frame>

			{/*<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromOffset(startPos.X, startPos.Y)}
				Size={UDim2.fromOffset(10, 10)}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromHex("#00FF00")}
			/>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromOffset(endPos.X, endPos.Y)}
				Size={UDim2.fromOffset(10, 10)}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromHex("#00FF00")}
			/>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromOffset(startPos2.X, startPos2.Y)}
				Size={UDim2.fromOffset(10, 10)}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromHex("#00FF00")}
			/>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromOffset(
					startPos2.X + (endPos2.X - startPos2.X) * 0.5,
					startPos2.Y + (endPos2.Y - startPos2.Y) * 0.5,
				)}
				Size={UDim2.fromOffset(10, 10)}
				BackgroundTransparency={0}
				BackgroundColor3={Color3.fromHex("#00FF00")}
            />*/}
		</>
	);
}
