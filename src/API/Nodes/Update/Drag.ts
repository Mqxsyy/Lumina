import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenUpdateNode, UpdateNode } from "./UpdateNode";

export const DragName = "Drag";
export const DragFieldNames = {
    drag: "drag",
};

export class Drag extends UpdateNode {
    nodeGroup: NodeGroups = NodeGroups.Update;
    nodeFields: {
        drag: ConnectableNumberField;
    };

    constructor() {
        super();

        this.nodeFields = {
            drag: new ConnectableNumberField(0),
        };
    }

    Update(data: ParticleData, dt: number) {
        const drag = this.nodeFields.drag.GetNumber(data) * dt;
        const oldVelocity = data.velocityNormal;

        let [x, y, z] = [0, 0, 0];

        if (oldVelocity.X > 0 && oldVelocity.X - drag > 0) {
            x = oldVelocity.X - drag;
        } else if (oldVelocity.X < 0 && oldVelocity.X + drag < 0) {
            x = oldVelocity.X + drag;
        }

        if (oldVelocity.Y > 0 && oldVelocity.Y - drag > 0) {
            y = oldVelocity.Y - drag;
        } else if (oldVelocity.Y < 0 && oldVelocity.Y + drag < 0) {
            y = oldVelocity.Y + drag;
        }

        if (oldVelocity.Z > 0 && oldVelocity.Z - drag > 0) {
            z = oldVelocity.Z - drag;
        } else if (oldVelocity.Z < 0 && oldVelocity.Z + drag < 0) {
            z = oldVelocity.Z + drag;
        }

        data.velocityNormal = new Vector3(x, y, z);
    }

    GetNodeName(): string {
        return DragName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenUpdateNode(this, src, (varName) => {
            this.nodeFields.drag.AutoGenerateField(`${varName}.nodeFields.drag`, src);
        });
    }
}
