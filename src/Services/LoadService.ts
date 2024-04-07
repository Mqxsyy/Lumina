import { HttpService } from "@rbxts/services";

const Selection = game.GetService("Selection");

export function LoadFromFile() {
	const selection = Selection.Get();

	if (selection.size() === 0) {
		warn("Please select a file to load from.");
		return;
	}

	if (selection.size() > 1) {
		warn("Please select only one file to load from.");
		return;
	}

	const selectedInstance = selection[0];
	if (selectedInstance.IsA("ModuleScript") === false) {
		warn("Please select a valid file to load from.");
		return;
	}

	const data = HttpService.JSONDecode((selectedInstance as ModuleScript).Source);

	print("Loaded data: ", data);
}
