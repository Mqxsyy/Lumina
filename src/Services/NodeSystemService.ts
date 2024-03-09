import Roact from "@rbxts/roact";
import { Event } from "API/Event";
import { IdPool } from "API/IdPool";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystem } from "API/NodeSystem";
import { GetMousePositionOnCanvas } from "WidgetHandler";

// TODO: Add render order changing

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
	};
	finishedBindingGroups: Event;
}

interface NodeSystemCollectioEntry {
	data: NodeSystemData;
	create: (props: NodeSystemData) => Roact.Element;
}

const idPool = new IdPool();
const NodeSystemCollection = [] as NodeSystemCollectioEntry[];

export const NodeSystemsChanged = new Event();

export function GetNextNodeSystemId(): number {
	return idPool.GetNextId();
}

export function UpdateNodeSystemAnchorPoint(id: number, offset: Vector2) {
	const nodeSystem = NodeSystemCollection.find((system) => system.data.id === id);
	if (nodeSystem) {
		nodeSystem.data.anchorPoint = GetMousePositionOnCanvas().add(offset);
		NodeSystemsChanged.Fire();
	} else {
		warn(`NodeSystem with id ${id} not found`);
	}
}

export function GetNodeSystems(): NodeSystemCollectioEntry[] {
	return NodeSystemCollection;
}

export function AddNodeSystem(nodeSystem: NodeSystemCollectioEntry) {
	NodeSystemCollection.push(nodeSystem);
	NodeSystemsChanged.Fire();

	return nodeSystem.data;
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

export function RemoveNodeSystem(id: number) {
	NodeSystemCollection.remove(id);
	NodeSystemsChanged.Fire();
}
