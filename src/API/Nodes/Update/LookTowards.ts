import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { StateField } from "API/Fields/StateField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AxisType } from "../FieldStates";
import { IsAxisX, IsAxisY } from "../FieldStatesLib";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const LookTowardsName = "LookTowards";
export const LookTowardsFieldNames = {
    axisType: "axisType",
    target: "target",
    intensity: "intensity",
    rotationAdjustment: "rotationAdjustment",
};

export class LookTowards extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        axisType: new StateField(AxisType, AxisType.XY, [AxisType.Z, AxisType.XZ, AxisType.YZ, AxisType.XYZ]),
        target: new ConnectableVector3Field(0, 0, 0),
        intensity: new ConnectableNumberField(0.1),
        rotationAdjustment: new ConnectableVector3Field(0, 0, 0),
    };

    Update(data: ParticleData) {
        const axisType = this.nodeFields.axisType.GetState();
        const target = this.nodeFields.target.GetVector3(data);
        const intensity = this.nodeFields.intensity.GetNumber(data);
        const rotationAdjustment = this.nodeFields.rotationAdjustment.GetVector3(data);

        // wanted more control over rotation angles but my brain is too small to comprehend rotations so had to resort to something much simpler
        // (spent multiple hours on this)

        let targetDirection = target.sub(data.particle.Position).Unit;

        if (!IsAxisX(axisType)) {
            targetDirection = new Vector3(targetDirection.X, 0, targetDirection.Z).Unit;
        }

        if (!IsAxisY(axisType)) {
            targetDirection = new Vector3(0, targetDirection.Y, targetDirection.Z).Unit;
        }

        let cf = CFrame.lookAt(Vector3.zero, targetDirection);
        if (rotationAdjustment !== Vector3.zero) {
            cf = cf.mul(CFrame.Angles(math.rad(rotationAdjustment.X), math.rad(rotationAdjustment.Y), math.rad(rotationAdjustment.Z)));
        }

        data.rotation = data.rotation.Lerp(cf, intensity);
    }

    GetNodeName(): string {
        return LookTowardsName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenUpdateNode(this, src, (varName) => {
            this.nodeFields.axisType.AutoGenerateField(`${varName}.nodeFields.axisType`, src);
            this.nodeFields.target.AutoGenerateField(`${varName}.nodeFields.target`, src);
            this.nodeFields.intensity.AutoGenerateField(`${varName}.nodeFields.intensity`, src);
        });
    }
}
