import { NodeField } from "./NodeField";

interface SerializedData {
    x: number;
    y: number;
}

export interface SimpleVector2 {
    x: number;
    y: number;
}

export class Vector2Field extends NodeField {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;
    }

    GetVector2(): SimpleVector2 {
        const x = this.GetX();
        const y = this.GetY();

        return { x, y };
    }

    GetX = () => {
        return this.x;
    };

    GetY = () => {
        return this.y;
    };

    SetVector2 = (x: number, y: number) => {
        this.SetX(x, true);
        this.SetY(y, true);

        this.FieldChanged.Fire();
    };

    SetX = (x: number, ignoreFieldChange = false) => {
        this.x = x;

        if (ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetY = (y: number, ignoreFieldChange = false) => {
        this.y = y;

        if (ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string) {
        let src = `${fieldPath}.SetX(${this.x}) \n`;
        src += `${fieldPath}.SetY(${this.y}) \n`;

        return src;
    }

    SerializeData() {
        return {
            x: this.x,
            y: this.y,
        };
    }

    ReadSerializedData(data: SerializedData) {
        const serializedData = data as SerializedData;
        this.SetVector2(serializedData.x, serializedData.y);
    }
}
