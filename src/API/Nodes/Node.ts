import type { NodeField } from "API/Fields/NodeField";
import { LowerFirstLetter } from "API/Lib";
import type { Src } from "API/VFXScriptCreator";
import { NodeGroups } from "../NodeGroup";
import { AutoGenAddToSystem, AutoGenImport } from "./AutoGenLib";
import { NodeIdPool } from "./NodeIdPool";

export enum UpdatePrioriy {
    First = 1,
    Default = 2,
    Last = 3,
}

export abstract class Node {
    id: number;

    updatePriority = UpdatePrioriy.Default;
    updateOrder = -1;

    abstract nodeFields: { [key: string]: NodeField };
    connectedSystemId?: number;

    constructor() {
        this.id = NodeIdPool.GetNextId();
    }

    ConnectToSystem(systemId: number) {
        this.connectedSystemId = systemId;
    }

    RemoveSystemConnection() {
        this.connectedSystemId = undefined;
    }

    abstract GetClassName(): string;
    abstract GetNodeGroups(): NodeGroups[];

    GetAutoGenerationCode(src: Src, wrapper?: string) {
        if (this.GetNodeGroups().findIndex((g) => g === NodeGroups.Logic) === -1 && wrapper !== undefined) {
            const nodeName = this.GetClassName();

            const className = `${nodeName}${this.id}`;
            const varName = `${LowerFirstLetter(nodeName)}${this.id}`;

            if (string.match(src.value, className)[0] === undefined) {
                src.value += `local ${className} = TS.import(script, APIFolder, "Nodes", "Logic", "${nodeName}").${nodeName} \n`;
                src.value += `local ${varName} = ${className}.new() \n\n`;

                for (const [fieldName, fieldValue] of pairs(this.nodeFields)) {
                    fieldValue.AutoGenerateField(`${varName}.nodeFields.${fieldName}`, src);
                }

                src.value += "\n";
            }

            src.value += `${wrapper.gsub("%.%.", `${varName}`)[0]}\n`;
            return;
        }

        const varName = AutoGenImport(this, src);

        for (const [fieldName, fieldValue] of pairs(this.nodeFields)) {
            fieldValue.AutoGenerateField(`${varName}.nodeFields.${fieldName}`, src);
        }

        AutoGenAddToSystem(varName, src);
    }
}
