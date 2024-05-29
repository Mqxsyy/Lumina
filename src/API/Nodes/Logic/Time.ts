import type { NodeField } from "API/Fields/NodeField";
import { NodeGroups } from "API/NodeGroup";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const TimeName = "Time";
export const TimeFieldNames = {};

export class Time extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: { [key: string]: NodeField };

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

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper);
    }
}
