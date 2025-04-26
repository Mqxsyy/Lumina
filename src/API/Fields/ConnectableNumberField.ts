import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";
import { NumberField } from "./NumberField";

interface SerializedData {
    number: number;
}

export class ConnectableNumberField extends NodeField {
    private numberField: NumberField;
    private connectedFn: undefined | ((data: ParticleData) => number);
    connectedNode: undefined | LogicNode;

    constructor(number: number) {
        super();
        this.numberField = new NumberField(number);
    }

    GetNumberAsText = () => {
        return tostring(this.numberField.GetNumber());
    };

    GetNumber = (data: ParticleData) => {
        if (this.connectedFn !== undefined) {
            return this.connectedFn(data);
        }

        return this.numberField.GetNumber();
    };

    SetNumber = (number: number) => {
        this.numberField.SetNumber(number);
        this.connectedNode = undefined;
        this.FieldChanged.Fire();
    };

    ConnectNode = (node: LogicNode, fn: (data: ParticleData) => number | Vector2 | Vector3 | Color3) => {
        this.connectedNode = node;
        this.connectedFn = fn as (data: ParticleData) => number;
        this.FieldChanged.Fire();
    };

    DisconnectNode = () => {
        this.connectedNode = undefined;
        this.connectedFn = undefined;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        if (this.connectedNode !== undefined) {
            this.connectedNode.GetAutoGenerationCode(src, `${fieldPath}.ConnectNode(..)`);
            return;
        }

        src.value += `${fieldPath}.SetNumber(${this.numberField.GetNumber()}) \n`;
    }

    SerializeData() {
        return this.numberField.SerializeData();
    }

    ReadSerializedData(data: SerializedData) {
        this.SetNumber(data.number);
    }
}
