import { NumberField } from "API/Fields/NumberField";
import { GetParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetRotationZ } from "../AutoGeneration/InitializeNodes/AutoGenSetRotationZ";
import { InitializeNode } from "./InitializeNode";

export const SetRotationZName = "SetRotationZ";
export const SetRotationZFieldNames = {
    rotation: "rotation",
};

export class SetRotationZ extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        rotation: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            rotation: new NumberField(0),
        };
    }

    Initialize(id: number) {
        GetParticleData(id).particle.SurfaceGui.ImageLabel.Rotation = this.nodeFields.rotation.GetNumber();
    }

    GetNodeName(): string {
        return SetRotationZName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetRotationZ(this);
    }
}
