import { HttpService } from "@rbxts/services";
import { API_VERSION } from "API/ExportAPI";
import type { NodeField } from "API/Fields/NodeField";
import { GetSavesFolder } from "API/FolderLocations";
import type { Node } from "API/Nodes/Node";
import { GetAllSystems, type NodeSystemData } from "Services/NodeSystemService";
import { GetAllNodes, GetNodeById, type NodeConnectionIn } from "Services/NodesService";
import type { SaveData, SerializedConnection, SerializedField, SerializedFloatingNode, SerializedNode, SerializedSystem } from "./SaveData";

const savesFolder = GetSavesFolder();

export function SaveToFile() {
    const data: SaveData = {
        version: API_VERSION,
        floatingNodes: [],
        systems: [],
    };

    const systems = GetAllSystems();

    for (const system of systems) {
        const serializedSystem = SerializeSystem(system.data);
        data.systems.push(serializedSystem);
    }

    const allNodes = GetAllNodes();
    const floatingNodes = allNodes.filter((collectionEnrty) => collectionEnrty.data.node.connectedSystemId === undefined);

    for (const collectionEntry of floatingNodes) {
        const node = collectionEntry.data.node;
        const anchorPoint = collectionEntry.data.anchorPoint;

        const serializedNode: SerializedFloatingNode = {
            ...SerializeNode(node),
            nodeGroup: node.nodeGroup,
            anchorPoint: { x: anchorPoint.X, y: anchorPoint.Y },
        };

        data.floatingNodes.push(serializedNode);
    }

    let container: ModuleScript | StringValue;
    const stringData = HttpService.JSONEncode(data);

    if (stringData.size() > 200000) {
        container = new Instance("ModuleScript");
        container.Source = stringData;
    } else {
        container = new Instance("StringValue");
        container.Value = stringData;
    }

    container.Name = "VFXSaveData";
    container.Parent = savesFolder;

    return container;
}

export function SerializeSystem(system: NodeSystemData, ignoreConnections = false) {
    const anchorPoint = system.anchorPoint;

    const serializedSystem: SerializedSystem = {
        systemName: system.systemName,
        anchorPoint: { x: anchorPoint.X, y: anchorPoint.Y },
        groups: {
            spawn: [],
            initialize: [],
            update: [],
            render: [],
        },
    };

    const spawnNode = system.system.spawnNode;
    if (spawnNode !== undefined) {
        serializedSystem.groups.spawn.push(SerializeNode(spawnNode, ignoreConnections));
    }

    const initializeNodes = system.system.initializeNodes;
    for (const node of initializeNodes) {
        serializedSystem.groups.initialize.push(SerializeNode(node, ignoreConnections));
    }

    const updateNodes = system.system.updateNodes;
    for (const node of updateNodes) {
        serializedSystem.groups.update.push(SerializeNode(node, ignoreConnections));
    }

    const renderNode = system.system.renderNode;
    if (renderNode !== undefined) {
        serializedSystem.groups.render.push(SerializeNode(renderNode, ignoreConnections));
    }

    return serializedSystem;
}

export function SerializeNode(node: Node, ignoreConnections = false): SerializedNode {
    const collectionEntry = GetNodeById(node.id);
    if (collectionEntry === undefined) return error("Node not found");

    const nodeData = collectionEntry.data;

    const serializedNode: SerializedNode = {
        nodeName: node.GetNodeName(),
        fields: SerializeFields(node.nodeFields, ignoreConnections ? undefined : nodeData.connectionsIn),
        order: nodeData.node.updateOrder,
    };

    if (nodeData.connectionsOut.size() !== 0 && !ignoreConnections) {
        serializedNode.connections = [];

        for (const connection of nodeData.connectionsOut) {
            serializedNode.connections.push({ id: connection.id });
        }
    }

    return serializedNode;
}

function SerializeFields(fields: { [key: string]: NodeField }, connectionsIn?: NodeConnectionIn[]): SerializedField[] {
    const serializedFields: SerializedField[] = [];

    for (const [key, value] of pairs(fields)) {
        const serializedField: SerializedField = {
            name: key as string,
            data: value.SerializeData(),
        };

        serializedFields.push(serializedField);
    }

    if (connectionsIn !== undefined) {
        for (const connection of connectionsIn) {
            for (const serializedField of serializedFields) {
                if (serializedField.name === connection.fieldName) {
                    const serializedConnection: SerializedConnection = {
                        id: connection.id,
                    };

                    if (connection.valueName !== undefined) {
                        serializedConnection.valueName = connection.valueName;
                    }

                    if (serializedField.connections === undefined) {
                        serializedField.connections = [];
                    }

                    serializedField.connections.push(serializedConnection);
                    break;
                }
            }
        }
    }

    return serializedFields;
}
