import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { Event } from "API/Event";
import { IdPool } from "API/IdPool";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { GetMousePositionOnCanvas } from "WidgetHandler";

export interface ConnectionData {
	id: number;
	startPoint: Vector2;
	endPoint: Vector2;
	onDestroy: Event;
}

interface ConnectionCollectionEntry {
	data: ConnectionData;
	create: (props: ConnectionData) => Roact.Element;
}

let movingConnectionFn = undefined as (() => number) | undefined;
let movingConnectioNode = undefined as LogicNode | undefined;
let movingConnectionId = -1;

const idPool = new IdPool();
const ConnectionCollection = [] as ConnectionCollectionEntry[];

export const ConnectionsChanged = new Event();

export function GetNextConnectionId(): number {
	return idPool.GetNextId();
}

export function UpdateConnectionStart(id: number, startPoint: Vector2) {
	const connection = ConnectionCollection.find((connection) => connection.data.id === id);
	if (connection) {
		connection.data.startPoint = startPoint;
		ConnectionsChanged.Fire();
	} else {
		warn(`Connection with id ${id} not found`);
	}
}

export function UpdateConnectionEnd(id: number, endPoint: Vector2) {
	const connection = ConnectionCollection.find((connection) => connection.data.id === id);
	if (connection) {
		connection.data.endPoint = endPoint;
		ConnectionsChanged.Fire();
	} else {
		warn(`Connection with id ${id} not found`);
	}
}

export function GetAllConnections(): ConnectionCollectionEntry[] {
	return ConnectionCollection;
}

export function GetConnectionById(id: number) {
	return ConnectionCollection.find((connection) => connection.data.id === id);
}

export function AddConnection(connection: ConnectionCollectionEntry) {
	ConnectionCollection.push(connection);
	ConnectionsChanged.Fire();
	return connection.data;
}

export function RemoveConnection(id: number) {
	const index = ConnectionCollection.findIndex((connection) => connection.data.id === id);
	if (index !== -1) {
		idPool.ReleaseId(id);

		const connection = ConnectionCollection.remove(index);
		connection!.data.onDestroy.Fire();
		ConnectionsChanged.Fire();
		return;
	}

	warn(`Failed to delete connection. Id not found`);
}

export function BindConnectionMoving(id: number, fn: () => number, node: LogicNode) {
	movingConnectionId = id;
	movingConnectionFn = fn;
	movingConnectioNode = node;

	RunService.BindToRenderStep("MoveConnection", 200, () => {
		UpdateConnectionEnd(id, GetMousePositionOnCanvas());
	});
}

export function UnbindConnectionMoving(destroyConnection = false) {
	if (movingConnectionId === -1) return;

	RunService.UnbindFromRenderStep("MoveConnection");

	if (destroyConnection) {
		RemoveConnection(movingConnectionId);
	}

	movingConnectionId = -1;
	movingConnectionFn = undefined;
	movingConnectioNode = undefined;
}

export function GetMovingConnection() {
	return { id: movingConnectionId, fn: movingConnectionFn, node: movingConnectioNode };
}
