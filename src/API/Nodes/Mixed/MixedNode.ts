import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { Node } from "../Node";

export abstract class MixedNode extends Node {
    static nodeGroups = [NodeGroups.Initialize, NodeGroups.Update];

    GetNodeGroups(): NodeGroups[] {
        return MixedNode.nodeGroups;
    }

    abstract Run(data: ParticleData, dt: number): void;
    ClearCache(id: number) {}
}
