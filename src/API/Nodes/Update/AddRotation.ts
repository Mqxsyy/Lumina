import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AxisType, CalculationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const AddRotationName = "AddRotation";
export const AddRotationFieldNames = {
    calculationType: "calculationType",
    axisType: "axisType",
    rotationX: "rotationX",
    rotationY: "rotationY",
    rotationZ: "rotationZ",
    rangeX: "rangeX",
    rangeY: "rangeY",
    rangeZ: "rangeZ",
};

export class AddRotation extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
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

    storedValuesX = new Map<number, number>();
    storedValuesY = new Map<number, number>();
    storedValuesZ = new Map<number, number>();

    Update(data: ParticleData, dt: number) {
        const calculationType = this.nodeFields.calculationType.GetState();
        const axisType = this.nodeFields.axisType.GetState();
        let x = 0;
        let y = 0;
        let z = 0;

        if (IsAxisX(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                x = this.nodeFields.rotationX.GetNumber(data);
            } else {
                const storedX = this.storedValuesX.get(data.particleId);

                if (storedX === undefined) {
                    const range = this.nodeFields.rangeX.GetSimpleVector2(data);
                    x = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
                    this.storedValuesX.set(data.particleId, x);
                } else {
                    x = storedX;
                }
            }
        }

        if (IsAxisY(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                y = this.nodeFields.rotationY.GetNumber(data);
            } else {
                const storedY = this.storedValuesY.get(data.particleId);

                if (storedY === undefined) {
                    const range = this.nodeFields.rangeY.GetSimpleVector2(data);
                    y = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
                    this.storedValuesY.set(data.particleId, y);
                } else {
                    y = storedY;
                }
            }
        }

        if (IsAxisZ(axisType)) {
            if (calculationType === CalculationType.Uniform) {
                z = this.nodeFields.rotationZ.GetNumber(data);
            } else {
                const storedZ = this.storedValuesZ.get(data.particleId);

                if (storedZ === undefined) {
                    const range = this.nodeFields.rangeZ.GetSimpleVector2(data);
                    z = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
                    this.storedValuesZ.set(data.particleId, z);
                } else {
                    z = storedZ;
                }
            }
        }

        const currentRotation = data.rotation;
        data.rotation = CFrame.Angles(currentRotation.X + x * dt, currentRotation.Y + y * dt, currentRotation.Z + z * dt);
    }

    GetNodeName(): string {
        return AddRotationName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenUpdateNode(this, src, (varName) => {
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
