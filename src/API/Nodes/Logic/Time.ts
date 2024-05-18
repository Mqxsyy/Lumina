import { NodeGroups } from "API/NodeGroup";
import { AutoGenTime } from "../AutoGeneration/LogicNodes/AutoGenTime";
import { LogicNode } from "./LogicNode";

export const TimeName = "Time";
export const TimeFieldNames = {};

export class Time extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {};

    constructor() {
        super();
        this.nodeFields = {};
    }

    Calculate = () => {
        return os.clock();
    };

    GetNodeName(): string {
        return TimeName;
    }

    GetAutoGenerationCode(wrapper: string) {
        return AutoGenTime(this, wrapper);
    }
}
