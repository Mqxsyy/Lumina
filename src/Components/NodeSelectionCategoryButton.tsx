import Roact, { useState } from "@rbxts/roact";
import { NodeList } from "Nodes/NodeList";
import { StyleColors, StyleProperties } from "Style";
import { NodeSelectionCategory } from "./NodeSelectionCategory";

interface Props {
	category: number;
	zIndex: number;
	closeSelection: () => void;
}

export function NodeSelectionCategoryButton({ category, zIndex, closeSelection }: Props) {
	const [isHovering, setIsHovering] = useState(false);
	const [isHoveringCategory, setIsHoveringCategory] = useState(false);

	return (
		<>
			<textlabel
				Size={new UDim2(1, 0, 0, 20)}
				BackgroundTransparency={1}
				TextColor3={StyleColors.hex100}
				FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
				TextSize={StyleProperties.FontSize}
				Text={NodeList[category].categoryName}
				ZIndex={zIndex}
				Event={{
					MouseEnter: () => {
						setIsHovering(true);
					},
					MouseLeave: () => {
						task.wait();
						setIsHovering(false);
					},
				}}
			/>

			{(isHovering || isHoveringCategory) && (
				<NodeSelectionCategory
					position={new UDim2(1, 6, 0, -2)}
					category={category}
					zIndex={zIndex + 1}
					closeSelection={closeSelection}
					setHovering={setIsHoveringCategory}
				/>
			)}
		</>
	);
}
