import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
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

    Update(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        const muliplier = this.nodeFields.graph.GetNumber(lifetime) - 1;

        const x = data.sizeNormal.X * muliplier;
        const y = data.sizeNormal.Y * muliplier;
        const z = data.sizeNormal.Z * muliplier;

        data.sizeMultiplier = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return MultiplySizeOverLifeName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenMultiplySizeOverLife(this, src);
    }
}
