export interface SaveData {
	version: number;
	systems: SerializedSystem[];
	floatingNodes: SerializedFloatingNode[];
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

export interface SerializedFloatingNode extends SerializedNode {
	nodeGroup: number;
	anchorPoint: { x: number; y: number };
}

export interface SerializedField {
	name: string;
	data: {};
}
