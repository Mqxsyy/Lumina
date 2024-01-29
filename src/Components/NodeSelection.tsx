import Roact from "@rbxts/roact";
import { BlankNode } from "Nodes/BlankNode";
import { CreateNode } from "Nodes/NodesHandler";
import { StyleColors } from "Style";
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
			BackgroundColor3={StyleColors.Background}
		>
			<uipadding
				PaddingTop={new UDim(0, 2)}
				PaddingRight={new UDim(0, 2)}
				PaddingBottom={new UDim(0, 2)}
				PaddingLeft={new UDim(0, 2)}
			/>
			<uicorner CornerRadius={new UDim(0, 5)} />
			<uilistlayout Padding={new UDim(0, 5)} HorizontalAlignment={"Center"} />

			<textlabel Size={new UDim2(1, 0, 0, 20)} BackgroundTransparency={0} BackgroundColor3={StyleColors.Primary}>
				<uicorner CornerRadius={new UDim(0, 5)} />
			</textlabel>

			<textbutton
				Size={new UDim2(1, 0, 0, 20)}
				Text={"Blank Node"}
				Event={{
					InputBegan: (_, inputObject) => {
						if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
						CreateNode(BlankNode, GetMousePositionOnCanvas());
						closeSelection();
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0, 5)} />
			</textbutton>
		</frame>
	);
}
