import Roact from "@rbxts/roact";
import { Event } from "API/Bindables/Event";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystem as NodeSystemAPI } from "API/NodeSystem";
import { AddNodeSystem, GetNextNodeSystemId } from "Services/NodeSystemService";
import NodeSystem from "./NodeSystem";
import { GetMousePositionOnCanvas } from "Windows/MainWindow";

export function CreateEmptySystem() {
	return AddNodeSystem({
		data: {
			id: GetNextNodeSystemId(),
			anchorPoint: GetMousePositionOnCanvas(),
			system: new NodeSystemAPI(),
			addToNodeGroup: {
				[NodeGroups.Spawn]: undefined,
				[NodeGroups.Initialize]: undefined,
				[NodeGroups.Update]: undefined,
				[NodeGroups.Render]: undefined,
			},
			finishedBindingGroups: new Event(),
		},
		create: (data) => <NodeSystem key={data.id} data={data} />,
	});
}
