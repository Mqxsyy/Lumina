import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import { GetParticleData } from "API/ParticleService";
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
        particleData.particle.SurfaceGui.ImageLabel.ImageTransparency = this.nodeFields.graph.GetNumber(lifetime);
    }

    GetNodeName(): string {
        return SetTransparencyOverLifeName;
    }

    GetAutoGenerationCode() {
        return AutoGenTransparencyOverLife(this);
    }
}
