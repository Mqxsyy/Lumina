import { HttpService } from "@rbxts/services";
import { GetSavesFolder } from "API/FolderLocations";
import { GetNodeSystems } from "./NodeSystemService";

const savesFolder = GetSavesFolder();

export function SaveToFile() {
	const container = new Instance("ModuleScript");
	const data = {
		name: "Name",
		age: 20,
	};

	container.Source = HttpService.JSONEncode(data);
	container.Parent = savesFolder;
}
