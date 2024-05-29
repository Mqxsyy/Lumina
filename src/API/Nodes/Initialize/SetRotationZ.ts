import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetRotationZName = "SetRotationZ";
export const SetRotationZFieldNames = {
    rotation: "rotation",
};

export class SetRotationZ extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {
        rotation: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            rotation: new ConnectableNumberField(0),
        };
    }

    Initialize(data: ParticleData) {
        data.rotation = new Vector3(data.rotation.X, data.rotation.Y, this.nodeFields.rotation.GetNumber(data));
    }

    GetNodeName(): string {
        return SetRotationZName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.rotation.AutoGenerateField(`${varName}.nodeFields.rotation`, src);
        });
    }
}
