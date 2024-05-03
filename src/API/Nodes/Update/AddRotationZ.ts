import { NumberField } from "API/Fields/NumberField";
import { FrameRateMultiplier } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import { GetParticleData } from "API/ParticleService";
import { AutoGenAddRotationZ } from "../AutoGeneration/UpdateNodes/AutoGenAddRotationZ";
import { UpdateNode } from "./UpdateNode";

export const AddRotationZName = "AddRotationZ";
export const AddRotationZFieldNames = {
    rotation: "rotation",
};

export class AddRotationZ extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        rotation: NumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            rotation: new NumberField(0),
        };
    }

    Update(id: number) {
        const zAddition = this.nodeFields.rotation.GetNumber() * FrameRateMultiplier;
        GetParticleData(id).particle.SurfaceGui.ImageLabel.Rotation += zAddition;
    }

    GetNodeName(): string {
        return AddRotationZName;
    }

    GetAutoGenerationCode() {
        return AutoGenAddRotationZ(this);
    }
}
