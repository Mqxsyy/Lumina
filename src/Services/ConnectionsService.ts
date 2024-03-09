import Roact from "@rbxts/roact";
import { Event } from "API/Event";
import { IdPool } from "API/IdPool";

export interface ConnectionData {
	id: number;
	startPoint: Vector2;
	endPoint: Vector2;
}

interface ConnectionCollectionEntry {
	data: ConnectionData;
	create: (props: ConnectionData) => Roact.Element;
}

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

		ConnectionCollection.remove(index);
		ConnectionsChanged.Fire();
		return;
	}

	warn(`Failed to delete connection. Id not found`);
}
