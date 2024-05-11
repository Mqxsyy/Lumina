import { RunService } from "@rbxts/services";
import { Vector3Field } from "API/Fields/Vector3Field";
import { UpdateParticleData } from "API/ParticleService";
import { NodeGroups } from "../../NodeGroup";
import { AutoGenSetPositionToParent } from "../AutoGeneration/InitializeNodes/AutoGenSetPositionToParent";
import { InitializeNode } from "./InitializeNode";

export const SetPositionToParentName = "SetPositionToParent";
export const SetPositionToParentFieldNames = {};

export class SetPositionToParent extends InitializeNode {
    nodeGroup: NodeGroups = NodeGroups.Initialize;
    nodeFields: {};

    parent?: BasePart;

    constructor(parent?: BasePart) {
        super();

        this.parent = parent;

        this.nodeFields = {
            position: new Vector3Field(0, 0, 0),
        };
    }

    Initialize(id: number) {
        if (!RunService.IsRunning()) return;
        if (this.parent === undefined) return;

        UpdateParticleData(id, (data) => {
            const pos = this.parent!.Position;
            data.particle.Position = new Vector3(pos.X, pos.Y, pos.Z);
            return data;
        });
    }

    GetNodeName(): string {
        return SetPositionToParentName;
    }

    GetAutoGenerationCode() {
        return AutoGenSetPositionToParent(this);
    }
}
