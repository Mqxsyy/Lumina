import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { StateField } from "API/Fields/StateField";
import type { ParticleData } from "API/ParticleService";
import { TrigonometryType } from "../FieldStates";
import { LogicNode } from "./LogicNode";

export class Trigonometry extends LogicNode {
    static className = "Trigonometry";

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

    GetClassName(): string {
        return Trigonometry.className;
    }
}
