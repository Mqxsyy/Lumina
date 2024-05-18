import { NodeGroups } from "API/NodeGroup";
import { AutoGenAliveTime } from "../AutoGeneration/LogicNodes/AutoGenAliveTime";
import { LogicNode } from "./LogicNode";
import { ParticleData } from "API/ParticleService";

export const AliveTimeName = "AliveTime";
export const AliveTimeFieldNames = {};

export class AliveTime extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {};

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

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenAliveTime(this, wrapper);
    }
}
