import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { StateField } from "API/Fields/StateField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { MathOperationType } from "../FieldStates";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const BasicMathOperationName = "BasicMathOperation";
export const BasicMathOperationFieldNames = {
    a: "a",
    b: "b",
};

export class BasicMathOperation extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {
        operationType: new StateField(MathOperationType, MathOperationType.Add),
        a: new ConnectableNumberField(1),
        b: new ConnectableNumberField(0),
    };

    Calculate = (data: ParticleData) => {
        const a = this.nodeFields.a.GetNumber(data);
        const b = this.nodeFields.b.GetNumber(data);
        let result = 0;

        switch (this.nodeFields.operationType.GetState()) {
            case MathOperationType.Add:
                result = a + b;
                break;
            case MathOperationType.Subtract:
                result = a - b;
                break;
            case MathOperationType.Multiply:
                result = a * b;
                break;
            case MathOperationType.Divide:
                result = a / b;
                break;
        }

        return result;
    };

    GetNodeName(): string {
        return BasicMathOperationName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.operationType.AutoGenerateField(`${varName}.nodeFields.operationType`, src);
            this.nodeFields.a.AutoGenerateField(`${varName}.nodeFields.a`, src);
            this.nodeFields.b.AutoGenerateField(`${varName}.nodeFields.b`, src);
        });
    }
}
