import { NumberField } from "API/Fields/NumberField";
import { StateField } from "API/Fields/StateField";
import { Vector2Field } from "API/Fields/Vector2Field";
import { Vector3Field } from "API/Fields/Vector3Field";
import { ValueType } from "../FieldStates";
import { LogicNode } from "./LogicNode";
import { ColorField } from "API/Fields/ColorField";

export class ValueOut extends LogicNode {
    static className = "ValueOut";

    nodeFields = {
        valueType: new StateField(ValueType, ValueType.Number),
        numberIn: new NumberField(0),
        vector2In: new Vector2Field(0, 0),
        vector3In: new Vector3Field(0, 0, 0),
        colorIn: new ColorField(0, 0, 0),
    };

    Calculate = () => {
        let value: unknown;

        switch (this.nodeFields.valueType.GetState()) {
            case ValueType.Number:
                value = this.nodeFields.numberIn.GetNumber();
                break;
            case ValueType.Vector2:
                value = this.nodeFields.vector2In.GetVector2();
                break;
            case ValueType.Vector3:
                value = this.nodeFields.vector3In.GetVector3();
                break;
            case ValueType.Color:
                value = this.nodeFields.colorIn.GetColor();
                break;
        }

        return value;
    };

    GetClassName(): string {
        return ValueOut.className;
    }
}
