import type { NodeField } from "API/Fields/NodeField";
import type { NodeGroups } from "../NodeGroup";
import { NodeIdPool } from "./NodeIdPool";

export abstract class Node {
    id: number;

    abstract nodeGroup: NodeGroups;
    abstract nodeFields: { [key: string]: NodeField };
    connectedSystemId?: number;

    constructor() {
        this.id = NodeIdPool.GetNextId();
    }

    ConnectToSystem(systemId: number) {
        this.connectedSystemId = systemId;
    }

    RemoveSystemConnection() {
        this.connectedSystemId = undefined;
    }

    abstract GetNodeName(): string;
    abstract GetAutoGenerationCode(wrapper?: string): string;
}
