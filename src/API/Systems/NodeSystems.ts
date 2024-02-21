import { SelectionEntry } from "API/SelectionEntry";
import { CreateEmptySystem } from "Components/NodeSystem";

export const NodeSystems: { [key: string]: SelectionEntry } = {
	Simple: {
		name: "Simple",
		create: () => CreateEmptySystem(),
	},
};
