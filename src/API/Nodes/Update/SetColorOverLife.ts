import { ColorRampField } from "API/Fields/ColorRampField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import { AutoGenSetColorOverLife } from "../AutoGeneration/UpdateNodes/AutoGenSetColorOverLife";
import { UpdateNode } from "./UpdateNode";

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

    GetAutoGenerationCode() {
        return AutoGenSetColorOverLife(this);
    }
}
