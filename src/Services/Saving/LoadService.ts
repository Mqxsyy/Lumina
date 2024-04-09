import { HttpService } from "@rbxts/services";
import { NodeGroups } from "API/NodeGroup";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";
import { NodeList } from "Lists/NodesList";
import { SaveData } from "./SaveData";
import { NodeData } from "Services/NodesService";

// TODO: load connections 💀💀💀

const Selection = game.GetService("Selection");

export function LoadFromFile() {
	const selection = Selection.Get();

	if (selection.size() === 0) {
		warn("Please select a file to load from.");
		return;
	}

	if (selection.size() > 1) {
		warn("Please select only one file to load from.");
		return;
	}

	const selectedInstance = selection[0];
	if (selectedInstance.IsA("ModuleScript") === false) {
		warn("Please select a valid file to load from.");
		return;
	}

	const data = HttpService.JSONDecode((selectedInstance as ModuleScript).Source) as SaveData;

	for (const system of data.systems) {
		const anchorPoint = new Vector2(system.anchorPoint.x, system.anchorPoint.y);
		const systemData = CreateEmptySystem(anchorPoint);

		systemData.finishedBindingGroups.Connect(() => {
			for (const [group, nodes] of pairs(system.groups)) {
				let nodeGroup = NodeGroups.Spawn;

				if (group === "initialize") {
					nodeGroup = NodeGroups.Initialize;
				} else if (group === "update") {
					nodeGroup = NodeGroups.Update;
				} else if (group === "render") {
					nodeGroup = NodeGroups.Render;
				} else if (group === "logic") {
					nodeGroup = NodeGroups.Logic;
				}

				for (const node of nodes) {
					const nodeData = NodeList[nodeGroup][node.nodeName].create!() as NodeData;

					for (const field of node.fields) {
						nodeData.node.nodeFields[field.name].ReadSerializedData(field.data);
					}

					if (nodeGroup !== NodeGroups.Logic) {
						nodeData.elementLoaded.Connect(() => {
							systemData.addToNodeGroup[nodeGroup]!(nodeData.id);
						});
					}
				}
			}
		});
	}
}
