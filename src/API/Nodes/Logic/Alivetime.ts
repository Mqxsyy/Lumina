import type { NodeField } from "API/Fields/NodeField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenAliveTime } from "../AutoGeneration/LogicNodes/AutoGenAliveTime";
import { LogicNode } from "./LogicNode";

export const AliveTimeName = "AliveTime";
export const AliveTimeFieldNames = {};

export class AliveTime extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: { [key: string]: NodeField };

    constructor() {
        super();
        this.nodeFields = {};
    }

    Calculate = (data: ParticleData) => {
        return data.alivetime;
    };

    GetNodeName(): string {
        return AliveTimeName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenAliveTime(this, src, wrapper);
    }
}
