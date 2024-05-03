import React from "@rbxts/react";
import { Event } from "API/Bindables/Event";
import { IdPool } from "API/IdPool";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystem } from "API/NodeSystem";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { GetZoomScale } from "ZoomScale";

type AllowedNodeGroups = NodeGroups.Spawn | NodeGroups.Initialize | NodeGroups.Update | NodeGroups.Render;

export interface NodeSystemData {
    id: number;
    anchorPoint: Vector2;
    system: NodeSystem;
    addToNodeGroup: {
        [NodeGroups.Spawn]: undefined | ((id: number) => void);
        [NodeGroups.Initialize]: undefined | ((id: number) => void);
        [NodeGroups.Update]: undefined | ((id: number) => void);
        [NodeGroups.Render]: undefined | ((id: number) => void);
        [NodeGroups.Logic]: never;
    };
    finishedBindingGroups: Event;
    onDestroy: Event<[NodeSystemData]>;
}

export interface NodeSystemCollectioEntry {
    data: NodeSystemData;
    create: (props: NodeSystemData) => React.Element;
}

const idPool = new IdPool();
const NodeSystemCollection = [] as NodeSystemCollectioEntry[];
export const NodeSystemsChanged = new Event();

export function GetNextSystemId(): number {
    return idPool.GetNextId();
}

export function GetAllSystems(): NodeSystemCollectioEntry[] {
    return NodeSystemCollection;
}

export function GetSystemById(id: number) {
    return NodeSystemCollection.find((system) => system.data.id === id);
}

export function AddSystem(api: NodeSystem, create: (data: NodeSystemData) => React.Element, position?: Vector2) {
    const collectionEntry: NodeSystemCollectioEntry = {
        data: {
            id: GetNextSystemId(),
            anchorPoint: position || GetMousePositionOnCanvas().div(GetZoomScale()),
            system: api,
            addToNodeGroup: {
                [NodeGroups.Spawn]: undefined,
                [NodeGroups.Initialize]: undefined,
                [NodeGroups.Update]: undefined,
                [NodeGroups.Render]: undefined,
                [NodeGroups.Logic]: undefined as never,
            },
            finishedBindingGroups: new Event(),
            onDestroy: new Event(),
        },
        create,
    };

    NodeSystemCollection.push(collectionEntry);
    NodeSystemsChanged.Fire();

    return collectionEntry;
}

export function BindNodeGroupFunction(id: number, group: NodeGroups, fn: (id: number) => void) {
    const nodeSystem = NodeSystemCollection.find((system) => system.data.id === id);
    if (nodeSystem) {
        nodeSystem.data.addToNodeGroup[group as AllowedNodeGroups] = fn;

        let hasMounted = true;

        // soo ugly
        if (nodeSystem.data.addToNodeGroup[NodeGroups.Spawn] === undefined) {
            hasMounted = false;
        }

        if (nodeSystem.data.addToNodeGroup[NodeGroups.Initialize] === undefined) {
            hasMounted = false;
        }

        if (nodeSystem.data.addToNodeGroup[NodeGroups.Update] === undefined) {
            hasMounted = false;
        }

        if (nodeSystem.data.addToNodeGroup[NodeGroups.Render] === undefined) {
            hasMounted = false;
        }

        if (hasMounted) {
            nodeSystem.data.finishedBindingGroups.Fire();
        }

        return;
    }

    warn(`NodeSystem with id ${id} not found`);
}

export function UpdateSystemData(id: number, callback: (data: NodeSystemData) => NodeSystemData) {
    const nodeSystem = GetSystemById(id);
    if (nodeSystem) {
        nodeSystem.data = callback(nodeSystem.data);
        NodeSystemsChanged.Fire();
        return;
    }

    warn(`Failed to update system data. Id not found`);
}

export function RemoveNodeSystem(id: number) {
    const index = NodeSystemCollection.findIndex((system) => system.data.id === id);
    if (index !== -1) {
        const nodeSystem = NodeSystemCollection[index];
        nodeSystem.data.onDestroy.Fire(nodeSystem.data);

        NodeSystemCollection.remove(index);
        NodeSystemsChanged.Fire();
        return;
    }

    warn(`Failed to delete system. Id not found`);
}
