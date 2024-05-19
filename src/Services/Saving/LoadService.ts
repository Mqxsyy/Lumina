import { HttpService } from "@rbxts/services";
import { API_VERSION } from "API/ExportAPI";
import { NodeGroups } from "API/NodeGroup";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";
import { NodeList } from "Lists/NodeList";
import { NodeCollectionEntry, NodeConnectionIn, NodeConnectionOut, NodeData, UpdateNodeData } from "Services/NodesService";
import { SaveData, SerializedField, SerializedNode, SerializedSystem } from "./SaveData";
import { FastEvent } from "API/Bindables/FastEvent";

const Selection = game.GetService("Selection");
let mismatchLoadTime = 0;
const MISMATCH_LOAD_TIMEFRAME = 10;

export const LoadingFinished = new FastEvent();

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
    if (selectedInstance.IsA("ModuleScript") === false && selectedInstance.IsA("StringValue") === false) {
        warn("Please select a valid file to load from.");
        return;
    }

    let data;
    if (selectedInstance.IsA("ModuleScript")) {
        data = HttpService.JSONDecode((selectedInstance as ModuleScript).Source) as SaveData;
    } else {
        data = HttpService.JSONDecode((selectedInstance as StringValue).Value) as SaveData;
    }

    if (data.version !== API_VERSION && os.clock() - mismatchLoadTime > MISMATCH_LOAD_TIMEFRAME) {
        warn(
            "The file you are trying to load was created with an older version of the plugin. The vfx may not load correctly. Press the load button again to attempt to load the vfx.",
        );

        mismatchLoadTime = os.clock();
        return;
    }

    mismatchLoadTime = 0;
    const cachedNodes: { SerializedNode: SerializedNode; NodeData: NodeData }[] = [];

    // systems
    for (const system of data.systems) {
        const [newSystem, systemCachedNodes] = CreateSystem(system);
        systemCachedNodes.forEach((cachedNode) => cachedNodes.push(cachedNode));
    }

    // floating nodes
    for (const node of data.floatingNodes) {
        const nodeCollectionEntry = CreateNode(node.nodeGroup, node.nodeName, node.fields, node.order);
        if (nodeCollectionEntry === undefined) {
            warn(`Node ${node.nodeName} does not exist in group ${node.nodeGroup}. Save data may be outdated or corrupted.`);
            continue;
        }

        cachedNodes.push({ SerializedNode: node, NodeData: nodeCollectionEntry.data });

        UpdateNodeData(nodeCollectionEntry.data.node.id, (data) => {
            data.anchorPoint = new Vector2(node.anchorPoint.x, node.anchorPoint.y);
            return data;
        });
    }

    task.wait(0.1); // OPTIMIZE: adding wait is bad, but without it connections load before nodes and there's some weirdness with nodes not detecting existing connections

    // connections
    for (const cachedNode1 of cachedNodes) {
        if (cachedNode1.SerializedNode.connections === undefined) continue;
        if (cachedNode1.SerializedNode.connections.size() === 0) continue;

        for (const serializedConnection1 of cachedNode1.SerializedNode.connections) {
            for (const cachedNode2 of cachedNodes) {
                for (const serializedField of cachedNode2.SerializedNode.fields) {
                    if (serializedField.connections === undefined) continue;

                    for (const serializedConnection2 of serializedField.connections) {
                        if (serializedConnection1.id !== serializedConnection2.id) continue;

                        UpdateNodeData(cachedNode1.NodeData.node.id, (data) => {
                            const connection: NodeConnectionOut = {
                                id: serializedConnection1.id,
                            };

                            if (data.loadedConnectionsOut === undefined) {
                                data.loadedConnectionsOut = [];
                            }

                            data.loadedConnectionsOut.push(connection);
                            return data;
                        });

                        UpdateNodeData(cachedNode2.NodeData.node.id, (data) => {
                            const connection: NodeConnectionIn = {
                                id: serializedConnection2.id,
                                fieldName: serializedField.name,
                            };

                            if (serializedConnection2.valueName !== undefined) {
                                connection.valueName = serializedConnection2.valueName;
                            }

                            if (data.loadedConnectionsIn === undefined) {
                                data.loadedConnectionsIn = [];
                            }

                            data.loadedConnectionsIn.push(connection);
                            return data;
                        });
                    }
                }
            }
        }
    }

    task.wait();
    LoadingFinished.Fire();
}

export function CreateSystem(system: SerializedSystem): [SerializedSystem, { SerializedNode: SerializedNode; NodeData: NodeData }[]] {
    const cachedNodes = [];

    const anchorPoint = new Vector2(system.anchorPoint.x, system.anchorPoint.y);
    const systemCollectionEntry = CreateEmptySystem(anchorPoint);
    const systemData = systemCollectionEntry.data;
    systemData.systemName = system.systemName;

    for (const [group, nodes] of pairs(system.groups)) {
        let nodeGroup = NodeGroups.Spawn;

        if (group === "initialize") {
            nodeGroup = NodeGroups.Initialize;
        } else if (group === "update") {
            nodeGroup = NodeGroups.Update;
        } else if (group === "render") {
            nodeGroup = NodeGroups.Render;
        }

        for (const node of nodes) {
            const nodeCollectionEntry = CreateNode(nodeGroup, node.nodeName, node.fields, node.order);
            if (nodeCollectionEntry === undefined) {
                warn(`Node ${node.nodeName} does not exist in group ${nodeGroup}. Save data may be outdated or corrupted.`);
                continue;
            }

            cachedNodes.push({ SerializedNode: node, NodeData: nodeCollectionEntry.data });

            // OPTIMIZE: janky
            if (systemData.addToNodeGroup[nodeGroup] === undefined) {
                systemData.finishedBindingGroups.Connect(() => {
                    if (nodeCollectionEntry.element === undefined) {
                        nodeCollectionEntry.elementLoaded.Connect(() => {
                            systemData.addToNodeGroup[nodeGroup]!(nodeCollectionEntry.data.node.id);
                        });
                    } else {
                        systemData.addToNodeGroup[nodeGroup]!(nodeCollectionEntry.data.node.id);
                    }
                });
            } else {
                if (nodeCollectionEntry.element === undefined) {
                    nodeCollectionEntry.elementLoaded.Connect(() => {
                        systemData.addToNodeGroup[nodeGroup]!(nodeCollectionEntry.data.node.id);
                    });
                } else {
                    systemData.addToNodeGroup[nodeGroup]!(nodeCollectionEntry.data.node.id);
                }
            }
        }
    }

    return [system, cachedNodes];
}

export function CreateNode(group: NodeGroups, nodeName: string, fields: SerializedField[], order: number): NodeCollectionEntry | undefined {
    if (NodeList[group][nodeName] === undefined) return undefined;

    const node = NodeList[group][nodeName].create!() as NodeCollectionEntry;

    for (const field of fields) {
        node.data.node.nodeFields[field.name].ReadSerializedData(field.data);
    }

    node.data.order = order;

    return node;
}
