import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { StateField } from "API/Fields/StateField";
import type { ParticleData } from "API/ParticleService";
import { MathOperationType, ValueType } from "../FieldStates";
import { LogicNode } from "./LogicNode";

export class VectorMath extends LogicNode {
    static className = "VectorMath";

    nodeFields = {
        valueTypeA: new StateField(ValueType, ValueType.Vector3, [ValueType.Number]),
        valueTypeB1: new StateField(ValueType, ValueType.Vector2, [ValueType.Vector3]),
        valueTypeB2: new StateField(ValueType, ValueType.Vector3, [ValueType.Vector2]),
        operationType: new StateField(MathOperationType, MathOperationType.Add),
        vector2A: new ConnectableVector2Field(0, 0),
        vector3A: new ConnectableVector3Field(0, 0, 0),
        numberB: new ConnectableNumberField(0),
        vector2B: new ConnectableVector2Field(0, 0),
        vector3B: new ConnectableVector3Field(0, 0, 0),
    };

    constructor(operationType: string) {
        super();
        this.nodeFields.operationType.SetState(operationType);
    }

    Calculate = (data: ParticleData) => {
        const valueTypeA = this.nodeFields.valueTypeA.GetState();
        const operationType = this.nodeFields.operationType.GetState();

        if (operationType === MathOperationType.Add) {
            if (valueTypeA === ValueType.Vector2) {
                return this.nodeFields.vector2A.GetVector2(data).add(this.nodeFields.vector2B.GetVector2(data));
            }

            if (valueTypeA === ValueType.Vector3) {
                return this.nodeFields.vector3A.GetVector3(data).add(this.nodeFields.vector3B.GetVector3(data));
            }
        }

        if (operationType === MathOperationType.Subtract) {
            if (valueTypeA === ValueType.Vector2) {
                return this.nodeFields.vector2A.GetVector2(data).sub(this.nodeFields.vector2B.GetVector2(data));
            }

            if (valueTypeA === ValueType.Vector3) {
                return this.nodeFields.vector3A.GetVector3(data).sub(this.nodeFields.vector3B.GetVector3(data));
            }
        }

        if (operationType === MathOperationType.Multiply) {
            if (valueTypeA === ValueType.Vector2) {
                const valueTypeB = this.nodeFields.valueTypeB1.GetState();

                if (valueTypeB === ValueType.Number) {
                    return this.nodeFields.vector2A.GetVector2(data).mul(this.nodeFields.numberB.GetNumber(data));
                }

                if (valueTypeB === ValueType.Vector2) {
                    return this.nodeFields.vector2A.GetVector2(data).mul(this.nodeFields.vector2B.GetVector2(data));
                }
            }

            if (valueTypeA === ValueType.Vector3) {
                const valueTypeB = this.nodeFields.valueTypeB2.GetState();

                if (valueTypeB === ValueType.Number) {
                    return this.nodeFields.vector3A.GetVector3(data).mul(this.nodeFields.numberB.GetNumber(data));
                }

                if (valueTypeB === ValueType.Vector3) {
                    return this.nodeFields.vector3A.GetVector3(data).mul(this.nodeFields.vector3B.GetVector3(data));
                }
            }
        }

        if (operationType === MathOperationType.Divide) {
            if (valueTypeA === ValueType.Vector2) {
                const valueTypeB = this.nodeFields.valueTypeB1.GetState();

                if (valueTypeB === ValueType.Number) {
                    return this.nodeFields.vector2A.GetVector2(data).div(this.nodeFields.numberB.GetNumber(data));
                }

                if (valueTypeB === ValueType.Vector2) {
                    return this.nodeFields.vector2A.GetVector2(data).div(this.nodeFields.vector2B.GetVector2(data));
                }
            }

            if (valueTypeA === ValueType.Vector3) {
                const valueTypeB = this.nodeFields.valueTypeB2.GetState();

                if (valueTypeB === ValueType.Number) {
                    return this.nodeFields.vector3A.GetVector3(data).div(this.nodeFields.numberB.GetNumber(data));
                }

                if (valueTypeB === ValueType.Vector3) {
                    return this.nodeFields.vector3A.GetVector3(data).div(this.nodeFields.vector3B.GetVector3(data));
                }
            }
        }

        warn("VectorMath invalid return");
        return Vector3.zero as never;
    };

    GetClassName(): string {
        return VectorMath.className;
    }
}
