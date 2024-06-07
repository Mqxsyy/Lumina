import { ConnectableVector3Field } from "API/Fields/ConnectableVector3Field";
import { StateField } from "API/Fields/StateField";
import type { ParticleData } from "API/ParticleService";
import { NodeOperationType } from "../FieldStates";
import { MixedNode } from "./MixedNode";

export class Position extends MixedNode {
    static className = "Position";

    nodeFields = {
        nodeOperationType: new StateField(NodeOperationType, NodeOperationType.Set),
        position: new ConnectableVector3Field(0, 0, 0),
    };

    Run(data: ParticleData) {
        const nodeOperationType = this.nodeFields.nodeOperationType.GetState();
        const position = this.nodeFields.position.GetVector3(data);

        if (nodeOperationType === NodeOperationType.Set) {
            data.nextPos = position;
            return;
        }

        if (nodeOperationType === NodeOperationType.Add) {
            if (data.nextPos === undefined) {
                data.nextPos = data.particle.Position.add(position);
                return;
            }

            data.nextPos = data.nextPos.add(position);
        }
    }

    GetClassName(): string {
        return Position.className;
    }
}
