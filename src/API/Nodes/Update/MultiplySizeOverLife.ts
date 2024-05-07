import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import { GetParticleData } from "API/ParticleService";
import { AutoGenMultiplySizeOverLife } from "../AutoGeneration/UpdateNodes/AutoGenMultiplySizeOverLife";
import { UpdateNode } from "./UpdateNode";

export const MultiplySizeOverLifeName = "MultiplySizeOverLife";
export const MultiplySizeOverLifeFieldNames = {
    graph: "graph",
};

export class MultiplySizeOverLife extends UpdateNode {
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
        const muliplier = this.nodeFields.graph.GetNumber(lifetime) - 1;

        const x = particleData.sizeNormal.X * muliplier;
        const y = particleData.sizeNormal.Y * muliplier;

        particleData.sizeMultiplier = new Vector3(x, y, 0);
    }

    GetNodeName(): string {
        return MultiplySizeOverLifeName;
    }

    GetAutoGenerationCode() {
        return AutoGenMultiplySizeOverLife(this);
    }
}
