import { LineGraphField } from "API/Fields/LineGraphField";
import { StateField } from "API/Fields/StateField";
import type { ParticleData } from "API/ParticleService";
import { CalculationType2 } from "../FieldStates";
import { UpdateNode } from "./UpdateNode";

export class MultiplyRotationOverLife extends UpdateNode {
    static className = "RotationOverLife";

    nodeFields = {
        calculationType: new StateField(CalculationType2, CalculationType2.Connected),
        graph: new LineGraphField(),
        graphX: new LineGraphField(),
        graphY: new LineGraphField(),
        graphZ: new LineGraphField(),
    };

    Run(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        const calculationType = this.nodeFields.calculationType.GetState();

        let [rx, ry, rz] = [0, 0, 0];

        if (calculationType === CalculationType2.Connected) {
            const value = this.nodeFields.graph.GetNumber(lifetime);
            [rx, ry, rz] = [value, value, value];
        }

        if (calculationType === CalculationType2.Individual) {
            rx = this.nodeFields.graphX.GetNumber(lifetime);
            ry = this.nodeFields.graphY.GetNumber(lifetime);
            rz = this.nodeFields.graphZ.GetNumber(lifetime);
        }

        data.rotationMultiplier = new Vector3(rx, ry, rz);
    }

    GetClassName(): string {
        return MultiplyRotationOverLife.className;
    }
}
