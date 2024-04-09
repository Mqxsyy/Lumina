export interface SaveData {
	version: number;
	systems: SerializedSystem[];
}

export interface SerializedSystem {
	anchorPoint: { x: number; y: number };
	groups: {
		spawn: SerializedNode[];
		initialize: SerializedNode[];
		update: SerializedNode[];
		render: SerializedNode[];
		logic: SerializedNode[];
	};
}

export interface SerializedNode {
	nodeName: string;
	fields: SerializedField[];
}

export interface SerializedField {
	name: string;
	data: {};
}
