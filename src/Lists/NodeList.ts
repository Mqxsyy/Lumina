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
        [NameBarrel.SetLifetimeRandomName]: {
            name: "Set Lifetime Random",
            create: () => CreateBarrel.CreateSetLifetimeRandom(),
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
        [NameBarrel.SetRotationXYZName]: {
            name: "Set Rotation XYZ",
            create: () => CreateBarrel.CreateSetRotationXYZ(),
        },
        [NameBarrel.SetRotationZName]: {
            name: "Set Rotation Z",
            create: () => CreateBarrel.CreateSetRotationZ(),
        },
        [NameBarrel.SetRotationZRandomName]: {
            name: "Set Rotation Z Random",
            create: () => CreateBarrel.CreateSetRotationZ(),
        },
        [NameBarrel.SetSizeName]: {
            name: "Set Size",
            create: () => CreateBarrel.CreateSetSize(),
        },
        [NameBarrel.SetSizeRandomName]: {
            name: "Set Size Random",
            create: () => CreateBarrel.CreateSetSizeRandom(),
        },
        [NameBarrel.SetSizeXYZName]: {
            name: "Set Size XYZ",
            create: () => CreateBarrel.CreateSetSizeXYZ(),
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
        [NameBarrel.DirectVelocityName]: {
            name: "Direct Velocity",
            create: () => CreateBarrel.CreateDirectVelocity(),
        },
    },
    [NodeGroups.Update]: {
        [NameBarrel.AddRotationXYZName]: {
            name: "Add Rotation XYZ",
            create: () => CreateBarrel.CreateAddRotationXYZ(),
        },
        [NameBarrel.AddRotationXYZRandomName]: {
            name: "Add Rotation XYZ Random",
            create: () => CreateBarrel.CreateAddRotationXYZRandom(),
        },
        [NameBarrel.AddRotationZName]: {
            name: "Add Rotation Z",
            create: () => CreateBarrel.CreateAddRotationZ(),
        },
        [NameBarrel.AddRotationZRandomName]: {
            name: "Add Rotation Z Random",
            create: () => CreateBarrel.CreateAddRotationZRandom(),
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
        [NameBarrel.NumberInputName]: {
            name: "Number Out",
            create: () => CreateBarrel.CreateNumberInput(),
        },
        [NameBarrel.AddName]: {
            name: "Add",
            create: () => CreateBarrel.CreateAdd(),
        },
        [NameBarrel.SubtractName]: {
            name: "Subtract",
            create: () => CreateBarrel.CreateSubtract(),
        },
        [NameBarrel.MultiplyName]: {
            name: "Multiply",
            create: () => CreateBarrel.CreateMultiply(),
        },
        [NameBarrel.DivideName]: {
            name: "Divide",
            create: () => CreateBarrel.CreateDivide(),
        },
        [NameBarrel.SinName]: {
            name: "Sin",
            create: () => CreateBarrel.CreateSin(),
        },
        [NameBarrel.CosName]: {
            name: "Cos",
            create: () => CreateBarrel.CreateCos(),
        },
        [NameBarrel.TanName]: {
            name: "Tan",
            create: () => CreateBarrel.CreateTan(),
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
