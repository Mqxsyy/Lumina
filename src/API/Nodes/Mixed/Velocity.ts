import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { AxisType, CalculationType1, NodeOperationType } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { MixedNode } from "./MixedNode";

export class Velocity extends MixedNode {
    static className = "Velocity";

    nodeFields = {
        nodeOperationType: new StateField(NodeOperationType, NodeOperationType.Set, [NodeOperationType.Multiply]),
        calculationType: new StateField(CalculationType1, CalculationType1.Uniform, [
            CalculationType1.UniformConnected,
            CalculationType1.RandomConncted,
        ]),
        axisType: new StateField(AxisType, AxisType.XYZ),
        velocityX: new ConnectableNumberField(0),
        velocityY: new ConnectableNumberField(0),
        velocityZ: new ConnectableNumberField(0),
        rangeX: new ConnectableVector2Field(0, 0),
        rangeY: new ConnectableVector2Field(0, 0),
        rangeZ: new ConnectableVector2Field(0, 0),
    };

    storedValuesX = new Map<number, number>();
    storedValuesY = new Map<number, number>();
    storedValuesZ = new Map<number, number>();

    private GetVelocity(
        calculationType: string,
        data: ParticleData,
        numberField: ConnectableNumberField,
        rangeField: ConnectableVector2Field,
        storedValues: Map<number, number>,
    ) {
        if (calculationType === CalculationType1.Uniform) return numberField.GetNumber(data);

        const storedVelocity = storedValues.get(data.particleId);
        if (storedVelocity !== undefined) return storedVelocity;

        const range = rangeField.GetSimpleVector2(data);
        const velocity = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
        storedValues.set(data.particleId, velocity);
        return velocity;
    }

    Run(data: ParticleData, dt: number) {
        const nodeOperationType = this.nodeFields.nodeOperationType.GetState();
        const calculationType = this.nodeFields.calculationType.GetState();
        const axisType = this.nodeFields.axisType.GetState();

        let [x, y, z] = [0, 0, 0];

        if (IsAxisX(axisType)) {
            x = this.GetVelocity(calculationType, data, this.nodeFields.velocityX, this.nodeFields.rangeX, this.storedValuesX);
        }

        if (IsAxisY(axisType)) {
            y = this.GetVelocity(calculationType, data, this.nodeFields.velocityY, this.nodeFields.rangeY, this.storedValuesY);
        }

        if (IsAxisZ(axisType)) {
            z = this.GetVelocity(calculationType, data, this.nodeFields.velocityZ, this.nodeFields.rangeZ, this.storedValuesZ);
        }

        if (nodeOperationType === NodeOperationType.Set) {
            data.velocityNormal = new Vector3(x, y, z);
            return;
        }

        const oldVelocity = data.velocityNormal;
        data.velocityNormal = new Vector3(oldVelocity.X + x * dt, oldVelocity.Y + y * dt, oldVelocity.Z + z * dt);
    }

    GetClassName(): string {
        return Velocity.className;
    }
}
