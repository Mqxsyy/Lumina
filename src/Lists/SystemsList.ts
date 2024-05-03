import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";
import { CreateBasicSystem } from "Components/Systems/CreateBasicSystem";
import { CreateBurstSystem } from "Components/Systems/CreateBurstSystem";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";
import { CreateFlameSystem } from "Components/Systems/CreateFlame";

export const NodeSystems: { [key: string]: SelectionEntry } = {
    Empty: {
        name: "Create Empty",
        create: () => CreateEmptySystem(),
    },
    Basic: {
        name: "Create Basic",
        create: () => CreateBasicSystem(),
    },
    Burst: {
        name: "Create Burst",
        create: () => CreateBurstSystem(),
    },
    Flame: {
        name: "Create Flame",
        create: () => CreateFlameSystem(),
    },
};
