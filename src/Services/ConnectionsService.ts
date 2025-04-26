import type React from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { Event } from "API/Bindables/Event";
import { IdPool } from "API/IdPool";
import { ValueType } from "API/Nodes/FieldStates";
import type { ParticleData } from "API/ParticleService";
import { CreateConnectionLine } from "Components/Connections/ConnectionLine";
import { ReloadConnectionVisuals } from "Components/Events";
import StyleConfig from "Components/StyleConfig";
import { GetMousePositionOnCanvas } from "MainWindow";
import { StyleColors } from "API/Style";
import type { NodeData } from "./NodesService";

export interface ConnectionData {
    id: number;
    loadedId?: number;
    valueType: string;
    startNode: NodeData;
    startElement: ImageButton;
    endPos?: Vector2;
    endElement?: ImageButton;
    fn: (data: ParticleData) => number | Vector2 | Vector3;
    isDestroying: boolean;
    onDestroy: Event;
}

export interface ConnectionCollectionEntry {
    data: ConnectionData;
    create: (props: ConnectionData) => React.Element;
}

let movingConnectionId = -1;

const idPool = new IdPool();
const ConnectionCollection = [] as ConnectionCollectionEntry[];

export function GetNextConnectionId(): number {
    return idPool.GetNextId();
}

export function GetAllConnections(): ConnectionCollectionEntry[] {
    return ConnectionCollection;
}

export function GetConnectionById(id: number) {
    return ConnectionCollection.find((connection) => connection.data.id === id);
}

export function CreateConnection(
    startNode: NodeData,
    startElement: ImageButton,
    valueType: string,
    fn: (data: ParticleData) => number | Vector2 | Vector3,
    loadedId?: number,
) {
    const connection: ConnectionCollectionEntry = {
        data: {
            id: idPool.GetNextId(),
            valueType,
            loadedId,
            startNode,
            startElement,
            fn,
            isDestroying: false,
            onDestroy: new Event(),
        },
        create: CreateConnectionLine,
    };

    ConnectionCollection.push(connection);
    return connection.data;
}

export function UpdateConnectionData(id: number, fn: (data: ConnectionData) => ConnectionData) {
    const connection = GetConnectionById(id);
    if (connection === undefined) {
        warn("Failed to update connection data. Id not found");
        return;
    }

    connection.data.isDestroying = false;
    connection.data = fn(connection.data);
    ReloadConnectionVisuals.Fire();
}

export function DestroyConnection(id: number) {
    const index = ConnectionCollection.findIndex((connection) => connection.data.id === id);
    if (index !== -1) {
        ConnectionCollection[index].data.isDestroying = true;

        coroutine.wrap(() => {
            RunService.RenderStepped.Wait();
            const removingIndex = ConnectionCollection.findIndex((connection) => connection.data.id === id);
            if (ConnectionCollection[removingIndex].data.isDestroying === false) return;

            const connection = ConnectionCollection.remove(removingIndex) as ConnectionCollectionEntry;
            connection.data.onDestroy.Fire();
            ReloadConnectionVisuals.Fire();
        })();

        return;
    }

    warn("Failed to delete connection. Id not found");
}

export function StartMovingConnection(id: number) {
    movingConnectionId = id;

    RunService.BindToRenderStep("MoveConnection", 200, () => {
        const mousePosition = GetMousePositionOnCanvas();

        UpdateConnectionData(movingConnectionId, (data) => {
            data.endPos = mousePosition;
            return data;
        });
    });
}

export function UnbindMovingConnection(destroyConnection = false) {
    if (movingConnectionId === -1) return;

    RunService.UnbindFromRenderStep("MoveConnection");

    if (destroyConnection) {
        DestroyConnection(movingConnectionId);
    } else {
        UpdateConnectionData(movingConnectionId, (data) => {
            data.endPos = undefined;
            return data;
        });
    }

    movingConnectionId = -1;
}

export function GetMovingConnectionId() {
    return movingConnectionId;
}
