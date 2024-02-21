import Roact, { useEffect, useState } from "@rbxts/roact";
import { Div } from "./Div";
import { StyleColors, StyleFont, StyleProperties } from "Style";
import { NodeSelectionButton } from "./NodeSelectionButton";
import { SelectionEntry } from "API/SelectionEntry";

interface Props {
	Text: string;
	NodeCategory: { [key: string]: SelectionEntry };
}

export function NodeCategorySelectionButton({ Text, NodeCategory }: Props) {
	const [hovering, setHovering] = useState(false);
	const [hoveringButton, setHoveringButton] = useState(false);
	const [hoveringSelection, setHoveringSelection] = useState(false);

	const [nodes, setNodes] = useState([] as SelectionEntry[]);

	const onHoverButton = () => {
		setHoveringButton(true);
		setHovering(true);
	};

	const onUnhoverButton = () => {
		setHoveringButton(false);
		if (!hoveringSelection) {
			setHovering(false);
		}
	};

	const onHoverSelection = () => {
		setHoveringSelection(true);
		setHovering(true);
	};

	const onUnhoverSelection = () => {
		setHoveringSelection(false);
		if (!hoveringButton) {
			setHovering(false);
		}
	};

	useEffect(() => {
		for (const [_, v] of pairs(NodeCategory)) {
			setNodes((prev) => {
				return [...prev, v];
			});
		}
	}, []);

	return (
		<Div Size={new UDim2(1, 10, 0, 25)} onHover={onHoverButton} onUnhover={onUnhoverButton}>
			{hovering && (
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					Size={new UDim2(0.95, -10, 0.9, 0)}
					BackgroundColor3={StyleColors.hex600}
				>
					<uicorner CornerRadius={StyleProperties.CornerRadius} />
				</frame>
			)}
			<Div Size={new UDim2(1, -10, 1, 0)}>
				<uipadding PaddingLeft={new UDim(0, 15)} PaddingRight={new UDim(0, 15)} />
				<textlabel
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Text={Text}
					FontFace={StyleFont}
					TextColor3={StyleColors.hex100}
					TextXAlignment={"Center"}
					TextSize={StyleProperties.FontSize}
				/>
				<textlabel
					Size={UDim2.fromScale(1, 1)}
					BackgroundTransparency={1}
					Text={">"}
					FontFace={StyleFont}
					TextColor3={StyleColors.hex100}
					TextXAlignment={"Right"}
					TextSize={StyleProperties.FontSize}
				/>
			</Div>
			{hovering && (
				<Div
					Position={UDim2.fromScale(1, 0)}
					Size={UDim2.fromScale(1, 10)}
					onHover={onHoverSelection}
					onUnhover={onUnhoverSelection}
				>
					<frame
						AnchorPoint={new Vector2(0.5, 0)}
						Position={new UDim2(0.5, 0, 0, -3)}
						Size={new UDim2(1, 0, 0, 0)}
						BackgroundColor3={StyleColors.hex800}
						AutomaticSize={"Y"}
					>
						<uicorner CornerRadius={StyleProperties.CornerRadius} />
						<uipadding PaddingTop={new UDim(0, 3)} PaddingBottom={new UDim(0, 3)} />
						<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />

						{nodes.map((node) => {
							return <NodeSelectionButton Text={node.name} CreateFn={node.create} />;
						})}
					</frame>
				</Div>
			)}
		</Div>
	);
}
