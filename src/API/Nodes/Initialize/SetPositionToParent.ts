import { RunService } from "@rbxts/services";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenInitializeNode, InitializeNode } from "./InitializeNode";

export const SetPositionToParentName = "SetPositionToParent";
export const SetPositionToParentFieldNames = {};

export class SetPositionToParent extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields = {};

    parent?: BasePart;

    Initialize(data: ParticleData) {
        if (!RunService.IsRunning()) return;
        if (this.parent === undefined) return;

        const pos = this.parent.Position;
        data.particle.Position = new Vector3(pos.X, pos.Y, pos.Z);
    }

    GetNodeName(): string {
        return SetPositionToParentName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenInitializeNode(this, src);
    }
}
