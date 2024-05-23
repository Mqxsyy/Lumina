import { NumberField } from "API/Fields/NumberField";
import { NodeGroups } from "API/NodeGroup";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenNumberOut } from "../AutoGeneration/LogicNodes/AutoGenNumberOut";
import { LogicNode } from "./LogicNode";

export const NumberOutName = "NumberOut";
export const NumberOutFieldNames = {
    input: "input",
};

export class NumberOut extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields: {
        input: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            input: new NumberField(0),
        };
    }

    Calculate = () => {
        return this.nodeFields.input.GetNumber();
    };

    GetNodeName(): string {
        return NumberOutName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenNumberOut(this, src, wrapper);
    }
}
