import Roact from "@rbxts/roact";
import { StyleColors, StyleProperties } from "Style";
import { Div } from "../Div";
import { NodeSelectionLabel } from "./NodeSelectionLabel";
import { NodeCategorySelectionButton } from "./NodeCategorySelectionButton";
import { NodeList } from "API/Nodes/NodeList";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystems } from "API/Systems/NodeSystems";

// TODO: make button connect to selection; add tracker which selection is open

interface Props {
	Position: UDim2;
}

const DIVIDER_SIZE_Y = 2;
const SELECTION_WIDTH = 150;

export function NodeSelection({ Position }: Props) {
	return (
		<Div Position={Position} Size={UDim2.fromOffset(SELECTION_WIDTH, 7 * (25 + 5) + DIVIDER_SIZE_Y + 6)}>
			<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={StyleColors.Primary}>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
				<uipadding PaddingTop={new UDim(0, 3)} PaddingBottom={new UDim(0, 3)} />

				<Div>
					<uilistlayout FillDirection={"Vertical"} HorizontalAlignment={"Center"} Padding={new UDim(0, 5)} />

					<NodeSelectionLabel Text="Nodes" />

					<frame
						Size={new UDim2(0.9, 0, 0, DIVIDER_SIZE_Y)}
						BackgroundColor3={StyleColors.White}
						Transparency={0.5}
					/>

					<NodeCategorySelectionButton Text="Systems" NodeCategory={NodeSystems} />
					<NodeCategorySelectionButton Text="Spawner" NodeCategory={NodeList[NodeGroups.Spawn]} />
					<NodeCategorySelectionButton Text="Initialize" NodeCategory={NodeList[NodeGroups.Initialize]} />
					<NodeCategorySelectionButton Text="Update" NodeCategory={NodeList[NodeGroups.Update]} />
					<NodeCategorySelectionButton Text="Render" NodeCategory={NodeList[NodeGroups.Render]} />
					<NodeCategorySelectionButton Text="Logic" NodeCategory={NodeList[NodeGroups.Logic]} />
				</Div>
			</frame>
		</Div>
	);
}
