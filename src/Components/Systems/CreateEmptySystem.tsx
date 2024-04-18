import Roact from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystem as NodeSystemAPI } from "API/NodeSystem";
import { AddNodeSystem, GetNextNodeSystemId } from "Services/NodeSystemService";
import NodeSystem from "./NodeSystem";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";

export function CreateEmptySystem(position?: Vector2) {
	return AddNodeSystem({
		data: {
			id: GetNextNodeSystemId(),
			anchorPoint: position || GetMousePositionOnCanvas(),
			system: new NodeSystemAPI(),
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
		create: (systemData) => <NodeSystem key={`system_${systemData.id}`} data={systemData} />,
	});
}
