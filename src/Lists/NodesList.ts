import { NodeGroups } from "API/NodeGroup";
import * as Barrel from "./NodesListNodeBarrel";
import { ConstantSpawnName } from "API/Nodes/Spawn/ConstantSpawn";
import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";

export const NodeList: { [key in NodeGroups]: { [key: string]: SelectionEntry } } = {
	[NodeGroups.Spawn]: {
		[ConstantSpawnName]: {
			name: "Constant Spawn",
			create: () => Barrel.CreateConstantSpawn(),
		},
	},
	[NodeGroups.Initialize]: {
		SetColor: {
			name: "Set Color",
			create: () => Barrel.CreateSetColor(),
		},
		SetEmission: {
			name: "Set Emission",
			create: () => Barrel.CreateSetEmission(),
		},
		SetLifetime: {
			name: "Set Lifetime",
			create: () => Barrel.CreateSetLifetime(),
		},
		SetLifetimeRandom: {
			name: "Set Lifetime Random",
			create: () => Barrel.CreateSetLifetimeRandom(),
		},
		SetPosition: {
			name: "Set Position",
			create: () => Barrel.CreateSetPosition(),
		},
		SetRotationZ: {
			name: "Set Rotation Z",
			create: () => Barrel.CreateSetRotationZ(),
		},
		SetRotationZRandom: {
			name: "Set Rotation Z Random",
			create: () => Barrel.CreateRotationZRandom(),
		},
		SetSize: {
			name: "Set Size",
			create: () => Barrel.CreateSetSize(),
		},
		SetSizeRandom: {
			name: "Set Size Random",
			create: () => Barrel.CreateSetSizeRandom(),
		},
		SetTransparency: {
			name: "Set Transparency",
			create: () => Barrel.CreateSetTransparency(),
		},
		SetVelocity: {
			name: "Set Velocity",
			create: () => Barrel.CreateSetVelocity(),
		},
		SetVelocityRandom: {
			name: "Set Velocity Random",
			create: () => Barrel.CreateSetVelocityRandom(),
		},
	},
	[NodeGroups.Update]: {
		AddRotationZ: {
			name: "Add Rotation Z",
			create: () => Barrel.CreateAddRotationZ(),
		},
		AddRotationZRandom: {
			name: "Add Rotation Z Random",
			create: () => Barrel.CreateAddRotationZRandom(),
		},
		Drag: {
			name: "Set Drag",
			create: () => Barrel.CreateDrag(),
		},
		MultiplySizeOverLife: {
			name: "Multiply Size Over Life",
			create: () => Barrel.CreateMultiplySizeOverLife(),
		},
		SetColorOverLife: {
			name: "Set Color Over Life",
			create: () => Barrel.CreateSetColorOverLife(),
		},
		SetSizeOverLife: {
			name: "Set Size Over Life",
			create: () => Barrel.CreateSetSizeOverLife(),
		},
		SetTransparencyOverLife: {
			name: "Set Transparency Over Life",
			create: () => Barrel.CreateSetTransparencyOverLife(),
		},
	},
	[NodeGroups.Render]: {
		ParticlePlane: {
			name: "Plane",
			create: () => Barrel.CreateParticlePlane(),
		},
	},
	[NodeGroups.Logic]: {
		RandomNumber: {
			name: "Random Number",
			create: () => Barrel.CreateRandomNumber(),
		},
	},
};
