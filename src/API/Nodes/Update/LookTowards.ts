import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { StateField } from "API/Fields/StateField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AxisType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const LookTowardsName = "LookTowards";
export const LookTowardsFieldNames = {
    axisType: "axisType",
    target: "target",
    intensity: "intensity",
};

export class LookTowards extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        axisType: new StateField(AxisType, AxisType.XYZ),
        target: new ConnectableVector3Field(0, 0, 0),
        intensity: new ConnectableNumberField(0.1),
    };

    Update(data: ParticleData) {
        const axisType = this.nodeFields.axisType.GetState();
        const target = this.nodeFields.target.GetVector3(data);
        const intensity = this.nodeFields.intensity.GetNumber(data);

        const cf = new CFrame(data.particle.Position, target);
        const eulerAngles = cf.ToEulerAnglesXYZ();
        const currentRoation = data.rotation;
        let [x, y, z] = [currentRoation.X, currentRoation.Y, currentRoation.Z];

        if (IsAxisX(axisType)) {
            x = math.deg(eulerAngles[0]);
        }

        if (IsAxisY(axisType)) {
            y = math.deg(eulerAngles[1]);
        }

        if (IsAxisZ(axisType)) {
            z = math.deg(eulerAngles[2]);
        }

        data.rotation = data.rotation.Lerp(new Vector3(x, y, z), intensity);
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
