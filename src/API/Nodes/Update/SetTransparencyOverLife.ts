import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import { GetParticleData, UpdateParticleData } from "API/ParticleService";
import { AutoGenTransparencyOverLife } from "../AutoGeneration/UpdateNodes/AutoGenSetTransparencyOverLife";
import { UpdateNode } from "./UpdateNode";

export const SetTransparencyOverLifeName = "SetTransparencyOverLife";
export const SetTransparencyOverLifeFieldNames = {
    graph: "graph",
};

export class SetTransparencyOverLife extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        graph: new LineGraphField(),
    };

    constructor() {
        super();
    }

    Update(id: number) {
        const particleData = GetParticleData(id);
        const lifetime = (os.clock() - particleData.spawnTime) / particleData.lifetime;

        UpdateParticleData(id, (data) => {
            data.transparency = this.nodeFields.graph.GetNumber(lifetime);
            return data;
        });
    }

    GetNodeName(): string {
        return SetTransparencyOverLifeName;
    }

    GetAutoGenerationCode() {
        return AutoGenTransparencyOverLife(this);
    }
}
