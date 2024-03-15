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
		const system = nodeSystem.data.system;

		if (system.CheckRequireNodes()) {
			CreateScript(tostring(nodeSystem.data.id), nodeSystem.data.system);
		}
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
	src += nodeSystem.initializeNodes.lifetime!.GetAutoGenerationCode();
	src += "\n\n";
	src += nodeSystem.renderNode!.GetAutoGenerationCode();
	src += "\n\n";

	src += `
function VFXScript.Start()
    nodeSystem:Run()
end

return VFXScript`;

	newScript.Source = src;
}
