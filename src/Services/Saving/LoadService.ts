import { HttpService, RunService } from "@rbxts/services";
import { FastEvent } from "API/Bindables/FastEvent";
import { API_VERSION } from "API/ExportAPI";
import { NodeGroups } from "API/NodeGroup";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";
import { NodeList } from "Lists/NodeList";
import {
    type NodeCollectionEntry,
    type NodeConnectionIn,
    type NodeConnectionOut,
    type NodeData,
    UpdateNodeData,
} from "Services/NodesService";
import type { SaveData, SerializedField, SerializedNode, SerializedSystem } from "./SaveData";

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

    let data: SaveData;

    try {
        if (selectedInstance.IsA("ModuleScript")) {
            data = HttpService.JSONDecode((selectedInstance as ModuleScript).Source) as SaveData;
        } else {
            data = HttpService.JSONDecode((selectedInstance as StringValue).Value) as SaveData;
        }
    } catch {
        warn("The file you are trying to load is not in a valid JSON format.");
        return;
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
        const [_, systemCachedNodes] = CreateSystem(system);

        for (const cahcedNode of systemCachedNodes) {
            cachedNodes.push(cahcedNode);
        }
    }

    // floating nodes
    for (const node of data.floatingNodes) {
        const nodeCollectionEntry = CreateNode(node.className || (node.nodeName as string), node.fields, node.order);
        if (nodeCollectionEntry === undefined) {
            warn(`Node ${node.className || (node.nodeName as string)} does not exist. Save data may be outdated or corrupted.`);
            continue;
        }

        cachedNodes.push({ SerializedNode: node, NodeData: nodeCollectionEntry.data });

        UpdateNodeData(nodeCollectionEntry.data.node.id, (data) => {
            data.anchorPoint = new Vector2(node.anchorPoint.x, node.anchorPoint.y);
            return data;
        });
    }

    task.wait(0.1); // adding wait is bad, but without it connections load before nodes and there's some weirdness with nodes not detecting existing connections

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
                                valueName: serializedConnection1.valueName,
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
                                valueName: serializedConnection2.valueName,
                            };

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

        const sortedNodes = nodes.sort((a, b) => {
            if (a.order === undefined) return false; // backwards compatibility
            if (b.order === undefined) return false; // backwards compatibility
            return a.order >= b.order;
        });

        for (let i = 0; i < sortedNodes.size(); i++) {
            const node = sortedNodes[i];

            const nodeCollectionEntry = CreateNode(node.className || (node.nodeName as string), node.fields, node.order);
            if (nodeCollectionEntry === undefined) {
                warn(
                    `Node ${
                        node.className || (node.nodeName as string)
                    } does not exist in group ${nodeGroup}. Save data may be outdated or corrupted.`,
                );
                continue;
            }

            cachedNodes.push({ SerializedNode: node, NodeData: nodeCollectionEntry.data });

            // janky
            if (systemData.addToNodeGroup[nodeGroup] === undefined) {
                systemData.finishedBindingGroups.Connect(() => {
                    if (nodeCollectionEntry.element === undefined) {
                        nodeCollectionEntry.elementLoaded.Connect(() => {
                            (systemData.addToNodeGroup[nodeGroup] as (id: number) => void)(nodeCollectionEntry.data.node.id);
                        });
                    } else {
                        (systemData.addToNodeGroup[nodeGroup] as (id: number) => void)(nodeCollectionEntry.data.node.id);
                    }
                });
            } else {
                if (nodeCollectionEntry.element === undefined) {
                    nodeCollectionEntry.elementLoaded.Connect(() => {
                        (systemData.addToNodeGroup[nodeGroup] as (id: number) => void)(nodeCollectionEntry.data.node.id);
                    });
                } else {
                    (systemData.addToNodeGroup[nodeGroup] as (id: number) => void)(nodeCollectionEntry.data.node.id);
                }
            }
        }
    }

    return [system, cachedNodes];
}

export function CreateNode(nodeClassName: string, fields: SerializedField[], order: number): NodeCollectionEntry | undefined {
    const nodeEntry = NodeList.find((e) => e.className === nodeClassName);
    if (nodeEntry === undefined) return undefined;

    const node = nodeEntry.defaultEntry.create() as NodeCollectionEntry;

    for (const field of fields) {
        if (node.data.node.nodeFields[field.name] === undefined) continue;
        node.data.node.nodeFields[field.name].ReadSerializedData(field.data);
    }

    node.data.node.updateOrder = order;
    return node;
}
