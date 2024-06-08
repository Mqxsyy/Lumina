import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { Node } from "../Node";

export abstract class UpdateNode extends Node {
    static nodeGroups = [NodeGroups.Update];

    GetNodeGroups(): NodeGroups[] {
        return UpdateNode.nodeGroups;
    }

    abstract Run(data: ParticleData, dt: number): void;
}
