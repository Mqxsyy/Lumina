import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { StateField } from "API/Fields/StateField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { MathOperationType, ValueType } from "../FieldStates";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const VectorMathName = "VectorMath";
export const VectorMathFieldNames = {
    vectorType: "vectorType",
    operationType: "operationType",
    vector2A: "vector2A",
    vector2B: "vector2B",
    vector3A: "vector3A",
    vector3B: "vector3B",
};

export class VectorMath extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {
        vectorType: new StateField(ValueType, ValueType.Vector3, [ValueType.Number]),
        operationType: new StateField(MathOperationType, MathOperationType.Add),
        vector2A: new ConnectableVector2Field(0, 0),
        vector2B: new ConnectableVector2Field(0, 0),
        vector3A: new ConnectableVector3Field(0, 0, 0),
        vector3B: new ConnectableVector3Field(0, 0, 0),
    };

    Calculate = (data: ParticleData) => {
        const vectorType = this.nodeFields.vectorType.GetState();
        const operationType = this.nodeFields.operationType.GetState();

        if (vectorType === ValueType.Vector2) {
            const a = this.nodeFields.vector2A.GetVector2(data);
            const b = this.nodeFields.vector2B.GetVector2(data);
            let result = Vector2.zero;

            switch (operationType) {
                case MathOperationType.Add: {
                    result = a.add(b);
                    break;
                }
                case MathOperationType.Subtract: {
                    result = a.sub(b);
                    break;
                }
                case MathOperationType.Multiply: {
                    result = a.mul(b);
                    break;
                }
                case MathOperationType.Divide: {
                    result = a.div(b);
                    break;
                }
            }

            return result;
        }

        if (vectorType === ValueType.Vector3) {
            const a = this.nodeFields.vector3A.GetVector3(data);
            const b = this.nodeFields.vector3B.GetVector3(data);
            let result = Vector3.zero;

            switch (operationType) {
                case MathOperationType.Add: {
                    result = a.add(b);
                    break;
                }
                case MathOperationType.Subtract: {
                    result = a.sub(b);
                    break;
                }
                case MathOperationType.Multiply: {
                    result = a.mul(b);
                    break;
                }
                case MathOperationType.Divide: {
                    result = a.div(b);
                    break;
                }
            }

            return result;
        }

        warn("VectorMath invalid return");
        return Vector3.zero as never;
    };

    GetNodeName(): string {
        return VectorMathName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.vectorType.AutoGenerateField(`${varName}.nodeFields.vectorType`, src);
            this.nodeFields.operationType.AutoGenerateField(`${varName}.nodeFields.operationType`, src);
            this.nodeFields.vector2A.AutoGenerateField(`${varName}.nodeFields.vector2A`, src);
            this.nodeFields.vector2B.AutoGenerateField(`${varName}.nodeFields.vector2B`, src);
            this.nodeFields.vector3A.AutoGenerateField(`${varName}.nodeFields.vector3A`, src);
            this.nodeFields.vector3B.AutoGenerateField(`${varName}.nodeFields.vector3B`, src);
        });
    }
}
