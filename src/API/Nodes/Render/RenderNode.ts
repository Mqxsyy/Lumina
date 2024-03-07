import { Node } from "../Node";

// export type PositionUpdateFn = (id: number, position: Vector3) => Vector3;

export interface ParticleInitParams {
	id: number;
	lifetime: number;
}

// export interface ParticleUpdateParams {
// 	position?: PositionUpdateFn[];
// 	aliveNodes?: LogicNode[];
// }

export abstract class RenderNode extends Node {
	abstract Render: (init: ParticleInitParams) => void;
	abstract Destroy(): void;
}
