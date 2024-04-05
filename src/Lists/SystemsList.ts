import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";
import { CreateBasicSystem } from "Components/Systems/CreateBasicSystem";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";

export const NodeSystems: { [key: string]: SelectionEntry } = {
	Empty: {
		name: "Create Empty",
		create: () => CreateEmptySystem(),
	},
	Basic: {
		name: "Create Basic",
		create: () => CreateBasicSystem(),
	},
};
