import { ValueType } from "API/Nodes/FieldStates";
import { StyleColors } from "API/Style";
import StyleConfig from "./StyleConfig";

export function GetConnectionColor(valueType: string) {
    switch (valueType) {
        case ValueType.Number:
            return StyleConfig.Connection.TypeColors.Number;
        case ValueType.Vector2:
            return StyleConfig.Connection.TypeColors.Vector2;
        case ValueType.Vector3:
            return StyleConfig.Connection.TypeColors.Vector3;
    }

    return StyleColors.Highlight;
}
