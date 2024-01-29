import Roact from "@rbxts/roact";
import { BlankNode } from "Nodes/BlankNode";
import { CreateNode } from "Nodes/NodesHandler";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePositionOnCanvas } from "WidgetHandler";

// TODO: add categories
// TODO: add search

interface Props {
	position: Vector2;
	closeSelection: () => void;
}

export function NodeSelection({ position, closeSelection }: Props) {
	return (
		<frame
			Size={UDim2.fromOffset(150, 0)}
			AutomaticSize={Enum.AutomaticSize.Y}
			Position={UDim2.fromOffset(position.X, position.Y)}
			BackgroundTransparency={0}
			BackgroundColor3={StyleColors.hex800}
		>
			<uipadding
				PaddingTop={new UDim(0, 3)}
				PaddingRight={new UDim(0, 2)}
				PaddingBottom={new UDim(0, 4)}
				PaddingLeft={new UDim(0, 3)}
			/>
			<uicorner CornerRadius={new UDim(0, 5)} />
			<uilistlayout Padding={new UDim(0, 5)} HorizontalAlignment={"Center"} />

			<textlabel
				Size={new UDim2(1, 0, 0, 20)}
				BackgroundTransparency={0}
				BackgroundColor3={StyleColors.hex700}
				TextColor3={StyleColors.hex100}
				FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
				TextSize={StyleProperties.FontSize}
				Text={"Node Selection"}
			>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
			</textlabel>

			<frame Size={new UDim2(1, 0, 0, 2)} BackgroundTransparency={0} BackgroundColor3={StyleColors.hex600} />

			<textbutton
				Size={new UDim2(1, 0, 0, 20)}
				BackgroundTransparency={0}
				BackgroundColor3={StyleColors.hex700}
				TextColor3={StyleColors.hex100}
				FontFace={new Font(StyleProperties.FontId, Enum.FontWeight.Bold)}
				TextSize={StyleProperties.FontSize}
				Text={"Blank Node"}
				Event={{
					InputBegan: (_, inputObject) => {
						if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
						CreateNode(BlankNode, GetMousePositionOnCanvas());
						closeSelection();
					},
				}}
			>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
			</textbutton>
		</frame>
	);
}
