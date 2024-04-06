import { ParticlePlane } from "API/Nodes/Render/ParticlePlane";

export function AutogenParticlePlane(node: ParticlePlane) {
	const className = `Lifetime${node.id}`;
	const varName = `lifetime${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Render", "ParticlePlane").ParticlePlane \n`;
	src += `local ${varName} = ${className}.new() \n`;

	src += `${varName}.nodeFields.orientation.SetOrientation(${node.nodeFields.orientation.GetOrientation()}) \n`;
	src += `nodeSystem:AddNode(${varName})`;

	return src;
}
