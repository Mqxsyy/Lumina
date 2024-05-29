import type { NodeField } from "API/Fields/NodeField";
import type { Src } from "API/VFXScriptCreator";
import type { NodeGroups } from "../NodeGroup";
import { NodeIdPool } from "./NodeIdPool";

export enum UpdatePrioriy {
    First = 1,
    Default = 2,
    Last = 3,
}

export abstract class Node {
    id: number;

    updatePriority = UpdatePrioriy.Default;
    updateOrder = -1;

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
    abstract GetAutoGenerationCode(src: Src, wrapper?: string): void;
}
