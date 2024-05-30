import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const AliveTimeName = "AliveTime";
export const AliveTimeFieldNames = {};

export class AliveTime extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {};

    Calculate = (data: ParticleData) => {
        return data.alivetime;
    };

    GetNodeName(): string {
        return AliveTimeName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper);
    }
}
