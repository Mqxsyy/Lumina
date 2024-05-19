import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import { NodeField } from "./NodeField";
import { type SimpleVector3, Vector3Field } from "./Vector3Field";

interface SerializedData {
    x: number;
    y: number;
    z: number;
}

export class ConnectableVector3Field extends NodeField {
    vector3Field: Vector3Field;
    connectedNodeX: undefined | LogicNode;
    connectedNodeY: undefined | LogicNode;
    connectedNodeZ: undefined | LogicNode;

    constructor(x: number, y: number, z: number) {
        super();
        this.vector3Field = new Vector3Field(x, y, z);
    }

    GetVector3(data: ParticleData): SimpleVector3 {
        const x = this.GetX(data);
        const y = this.GetY(data);
        const z = this.GetZ(data);

        return { x, y, z };
    }

    GetXAsText = () => {
        return tostring(this.vector3Field.GetX());
    };

    GetX = (data: ParticleData) => {
        if (this.connectedNodeX !== undefined) {
            return this.connectedNodeX.Calculate(data) as number;
        }

        return this.vector3Field.GetX();
    };

    GetYAsText = () => {
        return tostring(this.vector3Field.GetY());
    };

    GetY = (data: ParticleData) => {
        if (this.connectedNodeY !== undefined) {
            return this.connectedNodeY.Calculate(data) as number;
        }

        return this.vector3Field.GetY();
    };

    GetZAsText = () => {
        return tostring(this.vector3Field.GetZ());
    };

    GetZ = (data: ParticleData) => {
        if (this.connectedNodeZ !== undefined) {
            return this.connectedNodeZ.Calculate(data) as number;
        }

        return this.vector3Field.GetZ();
    };

    SetVector3 = (x: number, y: number, z: number) => {
        this.SetX(x, true);
        this.SetY(y, true);
        this.SetZ(z, true);

        this.FieldChanged.Fire();
    };

    SetX = (x: number, ignoreFieldChange = false) => {
        this.vector3Field.SetX(x);
        this.connectedNodeX = undefined;

        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetY = (y: number, ignoreFieldChange = false) => {
        this.vector3Field.SetY(y);
        this.connectedNodeY = undefined;

        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetZ = (z: number, ignoreFieldChange = false) => {
        this.vector3Field.SetZ(z);
        this.connectedNodeZ = undefined;

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

    ConnectZ = (boundNode: LogicNode) => {
        this.connectedNodeZ = boundNode;
        this.FieldChanged.Fire();
    };

    DisconnectZ = () => {
        this.connectedNodeZ = undefined;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string) {
        let src = "";

        if (this.connectedNodeX !== undefined) {
            src += "\n";
            src += this.connectedNodeX.GetAutoGenerationCode(`${fieldPath}.ConnectX(..)`);
            src += "\n";
        } else {
            src += `${fieldPath}.SetX(${this.vector3Field.GetX()}) \n`;
        }

        if (this.connectedNodeY !== undefined) {
            src += "\n";
            src += this.connectedNodeY.GetAutoGenerationCode(`${fieldPath}.ConnectY(..)`);
            src += "\n";
        } else {
            src += `${fieldPath}.SetY(${this.vector3Field.GetY()}) \n`;
        }

        if (this.connectedNodeZ !== undefined) {
            src += "\n";
            src += this.connectedNodeZ.GetAutoGenerationCode(`${fieldPath}.ConnectZ(..)`);
            src += "\n";
        } else {
            src += `${fieldPath}.SetZ(${this.vector3Field.GetZ()}) \n`;
        }

        return src;
    }

    SerializeData() {
        return this.vector3Field.SerializeData();
    }

    ReadSerializedData(data: SerializedData) {
        this.SetVector3(data.x, data.y, data.z);
    }
}
