import { ColorRampField } from "API/Fields/ColorRampField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const SetColorOverLifeName = "SetColorOverLife";
export const SetColorOverLifeFieldNames = {
    ramp: "ramp",
};

export class SetColorOverLife extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        ramp: new ColorRampField(),
    };

    Update(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        data.color = this.nodeFields.ramp.GetColor(lifetime);
    }

    GetNodeName(): string {
        return SetColorOverLifeName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenUpdateNode(this, src, (varName) => {
            this.nodeFields.ramp.AutoGenerateField(`${varName}.nodeFields.ramp`, src);
        });
    }
}
