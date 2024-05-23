import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

interface SerializedData {
    number: number;
}

export class NumberField extends NodeField {
    number: number;

    constructor(number: number) {
        super();
        this.number = number;
    }

    GetNumber = () => {
        return this.number;
    };

    SetNumber = (number: number) => {
        this.number = number;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        src.value += `${fieldPath}.SetNumber(${this.number}) \n`;
    }

    SerializeData() {
        return {
            number: this.number,
        };
    }

    ReadSerializedData(data: SerializedData) {
        this.SetNumber(data.number);
    }
}
