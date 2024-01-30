import { BlankNode } from "./BlankNode";

interface NodeListEntry {
	name: string;
	node: NodeElement;
}

interface NodeList {
	[key: number]: {
		categoryName: string;
		nodes: [NodeListEntry];
	};
}

export const NodeCategories = {
	Basic: 0,
};

export const NodeList: NodeList = {
	[NodeCategories.Basic]: {
		categoryName: "Basic",
		nodes: [
			{
				name: "Blank Node",
				node: BlankNode,
			},
		],
	},
};
