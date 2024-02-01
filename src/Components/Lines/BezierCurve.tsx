import Roact, { useEffect, useState } from "@rbxts/roact";
import { StyleColors } from "Style";

// TODO: try to make a 3 segment line isntead of bezier, maybe better visuals and def better performance

interface Props {
	startPos: Vector2;
	endPos: Vector2;
	zIndex: number;
}

interface CurveSegment {
	length: number;
	position: Vector2;
	rotation: number;
}

export function BezierCurve({ startPos, endPos, zIndex }: Props) {
	const [curveSegments, setCurveSegments] = useState([] as CurveSegment[]);

	useEffect(() => {
		const xDistance = (endPos.X - startPos.X) / 2;
		const newCurveSegments = [] as CurveSegment[];

		const startPos2 = startPos.add(new Vector2(xDistance, 0));
		const endPos2 = endPos.sub(new Vector2(xDistance, 0));

		for (let t = 0; t <= 1.01; t += 0.01) {
			const oneMinusT = 1 - t;

			const x =
				oneMinusT ** 3 * startPos.X +
				3 * oneMinusT ** 2 * t * startPos2.X +
				3 * oneMinusT * t ** 2 * endPos2.X +
				t ** 3 * endPos.X;
			const y =
				oneMinusT ** 3 * startPos.Y +
				3 * oneMinusT ** 2 * t * startPos2.Y +
				3 * oneMinusT * t ** 2 * endPos2.Y +
				t ** 3 * endPos.Y;

			const position = new Vector2(math.round(x), math.round(y));

			let length = 0;
			let rotation = 0;

			const lastSegment = newCurveSegments[newCurveSegments.size() - 1];
			if (lastSegment !== undefined) {
				const lastPos = lastSegment.position;

				length = math.ceil(position.sub(lastPos).Magnitude) + 1;

				const vectorDiff = lastPos.sub(position);
				const rotationRad = math.atan2(vectorDiff.Y, vectorDiff.X);
				rotation = math.round(math.deg(rotationRad));
			}

			newCurveSegments.push({ position, length, rotation });
		}

		setCurveSegments(newCurveSegments);
	}, [startPos, endPos]);

	return (
		<>
			{curveSegments.map((lineSegment) => {
				return (
					<frame
						AnchorPoint={new Vector2(1, 0.5)}
						Position={UDim2.fromOffset(lineSegment.position.X, lineSegment.position.Y)}
						Rotation={lineSegment.rotation}
						Size={UDim2.fromOffset(lineSegment.length, 2)}
						// Size={UDim2.fromOffset(5, 5)}
						BackgroundColor3={StyleColors.hex200}
						BackgroundTransparency={0}
						BorderSizePixel={0}
						ZIndex={zIndex}
					>
						{/* <uicorner CornerRadius={new UDim(1, 100)} /> */}
					</frame>
				);
			})}
			{/* <frame
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
			/> */}
		</>
	);
}
