import { SelectionEntry } from "API/SelectionEntry";
import { CreateBasicSystem } from "Components/Systems/CreateBasicSystem";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";

export const NodeSystems: { [key: string]: SelectionEntry } = {
	Empty: {
		name: "Empty",
		create: () => CreateEmptySystem(),
	},
	Basic: {
		name: "Basic",
		create: () => CreateBasicSystem(),
	},
};
