import { NodeGroups } from "API/NodeGroup";
import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";
import * as CreateBarrel from "./NodeListCreateBarrel";
import * as NameBarrel from "./NodeListNameBarrel";

export const NodeList: { [key in NodeGroups]: { [key: string]: SelectionEntry } } = {
    [NodeGroups.Spawn]: {
        [NameBarrel.ConstantSpawnName]: {
            name: "Constant Spawn",
            create: () => CreateBarrel.CreateConstantSpawn(),
        },
        [NameBarrel.BurstSpawnName]: {
            name: "Burst Spawn",
            create: () => CreateBarrel.CreateBurstSpawn(),
        },
    },
    [NodeGroups.Initialize]: {
        [NameBarrel.SetColorName]: {
            name: "Set Color",
            create: () => CreateBarrel.CreateSetColor(),
        },
        [NameBarrel.SetEmissionName]: {
            name: "Set Emission",
            create: () => CreateBarrel.CreateSetEmission(),
        },
        [NameBarrel.SetLifetimeName]: {
            name: "Set Lifetime",
            create: () => CreateBarrel.CreateSetLifetime(),
        },
        [NameBarrel.SetLifetimeRandomName]: {
            name: "Set Lifetime Random",
            create: () => CreateBarrel.CreateSetLifetimeRandom(),
        },
        [NameBarrel.SetPositionName]: {
            name: "Set Position",
            create: () => CreateBarrel.CreateSetPosition(),
        },
        [NameBarrel.SetRotationZName]: {
            name: "Set Rotation Z",
            create: () => CreateBarrel.CreateSetRotationZ(),
        },
        [NameBarrel.SetRotationZRandomName]: {
            name: "Set Rotation Z Random",
            create: () => CreateBarrel.CreateRotationZRandom(),
        },
        [NameBarrel.SetSizeName]: {
            name: "Set Size",
            create: () => CreateBarrel.CreateSetSize(),
        },
        [NameBarrel.SetSizeRandomName]: {
            name: "Set Size Random",
            create: () => CreateBarrel.CreateSetSizeRandom(),
        },
        [NameBarrel.SetTransparencyName]: {
            name: "Set Transparency",
            create: () => CreateBarrel.CreateSetTransparency(),
        },
        [NameBarrel.SetVelocityName]: {
            name: "Set Velocity",
            create: () => CreateBarrel.CreateSetVelocity(),
        },
        [NameBarrel.SetVelocityRandomName]: {
            name: "Set Velocity Random",
            create: () => CreateBarrel.CreateSetVelocityRandom(),
        },
    },
    [NodeGroups.Update]: {
        [NameBarrel.AddRotationZName]: {
            name: "Add Rotation Z",
            create: () => CreateBarrel.CreateAddRotationZ(),
        },
        [NameBarrel.AddRotationZRandomName]: {
            name: "Add Rotation Z Random",
            create: () => CreateBarrel.CreateAddRotationZRandom(),
        },
        [NameBarrel.DragName]: {
            name: "Drag",
            create: () => CreateBarrel.CreateDrag(),
        },
        [NameBarrel.MultiplySizeOverLifeName]: {
            name: "Multiply Size Over Life",
            create: () => CreateBarrel.CreateMultiplySizeOverLife(),
        },
        [NameBarrel.SetColorOverLifeName]: {
            name: "Set Color Over Life",
            create: () => CreateBarrel.CreateSetColorOverLife(),
        },
        [NameBarrel.SetSizeOverLifeName]: {
            name: "Set Size Over Life",
            create: () => CreateBarrel.CreateSetSizeOverLife(),
        },
        [NameBarrel.SetTransparencyOverLifeName]: {
            name: "Set Transparency Over Life",
            create: () => CreateBarrel.CreateSetTransparencyOverLife(),
        },
        [NameBarrel.AccelerateName]: {
            name: "Accelerate",
            create: () => CreateBarrel.CreateAccelerate(),
        },
        [NameBarrel.AddVelocityName]: {
            name: "Add Velocity",
            create: () => CreateBarrel.CreateAddVelocity(),
        },
    },
    [NodeGroups.Render]: {
        [NameBarrel.ParticlePlaneName]: {
            name: "Plane",
            create: () => CreateBarrel.CreateParticlePlane(),
        },
    },
    [NodeGroups.Logic]: {
        [NameBarrel.RandomNumberName]: {
            name: "Random Number",
            create: () => CreateBarrel.CreateRandomNumber(),
        },
    },
};
