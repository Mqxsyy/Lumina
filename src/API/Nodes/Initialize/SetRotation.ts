import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AxisType, CalculationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetRotationName = "SetRotation";
export const SetRotationFieldNames = {
    calculationType: "calculationType",
    axisType: "axisType",
    rotationX: "rotationX",
    rotationY: "rotationY",
    rotationZ: "rotationZ",
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class SetRotation extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        calculationType: new StateField(CalculationType, CalculationType.Uniform, [
            CalculationType.UniformConnected,
            CalculationType.RandomConncted,
        ]),
        axisType: new StateField(AxisType, AxisType.XYZ),
        rotationX: new ConnectableNumberField(0),
        rotationY: new ConnectableNumberField(0),
        rotationZ: new ConnectableNumberField(0),
        rangeX: new ConnectableVector2Field(0, 0),
        rangeY: new ConnectableVector2Field(0, 0),
        rangeZ: new ConnectableVector2Field(0, 0),
    };

    Initialize(data: ParticleData) {
        const calculationType = this.nodeFields.calculationType.GetState();
        const axisType = this.nodeFields.axisType.GetState();
        let x = 0;
        let y = 0;
        let z = 0;

        if (IsAxisX(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                x = this.nodeFields.rotationX.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeX.GetVector2(data);
                x = Rand.NextNumber(range.x, range.y);
            }
        }

        if (IsAxisY(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                y = this.nodeFields.rotationY.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeY.GetVector2(data);
                y = Rand.NextNumber(range.x, range.y);
            }
        }

        if (IsAxisZ(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                z = this.nodeFields.rotationZ.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeZ.GetVector2(data);
                z = Rand.NextNumber(range.x, range.y);
            }
        }

        data.rotation = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return SetRotationName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.calculationType.AutoGenerateField(`${varName}.nodeFields.calculationType`, src);
            this.nodeFields.axisType.AutoGenerateField(`${varName}.nodeFields.axisType`, src);

            const calculationType = this.nodeFields.calculationType.GetState();
            const axisType = this.nodeFields.axisType.GetState();

            if (calculationType === CalculationType.Uniform) {
                if (IsAxisX(axisType)) this.nodeFields.rotationX.AutoGenerateField(`${varName}.nodeFields.rotationX`, src);
                if (IsAxisY(axisType)) this.nodeFields.rotationY.AutoGenerateField(`${varName}.nodeFields.rotationY`, src);
                if (IsAxisZ(axisType)) this.nodeFields.rotationZ.AutoGenerateField(`${varName}.nodeFields.rotationZ`, src);
            }

            if (calculationType === CalculationType.Random) {
                if (IsAxisX(axisType)) this.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`, src);
                if (IsAxisY(axisType)) this.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`, src);
                if (IsAxisZ(axisType)) this.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`, src);
            }
        });
    }
}
