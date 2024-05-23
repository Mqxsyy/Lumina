import { RunService } from "@rbxts/services";
import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import type { NodeField } from "API/Fields/NodeField";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetPositionToParent } from "../AutoGeneration/InitializeNodes/AutoGenSetPositionToParent";
import { InitializeNode } from "./InitializeNode";

export const SetPositionToParentName = "SetPositionToParent";
export const SetPositionToParentFieldNames = {};

export class SetPositionToParent extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: { [key: string]: NodeField };

    parent?: BasePart;

    constructor(parent?: BasePart) {
        super();

        this.parent = parent;

        this.nodeFields = {
            position: new ConnectableVector3Field(0, 0, 0),
        };
    }

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
        AutoGenSetPositionToParent(this, src);
    }
}
