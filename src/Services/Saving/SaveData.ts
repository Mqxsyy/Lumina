export interface SaveData {
	version: number;
	systems: SerializedSystem[];
	logicNodes: SerializedLogicNode[];
}

export interface SerializedSystem {
	anchorPoint: { x: number; y: number };
	groups: {
		spawn: SerializedNode[];
		initialize: SerializedNode[];
		update: SerializedNode[];
		render: SerializedNode[];
	};
}

export interface SerializedNode {
	nodeName: string;
	fields: SerializedField[];
}

export interface SerializedLogicNode extends SerializedNode {
	anchorPoint: { x: number; y: number };
}

export interface SerializedField {
	name: string;
	data: {};
}
