import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const MoveTowardsName = "MoveTowards";
export const MoveTowardsFieldNames = {
    target: "target",
    intensity: "intensity",
    speed: "speed",
};

export class MoveTowards extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        target: new ConnectableVector3Field(0, 0, 0),
        intensity: new ConnectableNumberField(0.1),
        speed: new ConnectableNumberField(1),
    };

    Update(data: ParticleData, dt: number) {
        const target = this.nodeFields.target.GetVector3(data);

        const intensity = this.nodeFields.intensity.GetNumber(data);
        const speed = this.nodeFields.speed.GetNumber(data);
        const targetVector = target.sub(data.particle.Position);

        data.velocityNormal = data.velocityNormal.Lerp(targetVector.div(dt).mul(speed), intensity);
    }

    GetNodeName(): string {
        return MoveTowardsName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenUpdateNode(this, src, (varName) => {
            this.nodeFields.target.AutoGenerateField(`${varName}.nodeFields.target`, src);
            this.nodeFields.intensity.AutoGenerateField(`${varName}.nodeFields.intensity`, src);
            this.nodeFields.speed.AutoGenerateField(`${varName}.nodeFields.speed`, src);
        });
    }
}
