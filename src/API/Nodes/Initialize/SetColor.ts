import { ColorField } from "API/Fields/ColorField";
import type { ParticleData } from "API/ParticleService";
import { InitializeNode } from "./InitializeNode";

export class SetColor extends InitializeNode {
    static className = "SetColor";

    nodeFields = {
        color: new ColorField(0, 1, 1),
    };

    Run(data: ParticleData) {
        data.color = this.nodeFields.color.GetColor();
    }

    GetClassName(): string {
        return SetColor.className;
    }
}
