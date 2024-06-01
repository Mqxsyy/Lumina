import { NodeGroups } from "API/NodeGroup";
import type { SelectionEntry } from "API/Nodes/SelectionEntry";
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
        [NameBarrel.SetPositionName]: {
            name: "Set Position",
            create: () => CreateBarrel.CreateSetPosition(),
        },
        [NameBarrel.AddPositionName]: {
            name: "Add Position",
            create: () => CreateBarrel.CreateAddPosition(),
        },
        [NameBarrel.SetPositionToParentName]: {
            name: "Set Position To Parent",
            create: () => CreateBarrel.CreateSetPositionToParent(),
        },
        [NameBarrel.AddPositionFromShapeName]: {
            name: "Add Position From Shape",
            create: () => CreateBarrel.CreateAddPositionFromShape(),
        },
        [NameBarrel.SetRotationName]: {
            name: "Set Rotation",
            create: () => CreateBarrel.CreateSetRotation(),
        },
        [NameBarrel.SetSizeName]: {
            name: "Set Size",
            create: () => CreateBarrel.CreateSetSize(),
        },
        [NameBarrel.SetTransparencyName]: {
            name: "Set Transparency",
            create: () => CreateBarrel.CreateSetTransparency(),
        },
        [NameBarrel.SetVelocityName]: {
            name: "Set Velocity",
            create: () => CreateBarrel.CreateSetVelocity(),
        },
        [NameBarrel.DirectVelocityName]: {
            name: "Direct Velocity",
            create: () => CreateBarrel.CreateDirectVelocity(),
        },
    },
    [NodeGroups.Update]: {
        [NameBarrel.AddRotationName]: {
            name: "Add Rotation",
            create: () => CreateBarrel.CreateAddRotation(),
        },
        [NameBarrel.BounceName]: {
            name: "Bounce",
            create: () => CreateBarrel.CreateBounce(),
        },
        [NameBarrel.DragName]: {
            name: "Drag",
            create: () => CreateBarrel.CreateDrag(),
        },
        [NameBarrel.MultiplyVelocityOverLifeName]: {
            name: "Multiply Velocity Over Life",
            create: () => CreateBarrel.CreateMultiplyVelocityOverLife(),
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
        [NameBarrel.MoveTowardsName]: {
            name: "Move Towards",
            create: () => CreateBarrel.CreateMoveTowards(),
        },
    },
    [NodeGroups.Render]: {
        [NameBarrel.PlaneParticleName]: {
            name: "Plane Particle",
            create: () => CreateBarrel.CreatePlaneParticle(),
        },
        [NameBarrel.VolumetricParticleName]: {
            name: "Volumetric Particle",
            create: () => CreateBarrel.CreateVolumetricParticle(),
        },
        [NameBarrel.MeshParticleName]: {
            name: "Mesh Particle",
            create: () => CreateBarrel.CreateMeshParticle(),
        },
    },
    [NodeGroups.Logic]: {
        [NameBarrel.ValueOutName]: {
            name: "Value Out",
            create: () => CreateBarrel.CreateValueOut(),
        },
        [NameBarrel.BasicMathOperationName]: {
            name: "Basic Math Operation",
            create: () => CreateBarrel.CreateBasicMathOperation(),
        },
        [NameBarrel.TrigonometryName]: {
            name: "Trigonometry",
            create: () => CreateBarrel.CreateTrigonometry(),
        },
        [NameBarrel.ClampName]: {
            name: "Clamp",
            create: () => CreateBarrel.CreateClamp(),
        },
        [NameBarrel.RemapName]: {
            name: "Remap",
            create: () => CreateBarrel.CreateRemap(),
        },
        [NameBarrel.RandomNumberName]: {
            name: "Random Number",
            create: () => CreateBarrel.CreateRandomNumber(),
        },
        [NameBarrel.TimeName]: {
            name: "Time",
            create: () => CreateBarrel.CreateTime(),
        },
        [NameBarrel.AliveTimeName]: {
            name: "Alive Time",
            create: () => CreateBarrel.CreateAliveTime(),
        },
    },
};
