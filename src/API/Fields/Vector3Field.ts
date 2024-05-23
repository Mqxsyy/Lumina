import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

interface SerializedData {
    x: number;
    y: number;
    z: number;
}

export interface SimpleVector3 {
    x: number;
    y: number;
    z: number;
}

export class Vector3Field extends NodeField {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
    }

    GetVector3(): SimpleVector3 {
        const x = this.GetX();
        const y = this.GetY();
        const z = this.GetZ();

        return { x, y, z };
    }

    GetX = () => {
        return this.x;
    };

    GetY = () => {
        return this.y;
    };

    GetZ = () => {
        return this.z;
    };

    SetVector3 = (x: number, y: number, z: number) => {
        this.SetX(x, true);
        this.SetY(y, true);
        this.SetZ(z, true);

        this.FieldChanged.Fire();
    };

    SetX = (x: number, ignoreFieldChange = false) => {
        this.x = x;

        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetY = (y: number, ignoreFieldChange = false) => {
        this.y = y;

        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetZ = (z: number, ignoreFieldChange = false) => {
        this.z = z;

        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        src.value += `${fieldPath}.SetX(${this.x}) \n`;
        src.value += `${fieldPath}.SetY(${this.y}) \n`;
        src.value += `${fieldPath}.SetZ(${this.z}) \n`;
    }

    SerializeData() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        };
    }

    ReadSerializedData(data: SerializedData) {
        this.SetVector3(data.x, data.y, data.z);
    }
}
