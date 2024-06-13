import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { StateField } from "API/Fields/StateField";
import type { ParticleData } from "API/ParticleService";
import { MathOperationType } from "../FieldStates";
import { LogicNode } from "./LogicNode";

export class NumberMath extends LogicNode {
    static className = "NumberMath";

    nodeFields = {
        operationType: new StateField(MathOperationType, MathOperationType.Add),
        a: new ConnectableNumberField(1),
        b: new ConnectableNumberField(0),
    };

    constructor(operationType: string) {
        super();
        this.nodeFields.operationType.SetState(operationType);
    }

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

    GetClassName(): string {
        return NumberMath.className;
    }
}
