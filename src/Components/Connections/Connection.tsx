import Roact, { useEffect, useState } from "@rbxts/roact";
import { AddConnection, ConnectionData, GetNextConnectionId } from "Services/ConnectionsService";

export function CreateConnection() {
	return AddConnection({
		data: {
			id: GetNextConnectionId(),
			startPoint: new Vector2(0, 0),
			endPoint: new Vector2(0, 0),
		},
		create: (data: ConnectionData) => {
			return <Connection key={data.id} data={data} />;
		},
	});
}

function Connection({ data }: { data: ConnectionData }) {
	const [startPos, setStartPos] = useState(UDim2.fromOffset(0, 0));
	const [endPos, setEndPos] = useState(UDim2.fromOffset(0, 0));

	useEffect(() => {
		setStartPos(UDim2.fromOffset(data.startPoint.X, data.startPoint.Y));
	}, [data.startPoint]);

	return <frame Position={startPos} Size={UDim2.fromOffset(10, 10)}></frame>;
}
