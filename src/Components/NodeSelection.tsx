import Roact from "@rbxts/roact";
import { StyleColors, StyleProperties } from "Style";
import { Div } from "./Div";
import { NodeSelectionLabel } from "./NodeSelectionLabel";
import { NodeCategorySelectionButton } from "./NodeCategorySelectionButton";

interface Props {
	Position: UDim2;
}

const DIVIDER_SIZE_Y = 2;

export function NodeSelection({ Position }: Props) {
	return (
		<Div Position={Position} Size={UDim2.fromOffset(150, 6 * (25 + 5) + DIVIDER_SIZE_Y + 6)}>
			<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={StyleColors.hex800}>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
				<uipadding PaddingTop={new UDim(0, 3)} PaddingBottom={new UDim(0, 3)} />
				<Div>
					<uilistlayout FillDirection={"Vertical"} HorizontalAlignment={"Center"} Padding={new UDim(0, 5)} />

					<NodeSelectionLabel Text="Nodes" />

					<frame
						Size={new UDim2(0.9, 0, 0, DIVIDER_SIZE_Y)}
						BackgroundColor3={StyleColors.hex100}
						Transparency={0.5}
					/>

					<NodeCategorySelectionButton Text="Spawner" />
					<NodeCategorySelectionButton Text="Initialize" />
					<NodeCategorySelectionButton Text="Update" />
					<NodeCategorySelectionButton Text="Render" />
					<NodeCategorySelectionButton Text="Logic" />
				</Div>
			</frame>
		</Div>
	);
}
