import { HttpService } from "@rbxts/services";
import { GetSavesFolder } from "API/FolderLocations";
import { SaveData, SerializedField, SerializedNode, SerializedSystem } from "./SaveData";
import { API_VERSION } from "API/ExportAPI";
import { GetNodeSystems } from "Services/NodeSystemService";
import { Node } from "API/Nodes/Node";

const savesFolder = GetSavesFolder();

export function SaveToFile() {
	const container = new Instance("ModuleScript");
	const data: SaveData = {
		version: API_VERSION,
		systems: [],
	};

	const systems = GetNodeSystems();
	systems.forEach((system) => {
		const anchorPoint = system.data.anchorPoint;

		const serializedSystem: SerializedSystem = {
			anchorPoint: { x: anchorPoint.X, y: anchorPoint.Y },
			groups: {
				spawn: [],
				initialize: [],
				update: [],
				render: [],
				logic: [],
			},
		};

		const spawnNode = system.data.system.spawnNode;
		if (spawnNode !== undefined) {
			serializedSystem.groups.spawn.push(SerializeNode(spawnNode));
		}

		const initializeNodes = system.data.system.initializeNodes;
		initializeNodes.forEach((node) => {
			serializedSystem.groups.initialize.push(SerializeNode(node));
		});

		const updateNodes = system.data.system.updateNodes;
		updateNodes.forEach((node) => {
			serializedSystem.groups.update.push(SerializeNode(node));
		});

		const renderNode = system.data.system.renderNode;
		if (renderNode !== undefined) {
			serializedSystem.groups.render.push(SerializeNode(renderNode));
		}

		data.systems.push(serializedSystem);
	});

	container.Source = HttpService.JSONEncode(data);
	container.Parent = savesFolder;
}

function SerializeNode(node: Node): SerializedNode {
	const serializedSpawnNode: SerializedNode = {
		nodeName: node.GetNodeName(),
		fields: [],
	};

	for (const [key, value] of pairs(node.nodeFields)) {
		const serializedField: SerializedField = {
			name: key as string,
			data: value.SerializeData(),
		};

		serializedSpawnNode.fields.push(serializedField);
	}

	return serializedSpawnNode;
}
