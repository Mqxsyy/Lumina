import { HttpService } from "@rbxts/services";
import { API_VERSION } from "API/ExportAPI";
import { NodeFields } from "API/Fields/NodeFields";
import { GetSavesFolder } from "API/FolderLocations";
import { Node } from "API/Nodes/Node";
import { GetNodeSystems } from "Services/NodeSystemService";
import { GetAllNodes, GetNodeById, NodeConnectionIn } from "Services/NodesService";
import { SaveData, SerializedField, SerializedFloatingNode, SerializedNode, SerializedSystem } from "./SaveData";

const savesFolder = GetSavesFolder();

export function SaveToFile() {
	const container = new Instance("ModuleScript");
	container.Name = "VFXSaveData";

	const data: SaveData = {
		version: API_VERSION,
		floatingNodes: [],
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

	const allNodes = GetAllNodes();
	const floatingNodes = allNodes.filter(
		(collectionEnrty) => collectionEnrty.data.node.connectedSystemId === undefined,
	);

	floatingNodes.forEach((collectionEntry) => {
		const node = collectionEntry.data.node;
		const anchorPoint = collectionEntry.data.anchorPoint;

		const serializedNode: SerializedFloatingNode = {
			...SerializeNode(node),
			nodeGroup: node.nodeGroup,
			anchorPoint: { x: anchorPoint.X, y: anchorPoint.Y },
		};

		data.floatingNodes.push(serializedNode);
	});

	container.Source = HttpService.JSONEncode(data);
	container.Parent = savesFolder;

	return container;
}

function SerializeNode(node: Node): SerializedNode {
	const nodeData = GetNodeById(node.id)!.data;

	const serializedNode: SerializedNode = {
		nodeName: node.GetNodeName(),
		fields: SerializeFields(node.nodeFields, nodeData.connectionsIn),
	};

	if (nodeData.connectionsOut.size() !== 0) {
		serializedNode.connectionIds = [];
		nodeData.connectionsOut.forEach((connection) => {
			serializedNode.connectionIds!.push(connection.id);
		});
	}

	return serializedNode;
}

function SerializeFields(fields: { [key: string]: NodeFields }, connectionsIn: NodeConnectionIn[]): SerializedField[] {
	const serializedFields: SerializedField[] = [];

	for (const [key, value] of pairs(fields)) {
		const serializedField: SerializedField = {
			name: key as string,
			data: value.SerializeData(),
		};

		serializedFields.push(serializedField);
	}

	connectionsIn.forEach((connection) => {
		for (const serializedField of serializedFields) {
			if (serializedField.name === connection.fieldName) {
				serializedField.connectionId = connection.id;
				break;
			}
		}
	});

	return serializedFields;
}
