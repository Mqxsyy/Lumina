export interface SaveData {
    version: number;
    systems: SerializedSystem[];
    floatingNodes: SerializedFloatingNode[];
}

export interface SerializedSystem {
    anchorPoint: { x: number; y: number };
    systemName: string;
    groups: {
        spawn: SerializedNode[];
        initialize: SerializedNode[];
        update: SerializedNode[];
        render: SerializedNode[];
    };
}

export interface SerializedNode {
    connectionIds?: number[];
    nodeName: string;
    fields: SerializedField[];
}

export interface SerializedFloatingNode extends SerializedNode {
    nodeGroup: number;
    anchorPoint: { x: number; y: number };
}

export interface SerializedField {
    connectionId?: number;
    name: string;
    data: {};
}
