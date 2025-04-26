import type { LogicNode } from "API/Nodes/Logic/LogicNode";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";
import type { SerializedColorField } from "./ColorField";
import { ColorField } from "./ColorField";

export interface SimpleColor {
    hue: number;
    saturation: number;
    value: number;
}

export class ConnectableColorField extends NodeField {
    colorField: ColorField;
    connectedNodeColor?: LogicNode;
    connectedNodeHue?: LogicNode;
    connectedNodeSaturation?: LogicNode;
    connectedNodeValue?: LogicNode;

    constructor(hue: number, saturation: number, value: number) {
        super();
        this.colorField = new ColorField(hue, saturation, value);
    }

    GetSimpleColor(data: ParticleData): SimpleColor {
        if (this.connectedNodeColor !== undefined) {
            const color3 = this.connectedNodeColor.Calculate(data) as Color3;
            const [h, s, v] = Color3.toHSV(color3);
            return { hue: h, saturation: s, value: v };
        }

        return {
            hue: this.GetHue(data),
            saturation: this.GetSaturation(data),
            value: this.GetValue(data),
        };
    }

    GetColor(data: ParticleData): Color3 {
        if (this.connectedNodeColor !== undefined) {
            return this.connectedNodeColor.Calculate(data) as Color3;
        }

        const h = this.GetHue(data);
        const s = this.GetSaturation(data);
        const v = this.GetValue(data);
        return Color3.fromHSV(h, s, v);
    }

    GetHueAsText = () => tostring(this.colorField.hue);
    GetHue = (data: ParticleData): number => {
        if (this.connectedNodeHue !== undefined) {
            return this.connectedNodeHue.Calculate(data) as number;
        }
        return this.colorField.hue;
    };

    GetSaturationAsText = () => tostring(this.colorField.saturation);
    GetSaturation = (data: ParticleData): number => {
        if (this.connectedNodeSaturation !== undefined) {
            return this.connectedNodeSaturation.Calculate(data) as number;
        }
        return this.colorField.saturation;
    };

    GetValueAsText = () => tostring(this.colorField.value);
    GetValue = (data: ParticleData): number => {
        if (this.connectedNodeValue !== undefined) {
            return this.connectedNodeValue.Calculate(data) as number;
        }
        return this.colorField.value;
    };

    SetColor = (hue: number, saturation: number, value: number) => {
        this.connectedNodeColor = undefined;
        this.SetHue(hue, true);
        this.SetSaturation(saturation, true);
        this.SetValue(value, true);
        this.FieldChanged.Fire();
    };

    SetHue = (hue: number, ignoreFieldChange = false) => {
        this.colorField.SetHue(hue);
        this.connectedNodeHue = undefined;
        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetSaturation = (saturation: number, ignoreFieldChange = false) => {
        this.colorField.SetSaturation(saturation);
        this.connectedNodeSaturation = undefined;
        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    SetValue = (value: number, ignoreFieldChange = false) => {
        this.colorField.SetValue(value);
        this.connectedNodeValue = undefined;
        if (!ignoreFieldChange) return;
        this.FieldChanged.Fire();
    };

    ConnectColor = (node: LogicNode) => {
        this.connectedNodeColor = node;
        this.FieldChanged.Fire();
    };

    DisconnectColor = () => {
        this.connectedNodeColor = undefined;
        this.FieldChanged.Fire();
    };

    ConnectHue = (node: LogicNode) => {
        this.connectedNodeHue = node;
        this.FieldChanged.Fire();
    };

    DisconnectHue = () => {
        this.connectedNodeHue = undefined;
        this.FieldChanged.Fire();
    };

    ConnectSaturation = (node: LogicNode) => {
        this.connectedNodeSaturation = node;
        this.FieldChanged.Fire();
    };

    DisconnectSaturation = () => {
        this.connectedNodeSaturation = undefined;
        this.FieldChanged.Fire();
    };

    ConnectValue = (node: LogicNode) => {
        this.connectedNodeValue = node;
        this.FieldChanged.Fire();
    };

    DisconnectValue = () => {
        this.connectedNodeValue = undefined;
        this.FieldChanged.Fire();
    };

    AutoGenerateField(fieldPath: string, src: Src) {
        if (this.connectedNodeColor !== undefined) {
            this.connectedNodeColor.GetAutoGenerationCode(src, `${fieldPath}.ConnectColor(..)`);
            return;
        }

        if (this.connectedNodeHue !== undefined) {
            this.connectedNodeHue.GetAutoGenerationCode(src, `${fieldPath}.ConnectHue(..)`);
        } else {
            src.value += `${fieldPath}.SetHue(${this.colorField.hue}) \n`;
        }

        if (this.connectedNodeSaturation !== undefined) {
            this.connectedNodeSaturation.GetAutoGenerationCode(src, `${fieldPath}.ConnectSaturation(..)`);
        } else {
            src.value += `${fieldPath}.SetSaturation(${this.colorField.saturation}) \n`;
        }

        if (this.connectedNodeValue !== undefined) {
            this.connectedNodeValue.GetAutoGenerationCode(src, `${fieldPath}.ConnectValue(..)`);
        } else {
            src.value += `${fieldPath}.SetValue(${this.colorField.value}) \n`;
        }
    }

    SerializeData(): SerializedColorField {
        return this.colorField.SerializeData();
    }

    ReadSerializedData(data: SerializedColorField) {
        this.SetColor(data.hue, data.saturation, data.value);
    }
}
