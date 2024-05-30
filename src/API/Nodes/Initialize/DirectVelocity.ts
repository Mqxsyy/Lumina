import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { UpdatePrioriy } from "../Node";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const DirectVelocityName = "DirectVelocity";
export const DirectVelocityFieldNames = {
    directon: "directon",
};

export class DirectVelocity extends InitializeNode {
    updatePriority = UpdatePrioriy.Last;
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        directon: new ConnectableVector3Field(0, 0, 0),
    };

    Initialize(data: ParticleData) {
        const dir = this.nodeFields.directon.GetVector3(data);
        if (dir.x === 0 && dir.y === 0 && dir.z === 0) return;

        const targetVector = data.particle.Position.sub(new Vector3(dir.x, dir.y, dir.z));

        const lookDir = CFrame.lookAt(Vector3.zero, targetVector);

        data.velocityNormal = lookDir.mul(data.velocityNormal);
    }

    GetNodeName(): string {
        return DirectVelocityName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.directon.AutoGenerateField(`${varName}.nodeFields.directon`, src);
        });
    }
}
