import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import { UpdateParticleData } from "API/ParticleService";
import { AutoGenSetSizeOverLife } from "../AutoGeneration/UpdateNodes/AutoGenSetSizeOverLife";
import { UpdateNode } from "./UpdateNode";

export const SetSizeOverLifeName = "SetSizeOverLife";
export const SetSizeOverLifeFieldNames = {
    graph: "graph",
};

export class SetSizeOverLife extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        graph: new LineGraphField(),
    };

    constructor() {
        super();
    }

    Update(id: number) {
        UpdateParticleData(id, (data) => {
            const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
            const size = this.nodeFields.graph.GetNumber(lifetime);
            const sizeVector3 = new Vector3(size, size, 0.001);

            if (data.sizeNormal === sizeVector3) return data;

            data.sizeNormal = sizeVector3;
            return data;
        });
    }

    GetNodeName(): string {
        return SetSizeOverLifeName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetSizeOverLife(this);
    }
}
