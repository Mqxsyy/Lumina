import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

interface SerializedData {
    [key: number]: number;
}

export class NumberArrayField extends NodeField {
    numbers: number[];

    constructor(numbers: number[]) {
        super();
        this.numbers = numbers;
    }

    GetNumbers = () => {
        return this.numbers;
    };

    AddNumber = (number: number) => {
        this.numbers.push(number);
        this.FieldChanged.Fire();
    };

    AddNumberAtIndex = (index: number, number: number) => {
        this.numbers[index] = number;
        this.FieldChanged.Fire();
    };

    RemoveNumber = (index: number) => {
        this.numbers.remove(index);
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        for (let i = 0; i < this.numbers.size(); i++) {
            src.value += `${fieldPath}.AddNumberAtIndex(${i}, ${this.numbers[i]}) \n`;
        }
    }

    SerializeData(): SerializedData {
        const serializedData: { [key: number]: number } = {};

        for (let i = 0; i < this.numbers.size(); i++) {
            serializedData[i + 1] = this.numbers[i];
        }

        return serializedData;
    }

    ReadSerializedData(data: SerializedData) {
        this.numbers.clear();

        for (const [i, v] of pairs(data)) {
            this.AddNumberAtIndex(i - 1, v);
        }
    }
}
