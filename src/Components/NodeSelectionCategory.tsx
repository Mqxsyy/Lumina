import Roact from "@rbxts/roact";
import { NodeList } from "Nodes/NodeList";
import { CreateNode } from "Nodes/NodesHandler";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePositionOnCanvas } from "WidgetHandler";

interface Props {
	position: UDim2;
	category: number;
	zIndex: number;
	closeSelection: () => void;
	setHovering: (hovering: boolean) => void;
}

export function NodeSelectionCategory({ position, category, zIndex, closeSelection, setHovering }: Props) {
	return (
		<frame
			Size={UDim2.fromOffset(150, 0)}
			AutomaticSize={"Y"}
			Position={position}
			BackgroundTransparency={0}
			BackgroundColor3={StyleColors.hex800}
			ZIndex={zIndex}
			Event={{
				MouseEnter: () => {
					setHovering(true);
				},
				MouseLeave: () => {
					setHovering(false);
				},
			}}
		>
			<uipadding
				PaddingTop={new UDim(0, 3)}
				PaddingRight={new UDim(0, 3)}
				PaddingBottom={new UDim(0, 3)}
				PaddingLeft={new UDim(0, 3)}
			/>
			<uicorner CornerRadius={StyleProperties.CornerRadius} />

			<frame
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={"Y"}
				BackgroundColor3={StyleColors.hex700}
				BackgroundTransparency={0}
				ZIndex={zIndex + 1}
			>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
				<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />

				{NodeList[category].nodes.map((node) => {
					return (
						<textbutton
							Size={new UDim2(1, 0, 0, 20)}
							BackgroundTransparency={1}
							TextColor3={StyleColors.hex100}
							FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
							TextSize={StyleProperties.FontSize}
							Text={node.name}
							ZIndex={zIndex + 2}
							Event={{
								InputBegan: (_, inputObject) => {
									if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
									CreateNode(node.node, node.name, GetMousePositionOnCanvas());
									closeSelection();
								},
							}}
						/>
					);
				})}
			</frame>
		</frame>
	);
}
