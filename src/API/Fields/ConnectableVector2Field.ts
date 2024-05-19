import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import { NodeField } from "./NodeField";
import { type SimpleVector2, Vector2Field } from "./Vector2Field";

interface SerializedData {
    x: number;
    y: number;
}

export class ConnectableVector2Field extends NodeField {
    vector2Field: Vector2Field;
    connectedNodeX: undefined | LogicNode;
    connectedNodeY: undefined | LogicNode;

    constructor(x: number, y: number) {
        super();

        this.vector2Field = new Vector2Field(x, y);
    }

    GetVector2(data: ParticleData): SimpleVector2 {
        const x = this.GetX(data);
        const y = this.GetY(data);

        return { x, y };
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

    AutoGenerateField(fieldPath: string) {
        let src = "";

        if (this.connectedNodeX !== undefined) {
            src += "\n";
            src += this.connectedNodeX.GetAutoGenerationCode(`${fieldPath}.ConnectX(..)`);
            src += "\n";
        } else {
            src += `${fieldPath}.SetX(${this.vector2Field.GetX()}) \n`;
        }

        if (this.connectedNodeY !== undefined) {
            src += "\n";
            src += this.connectedNodeY.GetAutoGenerationCode(`${fieldPath}.ConnectY(..)`);
            src += "\n";
        } else {
            src += `${fieldPath}.SetY(${this.vector2Field.GetY()}) \n`;
        }

        return src;
    }

    SerializeData() {
        return this.vector2Field.SerializeData();
    }

    ReadSerializedData(data: SerializedData) {
        this.SetVector2(data.x, data.y);
    }
}
