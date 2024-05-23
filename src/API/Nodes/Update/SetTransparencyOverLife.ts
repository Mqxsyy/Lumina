import { LineGraphField } from "API/Fields/LineGraphField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
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

    Update(data: ParticleData) {
        const lifetime = (os.clock() - data.spawnTime) / data.lifetime;
        data.transparency = this.nodeFields.graph.GetNumber(lifetime);
    }

    GetNodeName(): string {
        return SetTransparencyOverLifeName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenTransparencyOverLife(this, src);
    }
}
