import { ColorField } from "API/Fields/ColorField";
import { ParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetColor } from "../AutoGeneration/InitializeNodes/AutoGenSetColor";
import { InitializeNode } from "./InitializeNode";

export const SetColorName = "SetColor";
export const SetColorFieldNames = {
    color: "color",
};

export class SetColor extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        color: ColorField;
    };

    constructor() {
        super();

        this.nodeFields = {
            color: new ColorField(0, 1, 1),
        };
    }

    Initialize(data: ParticleData) {
        data.color = this.nodeFields.color.GetColor();
    }

    GetNodeName(): string {
        return SetColorName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetColor(this);
    }
}
