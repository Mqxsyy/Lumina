import { GetAllSystems } from "Services/NodeSystemService";
import { NodeSystem } from "./NodeSystem";

export default function ExportAsScript() {
    const convertedFiles: ModuleScript[] = [];

    GetAllSystems().forEach((nodeSystem) => {
        const convertedFile = CreateScript(tostring(nodeSystem.data.id), nodeSystem.data.system);
        convertedFile.Name = tostring(nodeSystem.data.systemName);
        convertedFiles.push(convertedFile);
    });

    return convertedFiles;
}

function CreateScript(name: string, nodeSystem: NodeSystem) {
    // const oldVFXScript = exportFolder.FindFirstChild(name);
    // if (oldVFXScript !== undefined) oldVFXScript.Destroy();

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

    src += nodeSystem.spawnNode!.GetAutoGenerationCode();
    src += "\n\n";

    nodeSystem.initializeNodes.forEach((node) => {
        src += node.GetAutoGenerationCode();
        src += "\n\n";
    });

    nodeSystem.updateNodes.forEach((node) => {
        src += node.GetAutoGenerationCode();
        src += "\n\n";
    });

    src += nodeSystem.renderNode!.GetAutoGenerationCode();
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
