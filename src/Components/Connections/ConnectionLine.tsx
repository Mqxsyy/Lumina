import Roact, { useEffect, useState } from "@rbxts/roact";
import { Event } from "API/Event";
import { AddConnection, ConnectionData, GetNextConnectionId } from "Services/ConnectionsService";
import { StyleColors } from "Style";

export function CreateConnection(startPoint: Vector2, endPoint: Vector2) {
	return AddConnection({
		data: {
			id: GetNextConnectionId(),
			startPoint: startPoint,
			endPoint: endPoint,
			onDestroy: new Event(),
		},
		create: (data: ConnectionData) => {
			return <ConnectionLine key={data.id} data={data} />;
		},
	});
}

interface LineSegment {
	length: number;
	position: Vector2;
	rotation: number;
}

function ConnectionLine({ data }: { data: ConnectionData }) {
	const [startSegment, setStartSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });
	const [middleSegment, setMiddleSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });
	const [endSegment, setEndSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });

	useEffect(() => {
		const xDistance = data.endPoint.X - data.startPoint.X;

		const startPos2 = data.startPoint.add(new Vector2(xDistance * 0.2, 0));
		const endPos2 = data.endPoint.sub(new Vector2(xDistance * 0.2, 0));

		const startSegment = {
			position: data.startPoint,
			length: startPos2.sub(data.startPoint).Magnitude,
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
			position: data.endPoint,
			length: data.endPoint.sub(endPos2).Magnitude,
			rotation: 0,
		} as LineSegment;
		setEndSegment(endSegment);
	}, [data.startPoint, data.endPoint]);

	return (
		<>
			<frame
				AnchorPoint={
					startSegment.position.X < endSegment.position.X ? new Vector2(0, 0.5) : new Vector2(1, 0.5)
				}
				Position={UDim2.fromOffset(startSegment.position.X, startSegment.position.Y)}
				Rotation={startSegment.rotation}
				Size={UDim2.fromOffset(startSegment.length + 1, 3)}
				BackgroundColor3={StyleColors.Highlight}
				BackgroundTransparency={0}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(1, 10)} />
			</frame>
			<frame
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromOffset(middleSegment.position.X, middleSegment.position.Y)}
				Rotation={middleSegment.rotation}
				Size={UDim2.fromOffset(middleSegment.length + 2, 3)}
				BackgroundColor3={StyleColors.Highlight}
				BackgroundTransparency={0}
				BorderSizePixel={0}
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
				BackgroundColor3={StyleColors.Highlight}
				BackgroundTransparency={0}
				BorderSizePixel={0}
			>
				<uicorner CornerRadius={new UDim(1, 10)} />
			</frame>
		</>
	);
}
