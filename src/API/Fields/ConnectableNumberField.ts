import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import { NodeField } from "./NodeField";
import { NumberField } from "./NumberField";

interface SerializedData {
    number: number;
}

export class ConnectableNumberField extends NodeField {
    numberField: NumberField;
    connectedNode: undefined | LogicNode;

    constructor(number: number) {
        super();
        this.numberField = new NumberField(number);
    }

    GetNumberAsText = () => {
        return tostring(this.numberField.GetNumber());
    };

    GetNumber = (data: ParticleData) => {
        if (this.connectedNode !== undefined) {
            return this.connectedNode.Calculate(data) as number;
        }

        return this.numberField.GetNumber();
    };

    SetNumber = (number: number) => {
        this.numberField.SetNumber(number);
        this.connectedNode = undefined;
        this.FieldChanged.Fire();
    };

    ConnectNode = (node: LogicNode) => {
        this.connectedNode = node;
        this.FieldChanged.Fire();
    };

    DisconnectNode = () => {
        this.connectedNode = undefined;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string) {
        if (this.connectedNode !== undefined) {
            let src = "\n";
            src += this.connectedNode.GetAutoGenerationCode(`${fieldPath}.ConnectNode(..)`);
            src += "\n";
            return src;
        }

        return `${fieldPath}.SetNumber(${this.numberField.GetNumber()}) \n`;
    }

    SerializeData() {
        return this.numberField.SerializeData();
    }

    ReadSerializedData(data: SerializedData) {
        this.SetNumber(data.number);
    }
}
