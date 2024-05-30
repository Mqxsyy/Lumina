import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetPositionName = "SetPosition";
export const SetPositionFieldNames = {
    position: "position",
};

export class SetPosition extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        position: new ConnectableVector3Field(0, 0, 0),
    };

    Initialize(data: ParticleData) {
        const vector3 = this.nodeFields.position.GetSimpleVector3(data);
        data.particle.Position = new Vector3(vector3.x, vector3.y, vector3.z);
    }

    GetNodeName(): string {
        return SetPositionName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.position.AutoGenerateField(`${varName}.nodeFields.position`, src);
        });
    }
}
