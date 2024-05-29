import { Workspace } from "@rbxts/services";
import { BooleanField } from "API/Fields/BooleanField";
import { ConnectableNumberField } from "API/Fields/ConnectableNumberField";
import { NodeGroups } from "API/NodeGroup";
import type { ParticleData } from "API/ParticleService";
import type { Src } from "API/VFXScriptCreator";
import { AutoGenBounce } from "../AutoGeneration/UpdateNodes/AutoGenBounce";
import { UpdatePrioriy } from "../Node";
import { UpdateNode } from "./UpdateNode";

export const BounceName = "Bounce";
export const BounceFieldNames = {
    velocityMultiplier: "velocityMultiplier",
    limitBounces: "limitBounces",
    maxBounces: "maxBounces",
};

export class Bounce extends UpdateNode {
    updatePriority = UpdatePrioriy.Last;
    nodeGroup = NodeGroups.Update;
    nodeFields = {
        velocityMultiplier: new ConnectableNumberField(1),
        limitBounces: new BooleanField(false),
        maxBounces: new ConnectableNumberField(3),
    };

    // mem leak probs, never gets cleared
    bounceTracker: Map<number, number> = new Map();

    CheckReflection(
        data: ParticleData,
        dt: number,
        origin: Vector3 | undefined = undefined,
        velocityNormal: Vector3 | undefined = undefined,
        travelledDistance = 0,
    ): [Vector3, Vector3] | undefined {
        const velocity = (velocityNormal || data.velocityNormal).mul(data.velocityMultiplier).mul(dt);

        const halfParticleSize = data.particle.Size.Magnitude * 0.5;
        const direction = velocity.add(velocity.Unit.mul(halfParticleSize)).sub(velocity.Unit.mul(travelledDistance));

        const rayHit = Workspace.Raycast(origin || data.particle.Position, direction);
        if (rayHit === undefined) return undefined;

        if (this.nodeFields.limitBounces.GetBoolean() === true) {
            const maxBounces = this.nodeFields.maxBounces.GetNumber(data);
            if (maxBounces === 0) return undefined;

            const bounces = this.bounceTracker.get(data.particleId) || 0;

            if (bounces >= maxBounces) return undefined;
            this.bounceTracker.set(data.particleId, bounces + 1);
        }

        const collisionDistance = rayHit.Distance - halfParticleSize;
        const pos = (origin || data.particle.Position).add(direction.Unit.mul(collisionDistance));

        const normal = rayHit.Normal;
        const reflect = direction.sub(normal.mul(direction.Dot(normal) * 2));

        const reflectedVelocityNormal = reflect.Unit.mul((velocityNormal || data.velocityNormal).Magnitude).mul(
            this.nodeFields.velocityMultiplier.GetNumber(data),
        );

        const nextReflect = this.CheckReflection(data, dt, pos, reflectedVelocityNormal, collisionDistance);
        if (nextReflect !== undefined) return nextReflect;

        const leftoverDistance = velocity.Magnitude - collisionDistance;
        const reflectedPos = pos.add(reflect.Unit.mul(leftoverDistance));

        return [reflectedVelocityNormal, reflectedPos];
    }

    Update(data: ParticleData, dt: number) {
        const result = this.CheckReflection(data, dt);
        if (result === undefined) return;

        const [reflectedVelocityNormal, reflectedPos] = result;

        data.velocityNormal = reflectedVelocityNormal;
        data.nextPos = reflectedPos;
    }

    GetNodeName(): string {
        return BounceName;
    }

    GetAutoGenerationCode(src: Src) {
        AutoGenBounce(this, src);
    }
}
