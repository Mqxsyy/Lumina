import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { StateField } from "API/Fields/StateField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { TrigonometryType } from "../FieldStates";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const TrigonometryName = "Trigonometry";
export const TrigonometryFieldNames = {
    input: "input",
};

export class Trigonometry extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {
        trigonometryType: new StateField(TrigonometryType, TrigonometryType.Sin),
        input: new ConnectableNumberField(0),
    };

    Calculate = (data: ParticleData) => {
        const number = this.nodeFields.input.GetNumber(data);
        let result = 0;

        switch (this.nodeFields.trigonometryType.GetState()) {
            case TrigonometryType.Sin:
                result = math.sin(number);
                break;
            case TrigonometryType.Cos:
                result = math.cos(number);
                break;
            case TrigonometryType.Tan:
                result = math.tan(number);
                break;
        }

        return result;
    };

    GetNodeName(): string {
        return TrigonometryName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.trigonometryType.AutoGenerateField(`${varName}.nodeFields.trigonometryType`, src);
            this.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`, src);
        });
    }
}
