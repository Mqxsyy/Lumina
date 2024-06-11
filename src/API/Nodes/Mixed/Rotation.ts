import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { AxisType, CalculationType1, NodeOperationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { MixedNode } from "./MixedNode";

export class Rotation extends MixedNode {
    static className = "Rotation";

    nodeFields = {
        nodeOperationType: new StateField(NodeOperationType, NodeOperationType.Set, [NodeOperationType.Multiply]),
        calculationType: new StateField(CalculationType1, CalculationType1.Uniform, [
            CalculationType1.UniformConnected,
            CalculationType1.RandomConncted,
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

    GetRotation(calculationType: string, data: ParticleData, rotationField: ConnectableNumberField, storedValues: Map<number, number>) {
        if (calculationType === CalculationType1.Uniform) return rotationField.GetNumber(data);

        const storedRotation = storedValues.get(data.particleId);
        if (storedRotation !== undefined) return storedRotation;

        const range = this.nodeFields.rangeX.GetSimpleVector2(data);
        const rotation = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
        storedValues.set(data.particleId, rotation);
        return rotation;
    }

    Run(data: ParticleData, dt: number) {
        const nodeOperationType = this.nodeFields.nodeOperationType.GetState();
        const calculationType = this.nodeFields.calculationType.GetState();
        const axisType = this.nodeFields.axisType.GetState();

        let [x, y, z] = [0, 0, 0];

        if (IsAxisX(axisType)) {
            x = this.GetRotation(calculationType, data, this.nodeFields.rotationX, this.storedValuesX);
        }

        if (IsAxisY(axisType)) {
            y = this.GetRotation(calculationType, data, this.nodeFields.rotationY, this.storedValuesY);
        }

        if (IsAxisZ(axisType)) {
            z = this.GetRotation(calculationType, data, this.nodeFields.rotationZ, this.storedValuesZ);
        }

        if (nodeOperationType === NodeOperationType.Set) {
            data.rotation = CFrame.Angles(x, y, z);
            return;
        }

        const currentRotation = data.rotation;
        data.rotation = CFrame.Angles(currentRotation.X + x * dt, currentRotation.Y + y * dt, currentRotation.Z + z * dt);
    }

    GetClassName(): string {
        return Rotation.className;
    }
}
