import Roact from "@rbxts/roact";
import { StyleColors, StyleProperties } from "Style";
import { NodeSelectionCategoryButton } from "./NodeSelectionCategoryButton";
import { NodeCategories } from "Nodes/NodeList";

// IMPROVE: add search
// IMPROVE: instead of having a static 1 000 000 for zindex make it dynamic
// IMPROVE: make cateogories not open off widget

interface Props {
	canvasPosition: UDim2;
	position: Vector2;
	zIndex: number;
	closeSelection: () => void;
}

export function NodeSelection({ zIndex, position, closeSelection }: Props) {
	return (
		<frame
			Size={UDim2.fromOffset(150, 35 + 1 * (5 + 20))}
			Position={UDim2.fromOffset(position.X, position.Y)}
			BackgroundTransparency={0}
			BackgroundColor3={StyleColors.hex800}
			ZIndex={zIndex}
		>
			<uipadding
				PaddingTop={new UDim(0, 4)}
				PaddingRight={new UDim(0, 4)}
				PaddingBottom={new UDim(0, 4)}
				PaddingLeft={new UDim(0, 4)}
			/>
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
			<uilistlayout Padding={new UDim(0, 5)} HorizontalAlignment={"Center"} />

			<textlabel
				Size={new UDim2(1, 0, 0, 20)}
				BackgroundTransparency={0}
				BackgroundColor3={StyleColors.hex700}
				TextColor3={StyleColors.hex100}
				FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
				TextSize={StyleProperties.FontSize}
				Text={"Node Selection"}
				ZIndex={zIndex + 1}
			>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
			</textlabel>

			<frame
				Size={new UDim2(1, 0, 0, 2)}
				BackgroundTransparency={0}
				BackgroundColor3={StyleColors.hex600}
				ZIndex={zIndex + 1}
			/>

			<frame
				Size={new UDim2(1, 0, 0, 20)}
				BackgroundColor3={StyleColors.hex700}
				BackgroundTransparency={0}
				ZIndex={zIndex + 1}
			>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
				<NodeSelectionCategoryButton
					category={NodeCategories.Basic}
					zIndex={zIndex + 2}
					closeSelection={closeSelection}
				/>
			</frame>
		</frame>
	);
}
