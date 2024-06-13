import { ConnectableVector2Field } from "API/Fields/ConnectableVector2Field";
import { StateField } from "API/Fields/StateField";
import { Rand, RoundDecimal } from "API/Lib";
import type { ParticleData } from "API/ParticleService";
import { ConnectableNumberField } from "../../Fields/ConnectableNumberField";
import { CalculationType1 } from "../FieldStates";
import { InitializeNode } from "./InitializeNode";

export class SetLifetime extends InitializeNode {
    static className = "SetLifetime";

    nodeFields = {
        calculationType: new StateField(CalculationType1, CalculationType1.Uniform, [
            CalculationType1.RandomConncted,
            CalculationType1.UniformConnected,
        ]),
        time: new ConnectableNumberField(1),
        range: new ConnectableVector2Field(0.5, 1),
    };

    Run(data: ParticleData) {
        const calculationType = this.nodeFields.calculationType.GetState();

        if (calculationType === CalculationType1.Uniform) {
            data.lifetime = this.nodeFields.time.GetNumber(data);
            return;
        }

        const range = this.nodeFields.range.GetSimpleVector2(data);
        const lifetime = RoundDecimal(Rand.NextNumber(range.x, range.y), 0.01);

        data.lifetime = lifetime;
    }

    GetClassName(): string {
        return SetLifetime.className;
    }
}
