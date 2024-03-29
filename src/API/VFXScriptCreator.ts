import { Workspace } from "@rbxts/services";
import { NodeSystem } from "./NodeSystem";
import { GetNodeSystems } from "Services/NodeSystemService";

let VFXExportFolder = Workspace.FindFirstChild("VFXExportFolder");

if (VFXExportFolder === undefined) {
	VFXExportFolder = new Instance("Folder");
	VFXExportFolder.Name = "VFXExportFolder";
	VFXExportFolder.Parent = game.Workspace;
}

export default function ExportAsScript() {
	GetNodeSystems().forEach((nodeSystem) => {
		CreateScript(tostring(nodeSystem.data.id), nodeSystem.data.system);
	});
}

function CreateScript(name: string, nodeSystem: NodeSystem) {
	const oldVFXScript = VFXExportFolder!.FindFirstChild(name);
	if (oldVFXScript !== undefined) oldVFXScript.Destroy();

	const newScript = new Instance("ModuleScript");
	newScript.Parent = VFXExportFolder;
	newScript.Name = name;

	let src = `
--[[
    Auto generated script.
    Call .Start() to run the VFX.
    Feel free to move this file.
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
}