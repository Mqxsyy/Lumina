import type { NumberInput } from "API/Nodes/Logic/Number";

export function AutoGenNumberInput(node: NumberInput, wrapper: string) {
    const className = `NumberInput${node.id}`;
    const varName = `numberInput${node.id}`;

    let src = "\n";
    src += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "NumberInput").NumberInput \n`;
    src += `local ${varName} = ${className}.new() \n`;

    src += node.nodeFields.input.AutoGenerateField(`${varName}.nodeFields.input`);

    src += `${wrapper.gsub("%.%.", `${varName}.Calculate`)[0]}\n`;
    return src;
}
