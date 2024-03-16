import { StaticForce } from "API/Nodes/Update/StaticForce";

export function AutoGenStaticForce(node: StaticForce) {
	const className = `StaticForce${node.id}`;
	const varName = `staticForce${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Update", "StaticForce").StaticForce \n`;
	src += `local ${varName} = ${className}.new() \n`;

	if (node.nodeFields.direction.xBindNode !== undefined) {
		src += "\n";
		src += node.nodeFields.direction.xBindNode.GetAutoGenerationCode(
			`${varName}.nodeFields.direction.BindValueX(..)`,
		);
		src += "\n";
	} else {
		src += `${varName}.nodeFields.direction.SetValueX(${node.nodeFields.direction.x}) \n`;
	}

	if (node.nodeFields.direction.yBindNode !== undefined) {
		src += "\n";
		src += node.nodeFields.direction.yBindNode.GetAutoGenerationCode(
			`${varName}.nodeFields.direction.BindValueY(..)`,
		);
		src += "\n";
	} else {
		src += `${varName}.nodeFields.direction.SetValueY(${node.nodeFields.direction.y}) \n`;
	}

	if (node.nodeFields.direction.zBindNode !== undefined) {
		src += "\n";
		src += node.nodeFields.direction.zBindNode.GetAutoGenerationCode(
			`${varName}.nodeFields.direction.BindValueZ(..)`,
		);
		src += "\n";
	} else {
		src += `${varName}.nodeFields.direction.SetValueZ(${node.nodeFields.direction.z}) \n`;
	}

	src += `nodeSystem:AddNode(${varName})`;
	return src;
}
