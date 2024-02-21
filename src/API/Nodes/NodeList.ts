import { NodeGroups } from "API/NodeGroup";
import { SelectionEntry } from "API/SelectionEntry";

export const NodeList: { [key in NodeGroups]: { [key: string]: SelectionEntry } } = {
	[NodeGroups.Spawn]: {
		ConstantSpawn: {
			name: "Constant Spawn",
		},
		BurstSpawn: {
			name: "Burst Spawn",
		},
	},
	[NodeGroups.Initialize]: {
		Lifetime: {
			name: "Lifetime",
		},
		Position: {
			name: "Position",
		},
	},
	[NodeGroups.Update]: {
		StaticForce: {
			name: "Static Force",
		},
	},
	[NodeGroups.Render]: {
		ParticlePlane: {
			name: "Plane",
		},
	},
	[NodeGroups.Logic]: {
		ValueRamp: {
			name: "Value Ramp",
		},
		RandomNumber: {
			name: "Random Number",
		},
		AliveTime: {
			name: "Alive time",
		},
	},
};
