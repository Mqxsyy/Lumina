import { NodeFields } from "API/Fields/NodeFields";
import { NodeGroups } from "../NodeGroup";
import { NodeIdPool } from "./NodeIdPool";

export interface ParticleInitData {
	lifetime?: number;
	spawnPosition?: Vector3;
}

export abstract class Node {
	id: number;

	abstract nodeGroup: NodeGroups;
	abstract nodeFields: { [key: string]: NodeFields };
	connectedSystemId?: number;

	constructor() {
		this.id = NodeIdPool.GetNextId();
	}

	ConnectToSystem(systemId: number) {
		this.connectedSystemId = systemId;
	}

	RemoveSystemConnection() {
		this.connectedSystemId = undefined;
	}

	abstract GetNodeName(): string;
	abstract GetAutoGenerationCode(wrapper?: string): string;
}
