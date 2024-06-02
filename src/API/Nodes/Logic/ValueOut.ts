import { NumberField } from "API/Fields/NumberField";
import { StateField } from "API/Fields/StateField";
import { Vector2Field } from "API/Fields/Vector2Field";
import { Vector3Field } from "API/Fields/Vector3Field";
import { NodeGroups } from "API/NodeGroup";
import type { Src } from "API/VFXScriptCreator";
import { ValueType } from "../FieldStates";
import { AutoGenLogicNode, LogicNode } from "./LogicNode";

export const ValueOutName = "ValueOut";
export const NumberOutFieldNames = {
    valueType: "valueType",
    numberIn: "numberIn",
    vector2In: "vector2In",
    vector3In: "vector3In",
};

export class ValueOut extends LogicNode {
    nodeGroup: NodeGroups = NodeGroups.Logic;
    nodeFields = {
        valueType: new StateField(ValueType, ValueType.Number),
        numberIn: new NumberField(0),
        vector2In: new Vector2Field(0, 0),
        vector3In: new Vector3Field(0, 0, 0),
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
        }

        return value;
    };

    GetNodeName(): string {
        return ValueOutName;
    }

    GetAutoGenerationCode(src: Src, wrapper: string) {
        AutoGenLogicNode(this, src, wrapper, (varName) => {
            this.nodeFields.valueType.AutoGenerateField(`${varName}.nodeFields.valueType`, src);
            this.nodeFields.numberIn.AutoGenerateField(`${varName}.nodeFields.numberIn`, src);
            this.nodeFields.vector2In.AutoGenerateField(`${varName}.nodeFields.vector2In`, src);
            this.nodeFields.vector3In.AutoGenerateField(`${varName}.nodeFields.vector3In`, src);
        });
    }
}
