import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { AxisType, CalculationType1 } from "../FieldStates";
import { IsAxisX, IsAxisY, IsAxisZ } from "../FieldStatesLib";
import { MixedNode } from "./MixedNode";

export class SetSize extends MixedNode {
    static className = "SetSize";

    nodeFields = {
        calculationType: new StateField(CalculationType1, CalculationType1.Uniform),
        axisType: new StateField(AxisType, AxisType.XYZ, [AxisType.X, AxisType.Y, AxisType.Z]),
        size: new ConnectableNumberField(1),
        sizeX: new ConnectableNumberField(1),
        sizeY: new ConnectableNumberField(1),
        sizeZ: new ConnectableNumberField(1),
        range: new ConnectableVector2Field(0.5, 1),
        rangeX: new ConnectableVector2Field(0.5, 1),
        rangeY: new ConnectableVector2Field(0.5, 1),
        rangeZ: new ConnectableVector2Field(0.5, 1),
    };

    Run(data: ParticleData) {
        const calculationType = this.nodeFields.calculationType.GetState();
        if (calculationType === CalculationType1.UniformConnected) {
            const size = this.nodeFields.size.GetNumber(data);
            data.sizeNormal = new Vector3(size, size, size);
            return;
        }

        if (calculationType === CalculationType1.RandomConncted) {
            const range = this.nodeFields.range.GetSimpleVector2(data);
            const size = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            data.sizeNormal = new Vector3(size, size, size);
            return;
        }

        const axisType = this.nodeFields.axisType.GetState();
        let x = 0;
        let y = 0;
        let z = 0;

        if (IsAxisX(axisType)) {
            if (calculationType === CalculationType1.Uniform) {
                x = this.nodeFields.sizeX.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeX.GetSimpleVector2(data);
                x = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        if (IsAxisY(axisType)) {
            if (calculationType === CalculationType1.Uniform) {
                y = this.nodeFields.sizeY.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeY.GetSimpleVector2(data);
                y = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        if (IsAxisZ(axisType)) {
            if (calculationType === CalculationType1.Uniform) {
                z = this.nodeFields.sizeZ.GetNumber(data);
            } else {
                const range = this.nodeFields.rangeZ.GetSimpleVector2(data);
                z = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);
            }
        }

        data.sizeNormal = new Vector3(x, y, z);
    }

    GetClassName(): string {
        return SetSize.className;
    }
}
