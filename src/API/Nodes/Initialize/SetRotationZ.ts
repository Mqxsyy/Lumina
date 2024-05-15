import { NumberField } from "API/Fields/NumberField";
import { ParticleData } from "API/ParticleService";
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

    Initialize(data: ParticleData) {
        data.rotation = new Vector3(data.rotation.X, data.rotation.Y, this.nodeFields.rotation.GetNumber());
    }

    GetNodeName(): string {
        return SetRotationZName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetRotationZ(this);
    }
}
