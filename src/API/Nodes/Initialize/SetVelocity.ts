import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetVelocityName = "SetVelocity";
export const SetVelocityFieldNames = {
    velocity: "velocity",
};

export class SetVelocity extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        velocity: new ConnectableVector3Field(0, 0, 0),
    };

    Initialize(data: ParticleData) {
        const vector3 = this.nodeFields.velocity.GetVector3(data);
        data.velocityNormal = new Vector3(vector3.x, vector3.y, vector3.z);
    }

    GetNodeName(): string {
        return SetVelocityName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.velocity.AutoGenerateField(`${varName}.nodeFields.velocity`, src);
        });
    }
}
