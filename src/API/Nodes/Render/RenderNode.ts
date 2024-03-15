import { Node } from "../Node";
import { UpdateNode } from "../Update/UpdateNode";

export type PositionUpdateFn = (id: number, position: Vector3) => Vector3;

export interface ParticleInitParams {
	id: number;
	lifetime: number;
	position?: Vector3;
}

export interface ParticleUpdateParams {
	position?: UpdateNode[];
}

export abstract class RenderNode extends Node {
	abstract Render: (init: ParticleInitParams, update: ParticleUpdateParams) => void;
	abstract Destroy(): void;
}
