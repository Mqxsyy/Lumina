import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { Node } from "../Node";

export abstract class InitializeNode extends Node {
    static nodeGroups = [NodeGroups.Initialize];

    GetNodeGroups(): NodeGroups[] {
        return InitializeNode.nodeGroups;
    }

    GetNodeFolderName(): string {
        return "Initialize";
    }

    abstract Run(data: ParticleData): void;
}
