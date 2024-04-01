import { SetPosition } from "API/Nodes/Initialize/SetPosition";

export function AutoGenPosition(node: SetPosition) {
	const className = `Position${node.id}`;
	const varName = `position${node.id}`;

	let src = `local ${className} = TS.import(script, APIFolder, "Nodes", "Initialize", "Position").Position \n`;
	src += `local ${varName} = ${className}.new() \n`;

	if (node.nodeFields.position.xBindNode !== undefined) {
		src += "\n";
		src += node.nodeFields.position.xBindNode.GetAutoGenerationCode(
			`${varName}.nodeFields.position.BindValueX(..)`,
		);
		src += "\n";
	} else {
		src += `${varName}.nodeFields.position.SetValueX(${node.nodeFields.position.x}) \n`;
	}

	if (node.nodeFields.position.yBindNode !== undefined) {
		src += "\n";
		src += node.nodeFields.position.yBindNode.GetAutoGenerationCode(
			`${varName}.nodeFields.position.BindValueY(..)`,
		);
		src += "\n";
	} else {
		src += `${varName}.nodeFields.position.SetValueY(${node.nodeFields.position.y}) \n`;
	}

	if (node.nodeFields.position.zBindNode !== undefined) {
		src += "\n";
		src += node.nodeFields.position.zBindNode.GetAutoGenerationCode(
			`${varName}.nodeFields.position.BindValueZ(..)`,
		);
		src += "\n";
	} else {
		src += `${varName}.nodeFields.position.SetValueZ(${node.nodeFields.position.z}) \n`;
	}

	src += `nodeSystem:AddNode(${varName})`;
	return src;
}
