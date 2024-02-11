import { Node } from "../Node";
import { INodeField } from "../../Fields/NodeField";
import { NodeGroups } from "../../NodeGroup";
import { NodeTypes } from "../NodeTypes";
import { RunService, Workspace } from "@rbxts/services";

export interface ParticleInitParams {
	lifetime: number;
	position: Vector3;
}

export type PositionUpdateFn = (position: Vector3) => Vector3;

export interface ParticleUpdateParams {
	position: PositionUpdateFn[];
}

export class ParticlePlane extends Node<[ParticleInitParams, ParticleUpdateParams]> {
	nodeGroup: NodeGroups = NodeGroups.Render;
	nodeType: NodeTypes = NodeTypes.ParticlePlane;
	nodeFields: INodeField[] = [];

	fn = (init: ParticleInitParams, update: ParticleUpdateParams) => {
		const part = new Instance("Part");

		part.Anchored = true;
		part.Size = new Vector3(1, 1, 0.01);

		part.CanCollide = false;
		part.CanTouch = false;
		part.CanQuery = false;

		part.Position = init.position;

		let aliveTime = 0;
		const connection = RunService.RenderStepped.Connect((dt) => {
			if (aliveTime >= init.lifetime) {
				connection.Disconnect();
				return;
			}

			update.position.forEach((fn) => {
				part.Position = fn(part.Position);
			});

			aliveTime += dt;
		});

		part.Parent = Workspace;

		return;
	};
}
