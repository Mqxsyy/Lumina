import { NodeGroups } from "API/NodeGroup";
import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";
import * as Barrel from "./NodesListNodeBarrel";

export const NodeList: { [key in NodeGroups]: { [key: string]: SelectionEntry } } = {
	[NodeGroups.Spawn]: {
		ConstantSpawn: {
			name: "Constant Spawn",
			create: () => Barrel.CreateConstantSpawnNode(),
		},
		BurstSpawn: {
			name: "Burst Spawn",
		},
	},
	[NodeGroups.Initialize]: {
		Position: {
			name: "Position",
			create: () => Barrel.CreatePositionNode(),
		},
		Lifetime: {
			name: "Lifetime",
			create: () => Barrel.CreateLifetimeNode(),
		},
		SetSize: {
			name: "Set Size",
			create: () => Barrel.CreateSetSizeNode(),
		},
		SetColor: {
			name: "Set Color",
			create: () => Barrel.CreateSetColorNode(),
		},
		SetTranspaarency: {
			name: "Set Transparency",
			create: () => Barrel.CreateSetTransparencyNode(),
		},
	},
	[NodeGroups.Update]: {
		StaticForce: {
			name: "Static Force",
			create: () => Barrel.CreateStaticForceNode(),
		},
		TransparencyOverLife: {
			name: "Transparency Over Life",
			create: () => Barrel.CreateTransparencyOverLife(),
		},
		ColorOverLife: {
			name: "Color Over Life",
			create: () => Barrel.CreateColorOverLife(),
		},
	},
	[NodeGroups.Render]: {
		ParticlePlane: {
			name: "Plane",
			create: () => Barrel.CreateParticlePlaneNode(),
		},
	},
	[NodeGroups.Logic]: {
		ValueRamp: {
			name: "Value Ramp",
		},
		RandomNumber: {
			name: "Random Number",
			create: () => Barrel.CreateRandomNumberNode(),
		},
	},
};
