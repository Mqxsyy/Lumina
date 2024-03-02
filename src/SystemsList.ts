import { SelectionEntry } from "API/SelectionEntry";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";

export const NodeSystems: { [key: string]: SelectionEntry } = {
	Simple: {
		name: "Empty",
		create: () => CreateEmptySystem(),
	},
};
