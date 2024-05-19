import { GetAllSystems } from "Services/NodeSystemService";
import type { NodeSystem } from "./NodeSystem";
import type { RenderNode } from "./Nodes/Render/RenderNode";
import type { SpawnNode } from "./Nodes/Spawn/SpawnNode";

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

    let src = "";
    src += "--[[\n";
    src += "    Auto generated script.\n";
    src += "    Call .Start() to run the VFX.\n";
    src += "    Call .Stop() to stop the VFX.\n";
    src += "]]\n\n";

    src += "local VFXScript = {}\n\n";

    src += 'local ReplicatedStorage = game:GetService("ReplicatedStorage")\n';
    src += "local APIFolder = ReplicatedStorage.Lumina_API.API\n";
    src += "local TS = require(ReplicatedStorage.Lumina_API.include.RuntimeLib)\n\n";

    src += 'local NodeSystem = TS.import(script, APIFolder, "NodeSystem").NodeSystem\n';
    src += "local nodeSystem = NodeSystem.new()\n\n";

    src += (nodeSystem.spawnNode as SpawnNode).GetAutoGenerationCode();
    src += "\n\n";

    for (const node of nodeSystem.initializeNodes) {
        src += node.GetAutoGenerationCode();
        src += "\n\n";
    }

    for (const node of nodeSystem.updateNodes) {
        src += node.GetAutoGenerationCode();
        src += "\n\n";
    }

    src += (nodeSystem.renderNode as RenderNode).GetAutoGenerationCode();
    src += "\n\n";

    src += "function VFXScript.Start()\n";
    src += "    nodeSystem:Run()\n";
    src += "end\n\n";

    src += "function VFXScript.Stop()\n";
    src += "    nodeSystem:Stop()\n";
    src += "end\n\n";

    src += "return VFXScript";

    newScript.Source = src;
    return newScript;
}
