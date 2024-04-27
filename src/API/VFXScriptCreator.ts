import { GetAllSystems } from "Services/NodeSystemService";
import { GetExportsFolder } from "./FolderLocations";
import { NodeSystem } from "./NodeSystem";

export default function ExportAsScript() {
	const convertedFiles: ModuleScript[] = [];

	GetAllSystems().forEach((nodeSystem) => {
		convertedFiles.push(CreateScript(tostring(nodeSystem.data.id), nodeSystem.data.system));
	});

	return convertedFiles;
}

function CreateScript(name: string, nodeSystem: NodeSystem) {
	const exportFolder = GetExportsFolder();

	const oldVFXScript = exportFolder.FindFirstChild(name);
	if (oldVFXScript !== undefined) oldVFXScript.Destroy();

	const newScript = new Instance("ModuleScript");
	newScript.Parent = exportFolder;
	newScript.Name = name;

	let src = `
--[[
    Auto generated script.
    Call .Start() to run the VFX.
]]

local VFXScript = {}

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local APIFolder = ReplicatedStorage.CrescentVFX_API.API
local TS = require(ReplicatedStorage.CrescentVFX_API.include.RuntimeLib)

local NodeSystem = TS.import(script, APIFolder, "NodeSystem").NodeSystem
local nodeSystem = NodeSystem.new()`;

	src += "\n\n";

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

	src += `
function VFXScript.Start()
    nodeSystem:Run()
end

function VFXScript.Stop()
    nodeSystem:Stop()
end

return VFXScript`;

	newScript.Source = src;
	return newScript;
}
