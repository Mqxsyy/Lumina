import { NodeField } from "./NodeField";

export interface SerializedColorField {
    hue: number;
    saturation: number;
    value: number;
}

export class ColorField extends NodeField {
    hue: number;
    saturation: number;
    value: number;

    constructor(hue: number, saturation: number, value: number) {
        super();

        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
    }

    GetColor() {
        return Color3.fromHSV(this.hue, this.saturation, this.value);
    }

    SetHue = (hue: number) => {
        this.hue = hue;
        this.FieldChanged.Fire();
    };

    SetSaturation = (saturation: number) => {
        this.saturation = saturation;
        this.FieldChanged.Fire();
    };

    SetValue = (value: number) => {
        this.value = value;
        this.FieldChanged.Fire();
    };

    SetHSV = (hue: number, saturation: number, value: number) => {
        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string) {
        return `${fieldPath}.SetHSV(${this.hue}, ${this.saturation}, ${this.value}) \n`;
    }

    SerializeData() {
        return {
            hue: this.hue,
            saturation: this.saturation,
            value: this.value,
        };
    }

    ReadSerializedData(data: SerializedColorField) {
        this.SetHSV(data.hue, data.saturation, data.value);
    }
}
