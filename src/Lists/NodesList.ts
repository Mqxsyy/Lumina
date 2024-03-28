import { NodeGroups } from "API/NodeGroup";
import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";
import { CreateLifetimeNode } from "Components/Nodes/Initialize/Lifetime";
import { CreatePositionNode } from "Components/Nodes/Initialize/Position";
import { CreateSetTransparencyNode } from "Components/Nodes/Initialize/SetTransparency";
import { CreateRandomNumberNode } from "Components/Nodes/Logic/RandomNumber";
import { CreateParticlePlaneNode } from "Components/Nodes/Render/ParticlePlane";
import { CreateConstantSpawnNode } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateColorOverLife } from "Components/Nodes/Update/ColorOverLife";
import { CreateStaticForceNode } from "Components/Nodes/Update/StaticForce";
import { CreateTransparencyOverLife } from "Components/Nodes/Update/TransparencyOverLife";

export const NodeList: { [key in NodeGroups]: { [key: string]: SelectionEntry } } = {
	[NodeGroups.Spawn]: {
		ConstantSpawn: {
			name: "Constant Spawn",
			create: () => CreateConstantSpawnNode(),
		},
		BurstSpawn: {
			name: "Burst Spawn",
		},
	},
	[NodeGroups.Initialize]: {
		Position: {
			name: "Position",
			create: () => CreatePositionNode(),
		},
		Lifetime: {
			name: "Lifetime",
			create: () => CreateLifetimeNode(),
		},
		SetTranspaarency: {
			name: "Set Transparency",
			create: () => CreateSetTransparencyNode(),
		},
	},
	[NodeGroups.Update]: {
		StaticForce: {
			name: "Static Force",
			create: () => CreateStaticForceNode(),
		},
		TransparencyOverLife: {
			name: "Transparency Over Life",
			create: () => CreateTransparencyOverLife(),
		},
		ColorOverLife: {
			name: "Color Over Life",
			create: () => CreateColorOverLife(),
		},
	},
	[NodeGroups.Render]: {
		ParticlePlane: {
			name: "Plane",
			create: () => CreateParticlePlaneNode(),
		},
	},
	[NodeGroups.Logic]: {
		ValueRamp: {
			name: "Value Ramp",
		},
		RandomNumber: {
			name: "Random Number",
			create: () => CreateRandomNumberNode(),
		},
	},
};
