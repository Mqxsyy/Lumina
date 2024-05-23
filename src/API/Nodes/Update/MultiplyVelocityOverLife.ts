import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenMultiplyVelocityOverLife } from "../AutoGeneration/UpdateNodes/AutoGenMultiplyVelocityOverLife";
import { UpdateNode } from "./UpdateNode";

export const MultiplyVelocityOverLifeName = "MultiplyVelocityOverLife";
export const MultiplyVelocityOverLifeFieldNames = {
    graph: "graph",
};

export class MultiplyVelocityOverLife extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields = {
        graph: new LineGraphField(),
    };

    Update(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        const muliplier = this.nodeFields.graph.GetNumber(lifetime);
        data.velocityMultiplier = new Vector3(muliplier, muliplier, muliplier);
    }

    GetNodeName(): string {
        return MultiplyVelocityOverLifeName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenMultiplyVelocityOverLife(this, src);
    }
}
