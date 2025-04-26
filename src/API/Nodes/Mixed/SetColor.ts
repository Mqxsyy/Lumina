import { ColorField } from "API/Fields/ColorField";
import type { ParticleData } from "API/ParticleService";
import { MixedNode } from "./MixedNode";
import { ConnectableColorField } from "API/Fields/ConnectableColorField";

export class SetColor extends MixedNode {
    static className = "SetColor";

    nodeFields = {
        Color: new ConnectableColorField(0, 1, 1),
    };

    Run(data: ParticleData) {
        data.color = this.nodeFields.Color.GetColor(data);
    }

    GetClassName(): string {
        return SetColor.className;
    }
}
