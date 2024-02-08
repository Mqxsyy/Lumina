import { TestNode } from "./TestNode";

interface NodeListEntry {
	name: string;
	node: NodeElement;
}

interface NodeList {
	[key: number]: {
		categoryName: string;
		nodes: NodeListEntry[];
	};
}

export const NodeCategories = {
	Debug: 0,
};

export const NodeList: NodeList = {
	[NodeCategories.Debug]: {
		categoryName: "Debug",
		nodes: [
			{
				name: "Text Node",
				node: TestNode,
			},
			// {
			// 	name: "Logger",
			// 	node: LogNode,
			// },
		],
	},
};
