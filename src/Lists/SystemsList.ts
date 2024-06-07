import type { Entry } from "API/Nodes/SelectionEntry";
import { CreateBasicSystem } from "Components/Systems/CreateBasicSystem";
import { CreateBurstSystem } from "Components/Systems/CreateBurstSystem";
import { CreateEmptySystem } from "Components/Systems/CreateEmptySystem";
import { CreateFlameSystem } from "Components/Systems/CreateFlame";

export const NodeSystems: Entry[] = [
    {
        name: "Create Empty",
        create: () => CreateEmptySystem(),
    },
    {
        name: "Create Basic",
        create: () => CreateBasicSystem(),
    },
    {
        name: "Create Burst",
        create: () => CreateBurstSystem(),
    },
    {
        name: "Create Flame",
        create: () => CreateFlameSystem(),
    },
];
