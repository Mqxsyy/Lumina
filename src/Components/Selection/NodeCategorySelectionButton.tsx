import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import Div from "../Div";
import { StyleColors, StyleProperties } from "Style";
import { NodeSelectionButton } from "./NodeSelectionButton";
import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

interface Props {
	Text: string;
	NodeCategory: { [key: string]: SelectionEntry };
	CategoryUnhoverFunctions: (() => void)[];
	ExposeUnhover: (fn: () => void) => void;
}

export function NodeCategorySelectionButton({ Text, NodeCategory, CategoryUnhoverFunctions, ExposeUnhover }: Props) {
	const [hovering, setHovering] = useState(false);
	const [nodes, setNodes] = useState([] as SelectionEntry[]);

	const isHoveringButtonRef = useRef(false);
	const isHoveringSelectionRef = useRef(false);

	const onHoverButton = () => {
		CategoryUnhoverFunctions.forEach((fn) => fn()); // OPTIMIZE: may not be required anymore

		isHoveringButtonRef.current = true;
		setHovering(true);
	};

	const onUnhoverButton = () => {
		isHoveringButtonRef.current = false;
		if (!isHoveringSelectionRef.current) {
			setHovering(false);
		}
	};

	const onHoverSelection = () => {
		isHoveringSelectionRef.current = true;
		setHovering(true);
	};

	const onUnhoverSelection = () => {
		isHoveringSelectionRef.current = false;
		if (!isHoveringButtonRef.current) {
			setHovering(false);
		}
	};

	useEffect(() => {
		const nodes = [];

		for (const [_, v] of pairs(NodeCategory)) {
			if (v.create === undefined) continue;
			nodes.push(v);
		}

		ExposeUnhover(() => {
			onUnhoverButton();
			onUnhoverSelection();
		});

		// Nodes are rendered in alphabetical order
		setNodes(nodes);
	}, []);

	return (
		<Div Size={new UDim2(1, 8, 0, 25)} onHover={onHoverButton} onUnhover={onUnhoverButton}>
			{hovering && (
				<frame
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, -4, 0.5, 0)}
					Size={new UDim2(0.95, -8, 0.9, 0)}
					BackgroundColor3={StyleColors.Highlight}
				>
					<uicorner CornerRadius={StyleProperties.CornerRadius} />
				</frame>
			)}
			<Div Size={new UDim2(1, -8, 1, 0)}>
				<uipadding PaddingLeft={new UDim(0, 15)} PaddingRight={new UDim(0, 15)} />

				<BasicTextLabel Text={Text} TextXAlignment={Enum.TextXAlignment.Center} IsAffectedByZoom={false} />
				<BasicTextLabel Text=">" TextXAlignment={Enum.TextXAlignment.Right} IsAffectedByZoom={false} />
			</Div>
			{hovering && (
				<Div
					Position={new UDim2(1, -3, 0, -3)}
					Size={UDim2.fromOffset(200, nodes.size() < 8 ? nodes.size() * 30 + 1 : 8 * 30 + 1)}
					BackgroundColor={StyleColors.Primary}
				>
					<uicorner CornerRadius={StyleProperties.CornerRadius} />
					<uipadding PaddingTop={new UDim(0, 3)} PaddingBottom={new UDim(0, 3)} />

					<scrollingframe
						Size={UDim2.fromScale(1, 1)}
						ScrollBarThickness={6}
						CanvasSize={UDim2.fromScale(1, 0)}
						AutomaticCanvasSize={"Y"}
						BackgroundTransparency={1}
						ScrollingDirection={"Y"}
						Event={{
							MouseEnter: onHoverSelection,
							MouseLeave: onUnhoverSelection,
						}}
					>
						<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />
						<uipadding PaddingRight={new UDim(0, nodes.size() > 8 ? 6 : 0)} />

						{nodes.map((node) => {
							return (
								<NodeSelectionButton ElementName={node.name} Text={node.name} CreateFn={node.create} />
							);
						})}
					</scrollingframe>
				</Div>
			)}
		</Div>
	);
}
