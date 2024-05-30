import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const AddPositionName = "AddPosition";
export const AddPositionFieldNames = {
    position: "position",
};

export class AddPosition extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        position: new ConnectableVector3Field(0, 0, 0),
    };

    Initialize(data: ParticleData) {
        const vector3 = this.nodeFields.position.GetVector3(data);
        data.particle.Position = data.particle.Position.add(new Vector3(vector3.x, vector3.y, vector3.z));
    }

    GetNodeName(): string {
        return AddPositionName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.position.AutoGenerateField(`${varName}.nodeFields.position`, src);
        });
    }
}
