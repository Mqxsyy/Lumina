import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { Node } from "../Node";

export abstract class LogicNode extends Node {
    static nodeGroups = [NodeGroups.Logic];

    GetNodeGroups(): NodeGroups[] {
        return LogicNode.nodeGroups;
    }

    abstract Calculate: (data: ParticleData) => unknown;
}
