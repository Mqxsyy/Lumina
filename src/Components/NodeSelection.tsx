import Roact from "@rbxts/roact";
import { BlankNode } from "Nodes/BlankNode";
import { CreateNode } from "Nodes/NodesHandler";
import { GetMousePositionOnCanvas } from "WidgetHandler";

export function NodeSelection() {
	return (
		<frame>
			<textlabel />
			<textbutton
				Text={"Blank Node"}
				Event={{
					InputBegan: (_, inputObject) => {
						if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
						CreateNode(BlankNode, GetMousePositionOnCanvas());
					},
				}}
			/>
		</frame>
	);
}
