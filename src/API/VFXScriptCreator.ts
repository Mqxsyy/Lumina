import { GetAllSystems } from "Services/NodeSystemService";
import type { NodeSystem } from "./NodeSystem";
import type { RenderNode } from "./Nodes/Render/RenderNode";
import type { SpawnNode } from "./Nodes/Spawn/SpawnNode";

export interface Src {
    value: string;
}

export default function ExportAsScript() {
    const convertedFiles: ModuleScript[] = [];

    for (const system of GetAllSystems()) {
        let passedChecks = true;

        if (system.data.system.spawnNode === undefined) {
            warn(`${system.data.systemName} is missing a spawn node.`);
            passedChecks = false;
        }

        if (system.data.system.renderNode === undefined) {
            warn(`${system.data.systemName} is missing a render node.`);
            passedChecks = false;
        }

        if (!passedChecks) continue;

        const convertedFile = CreateScript(tostring(system.data.id), system.data.system);
        convertedFile.Name = tostring(system.data.systemName);
        convertedFiles.push(convertedFile);
    }

    return convertedFiles;
}

function CreateScript(name: string, nodeSystem: NodeSystem) {
    const newScript = new Instance("ModuleScript");
    newScript.Name = name;

    const src = { value: "" };

    src.value += "--[[\n";
    src.value += "    Auto generated script.\n";
    src.value += "    Call .Start() to run the VFX.\n";
    src.value += "    Call .Stop() to stop the VFX.\n";
    src.value += "]]\n\n";

    src.value += "local VFXScript = {}\n\n";

    src.value += 'local ReplicatedStorage = game:GetService("ReplicatedStorage")\n';
    src.value += "local APIFolder = ReplicatedStorage.Lumina_API.API\n";
    src.value += "local TS = require(ReplicatedStorage.Lumina_API.include.RuntimeLib)\n\n";

    src.value += 'local NodeSystem = TS.import(script, APIFolder, "NodeSystem").NodeSystem\n';
    src.value += "local nodeSystem = NodeSystem.new()\n\n";

    (nodeSystem.spawnNode as SpawnNode).GetAutoGenerationCode(src);
    src.value += "\n\n";

    for (const node of nodeSystem.initializeNodes) {
        node.GetAutoGenerationCode(src);
        src.value += "\n\n";
    }

    for (const node of nodeSystem.updateNodes) {
        node.GetAutoGenerationCode(src);
        src.value += "\n\n";
    }

    (nodeSystem.renderNode as RenderNode).GetAutoGenerationCode(src);
    src.value += "\n\n";

    src.value += "function VFXScript.Start()\n";
    src.value += "    nodeSystem:Run()\n";
    src.value += "end\n\n";

    src.value += "function VFXScript.Stop()\n";
    src.value += "    nodeSystem:Stop()\n";
    src.value += "end\n\n";

    src.value += "return VFXScript";

    newScript.Source = src.value;
    return newScript;
}
