import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AxisType, CalculationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetVelocityName = "SetVelocity";
export const SetVelocityFieldNames = {
    calculationType: "calculationType",
    axisType: "axisType",
    velocityX: "velocityX",
    velocityY: "velocityY",
    velocityZ: "velocityZ",
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class SetVelocity extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {
        calculationType: new StateField(CalculationType, CalculationType.Uniform, [
            CalculationType.UniformConnected,
            CalculationType.RandomConncted,
        ]),
        axisType: new StateField(AxisType, AxisType.XYZ),
        velocityX: new ConnectableNumberField(0),
        velocityY: new ConnectableNumberField(0),
        velocityZ: new ConnectableNumberField(0),
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
                x = this.nodeFields.velocityX.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeX.GetSimpleVector2(data);
                x = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        if (IsAxisY(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                y = this.nodeFields.velocityY.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeY.GetSimpleVector2(data);
                y = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        if (IsAxisZ(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                z = this.nodeFields.velocityZ.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeZ.GetSimpleVector2(data);
                z = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return SetVelocityName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src, (varName) => {
            this.nodeFields.calculationType.AutoGenerateField(`${varName}.nodeFields.calculationType`, src);
            this.nodeFields.axisType.AutoGenerateField(`${varName}.nodeFields.axisType`, src);

            const calculationType = this.nodeFields.calculationType.GetState();
            const axisType = this.nodeFields.axisType.GetState();

            if (calculationType === CalculationType.Uniform) {
                if (IsAxisX(axisType)) this.nodeFields.velocityX.AutoGenerateField(`${varName}.nodeFields.velocityX`, src);
                if (IsAxisY(axisType)) this.nodeFields.velocityY.AutoGenerateField(`${varName}.nodeFields.velocityY`, src);
                if (IsAxisZ(axisType)) this.nodeFields.velocityZ.AutoGenerateField(`${varName}.nodeFields.velocityZ`, src);
            }

            if (calculationType === CalculationType.Random) {
                if (IsAxisX(axisType)) this.nodeFields.rangeX.AutoGenerateField(`${varName}.nodeFields.rangeX`, src);
                if (IsAxisY(axisType)) this.nodeFields.rangeY.AutoGenerateField(`${varName}.nodeFields.rangeY`, src);
                if (IsAxisZ(axisType)) this.nodeFields.rangeZ.AutoGenerateField(`${varName}.nodeFields.rangeZ`, src);
            }
        });
    }
}
