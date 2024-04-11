import { HttpService } from "@rbxts/services";
import { GetSavesFolder } from "API/FolderLocations";
import { SaveData, SerializedField, SerializedLogicNode, SerializedNode, SerializedSystem } from "./SaveData";
import { API_VERSION } from "API/ExportAPI";
import { GetNodeSystems } from "Services/NodeSystemService";
import { Node } from "API/Nodes/Node";
import { GetAllNodes } from "Services/NodesService";
import { NodeGroups } from "API/NodeGroup";
import { NodeFields } from "API/Fields/NodeFields";

const savesFolder = GetSavesFolder();

export function SaveToFile() {
	const container = new Instance("ModuleScript");
	container.Name = "VFXSaveData";

	const data: SaveData = {
		version: API_VERSION,
		logicNodes: [],
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

	const logicNodes = GetAllNodes();
	logicNodes.filter((collectionEnrty) => collectionEnrty.data.node.nodeGroup === NodeGroups.Logic);
	logicNodes.forEach((collectionEntry) => {
		const node = collectionEntry.data.node;
		const anchorPoint = collectionEntry.data.anchorPoint;

		const serializedNode: SerializedLogicNode = {
			nodeName: node.GetNodeName(),
			fields: SerializeFields(node.nodeFields),
			anchorPoint: { x: anchorPoint.X, y: anchorPoint.Y },
		};

		data.logicNodes.push(serializedNode);
	});

	container.Source = HttpService.JSONEncode(data);
	container.Parent = savesFolder;

	return container;
}

function SerializeNode(node: Node): SerializedNode {
	const serializedSpawnNode: SerializedNode = {
		nodeName: node.GetNodeName(),
		fields: SerializeFields(node.nodeFields),
	};

	return serializedSpawnNode;
}

function SerializeFields(fields: { [key: string]: NodeFields }): SerializedField[] {
	const serializedFields: SerializedField[] = [];

	for (const [key, value] of pairs(fields)) {
		const serializedField: SerializedField = {
			name: key as string,
			data: value.SerializeData(),
		};

		serializedFields.push(serializedField);
	}

	return serializedFields;
}
