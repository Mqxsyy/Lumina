import { NodeGroups } from "API/NodeGroup";
import { SelectionEntry } from "API/SelectionEntry";
import { CreateLifetimeNode } from "Components/Nodes/Initialize/Lifetime";
import { CreatePositionNode } from "Components/Nodes/Initialize/Position";
import { CreateRandomNumberNode } from "Components/Nodes/Logic/RandomNumber";
import { CreateParticlePlaneNode } from "Components/Nodes/Render/ParticlePlane";
import { CreateConstantSpawnNode } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateStaticForceNode } from "Components/Nodes/Update/StaticForce";

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
		Lifetime: {
			name: "Lifetime",
			create: () => CreateLifetimeNode(),
		},
		Position: {
			name: "Position",
			create: () => CreatePositionNode(),
		},
	},
	[NodeGroups.Update]: {
		StaticForce: {
			name: "Static Force",
			create: () => CreateStaticForceNode(),
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
		AliveTime: {
			name: "Alive time",
		},
	},
};
