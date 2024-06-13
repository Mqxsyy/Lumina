import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";
import { type SimpleVector2, Vector2Field } from "./Vector2Field";

interface SerializedData {
    x: number;
    y: number;
}

export class ConnectableVector2Field extends NodeField {
    vector2Field: Vector2Field;
    connectedNodeVector2: undefined | LogicNode;
    connectedNodeX: undefined | LogicNode;
    connectedNodeY: undefined | LogicNode;

    constructor(x: number, y: number) {
        super();
        this.vector2Field = new Vector2Field(x, y);
    }

    GetSimpleVector2(data: ParticleData): SimpleVector2 {
        if (this.connectedNodeVector2 !== undefined) {
            const vec2 = this.connectedNodeVector2.Calculate(data) as Vector2;
            return { x: vec2.X, y: vec2.Y };
        }

        const x = this.GetX(data);
        const y = this.GetY(data);

        return { x, y };
    }

    GetVector2(data: ParticleData) {
        if (this.connectedNodeVector2 !== undefined) return this.connectedNodeVector2.Calculate(data) as Vector2;

        const x = this.GetX(data);
        const y = this.GetY(data);

        return new Vector2(x, y);
    }

    GetXAsText = () => {
        return tostring(this.vector2Field.GetX());
    };

    GetX = (data: ParticleData) => {
        if (this.connectedNodeX !== undefined) {
            return this.connectedNodeX.Calculate(data) as number;
        }

        return this.vector2Field.GetX();
    };

    GetYAsText = () => {
        return tostring(this.vector2Field.GetY());
    };

    GetY = (data: ParticleData) => {
        if (this.connectedNodeY !== undefined) {
            return this.connectedNodeY.Calculate(data) as number;
        }

        return this.vector2Field.GetY();
    };

    SetVector2 = (x: number, y: number) => {
        this.connectedNodeVector2 = undefined;

        this.SetX(x, true);
        this.SetY(y, true);

        this.FieldChanged.Fire();
    };

    SetX = (x: number, ignoreFieldChange = false) => {
        this.vector2Field.SetX(x);
        this.connectedNodeX = undefined;

        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetY = (y: number, ignoreFieldChange = false) => {
        this.vector2Field.SetY(y);
        this.connectedNodeY = undefined;

        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    ConnectVector2 = (node: LogicNode) => {
        this.connectedNodeVector2 = node;
        this.FieldChanged.Fire();
    };

    DisconnectVector2 = () => {
        this.connectedNodeVector2 = undefined;
        this.FieldChanged.Fire();
    };

    ConnectX = (node: LogicNode) => {
        this.connectedNodeX = node;
        this.FieldChanged.Fire();
    };

    DisconnectX = () => {
        this.connectedNodeX = undefined;
        this.FieldChanged.Fire();
    };

    ConnectY = (node: LogicNode) => {
        this.connectedNodeY = node;
        this.FieldChanged.Fire();
    };

    DisconnectY = () => {
        this.connectedNodeY = undefined;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        if (this.connectedNodeX !== undefined) {
            this.connectedNodeX.GetAutoGenerationCode(src, `${fieldPath}.ConnectX(..)`);
        } else {
            src.value += `${fieldPath}.SetX(${this.vector2Field.GetX()}) \n`;
        }

        if (this.connectedNodeY !== undefined) {
            this.connectedNodeY.GetAutoGenerationCode(src, `${fieldPath}.ConnectY(..)`);
        } else {
            src.value += `${fieldPath}.SetY(${this.vector2Field.GetY()}) \n`;
        }
    }

    SerializeData() {
        return this.vector2Field.SerializeData();
    }

    ReadSerializedData(data: SerializedData) {
        this.SetVector2(data.x, data.y);
    }
}
