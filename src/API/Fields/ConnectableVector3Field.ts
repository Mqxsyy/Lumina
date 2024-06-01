import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";
import { type SimpleVector3, Vector3Field } from "./Vector3Field";

interface SerializedData {
    x: number;
    y: number;
    z: number;
}

export class ConnectableVector3Field extends NodeField {
    vector3Field: Vector3Field;
    connectedNodeVector3: undefined | LogicNode;
    connectedNodeX: undefined | LogicNode;
    connectedNodeY: undefined | LogicNode;
    connectedNodeZ: undefined | LogicNode;

    constructor(x: number, y: number, z: number) {
        super();
        this.vector3Field = new Vector3Field(x, y, z);
    }

    GetSimpleVector3(data: ParticleData): SimpleVector3 {
        if (this.connectedNodeVector3 !== undefined) {
            const vec3 = this.connectedNodeVector3.Calculate(data) as Vector3;
            return { x: vec3.X, y: vec3.Y, z: vec3.Z };
        }

        const x = this.GetX(data);
        const y = this.GetY(data);
        const z = this.GetZ(data);

        return { x, y, z };
    }

    GetVector3(data: ParticleData) {
        if (this.connectedNodeVector3 !== undefined) return this.connectedNodeVector3.Calculate(data) as Vector3;

        const x = this.GetX(data);
        const y = this.GetY(data);
        const z = this.GetZ(data);

        return new Vector3(x, y, z);
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
        this.connectedNodeVector3 = undefined;

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

    ConnectVector3 = (node: LogicNode) => {
        this.connectedNodeVector3 = node;
        this.FieldChanged.Fire();
    };

    DisconnectVector3 = () => {
        this.connectedNodeVector3 = undefined;
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

    AutoGenerateField(fieldPath: string, src: Src) {
        if (this.connectedNodeVector3 !== undefined) {
            this.connectedNodeVector3.GetAutoGenerationCode(src, `${fieldPath}.ConnectVector3(..)`);
            return;
        }

        if (this.connectedNodeX !== undefined) {
            this.connectedNodeX.GetAutoGenerationCode(src, `${fieldPath}.ConnectX(..)`);
        } else {
            src.value += `${fieldPath}.SetX(${this.vector3Field.GetX()}) \n`;
        }

        if (this.connectedNodeY !== undefined) {
            this.connectedNodeY.GetAutoGenerationCode(src, `${fieldPath}.ConnectY(..)`);
        } else {
            src.value += `${fieldPath}.SetY(${this.vector3Field.GetY()}) \n`;
        }

        if (this.connectedNodeZ !== undefined) {
            this.connectedNodeZ.GetAutoGenerationCode(src, `${fieldPath}.ConnectZ(..)`);
        } else {
            src.value += `${fieldPath}.SetZ(${this.vector3Field.GetZ()}) \n`;
        }
    }

    SerializeData() {
        return this.vector3Field.SerializeData();
    }

    ReadSerializedData(data: SerializedData) {
        this.SetVector3(data.x, data.y, data.z);
    }
}
