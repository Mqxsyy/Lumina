import { NodeFields } from "API/Fields/NodeFields";
import { NodeGroups } from "../NodeGroup";
import { NodeIdPool } from "./NodeIdPool";
import { NodeTypes } from "./NodeTypes";

export interface ParticleInitData {
	lifetime?: number;
	spawnPosition?: Vector3;
}

export abstract class Node {
	id: number;

	abstract nodeGroup: NodeGroups;
	abstract nodeType: NodeTypes;
	abstract nodeFields: { [key: string]: NodeFields };

	constructor() {
		this.id = NodeIdPool.GetNextId();
	}

	abstract GetAutoGenerationCode(wrapper?: string): string;
}
