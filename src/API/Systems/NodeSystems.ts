import { SelectionEntry } from "API/SelectionEntry";
import { CreateEmptySystem } from "Components/System/CreateEmptySystem";

export const NodeSystems: { [key: string]: SelectionEntry } = {
	Simple: {
		name: "Simple",
		create: () => CreateEmptySystem(),
	},
};
