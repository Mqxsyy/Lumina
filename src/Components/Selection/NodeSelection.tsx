import Roact, { useRef, useState } from "@rbxts/roact";
import { StyleColors, StyleProperties } from "Style";
import Div from "../Div";
import { NodeSearchInput } from "./NodeSearchInput";
import { NodeCategorySelectionButton } from "./NodeCategorySelectionButton";
import { NodeList } from "Lists/NodesList";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystems } from "Lists/SystemsList";
import { NodeSelectionButton } from "./NodeSelectionButton";
import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";

// TODO: make button connect to selection; add tracker which selection is open / make selection display less scuffed
// TODO: display only currently usable nodes, ex. when update group is selected show only ones valid in update
// TODO: add arrow navigation support

const DIVIDER_SIZE_Y = 2;
const SELECTION_WIDTH = 200;

interface Props {
	Position: UDim2;
}

export function NodeSelection({ Position }: Props) {
	const [searchedSelection, setSearchedSelection] = useState<SelectionEntry[]>([]);
	const [displayDefaultCategories, setDisplayDefaultCategories] = useState(true);

	const TextChanged = (text: string) => {
		if (text === "") {
			setDisplayDefaultCategories(true);
			setSearchedSelection([]);
			return;
		}

		setDisplayDefaultCategories(false);
		const selectionEntries = [] as SelectionEntry[];

		for (const [_, selectionEntry] of pairs(NodeSystems)) {
			if (selectionEntry.name.lower().find(text.lower())[0] !== undefined) {
				selectionEntries.push(selectionEntry);
			}
		}

		for (const [_, group] of pairs(NodeList)) {
			for (const [_, selectionEntry] of pairs(group)) {
				if (selectionEntry.name.lower().find(text.lower())[0] !== undefined) {
					selectionEntries.push(selectionEntry);
				}
			}
		}

		setSearchedSelection(selectionEntries);
	};

	return (
		<Div Position={Position} Size={UDim2.fromOffset(SELECTION_WIDTH, 0)} AutomaticSize="Y">
			<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={StyleColors.Primary}>
				<uicorner CornerRadius={StyleProperties.CornerRadius} />
				<uipadding PaddingTop={new UDim(0, 3)} PaddingBottom={new UDim(0, 3)} />

				<Div>
					<uilistlayout FillDirection={"Vertical"} HorizontalAlignment={"Center"} Padding={new UDim(0, 5)} />

					<NodeSearchInput TextChanged={TextChanged} />

					<frame
						Size={new UDim2(0.9, 0, 0, DIVIDER_SIZE_Y)}
						BackgroundColor3={StyleColors.White}
						Transparency={0.5}
					/>

					{/* For some reason ternary doesn't want to work in this case */}
					{searchedSelection.size() > 0 && (
						<Div
							Size={
								new UDim2(
									1,
									0,
									0,
									searchedSelection.size() < 8 ? searchedSelection.size() * 30 + 1 : 8 * 30 + 1,
								)
							}
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
							>
								<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />
								<uipadding PaddingRight={new UDim(0, searchedSelection.size() > 8 ? 6 : 0)} />

								{searchedSelection.map((node) => {
									return (
										<NodeSelectionButton
											key={node.name}
											ElementName={node.name}
											Text={node.name}
											CreateFn={node.create}
										/>
									);
								})}
							</scrollingframe>
						</Div>
					)}

					{displayDefaultCategories && (
						<Div Size={new UDim2(1, 0, 0, 6 * 30 - 5)}>
							<uilistlayout
								FillDirection={"Vertical"}
								HorizontalAlignment={"Center"}
								Padding={new UDim(0, 5)}
							/>

							<NodeCategorySelectionButton Text="Systems" NodeCategory={NodeSystems} />
							<NodeCategorySelectionButton Text="Spawner" NodeCategory={NodeList[NodeGroups.Spawn]} />
							<NodeCategorySelectionButton
								Text="Initialize"
								NodeCategory={NodeList[NodeGroups.Initialize]}
							/>
							<NodeCategorySelectionButton Text="Update" NodeCategory={NodeList[NodeGroups.Update]} />
							<NodeCategorySelectionButton Text="Render" NodeCategory={NodeList[NodeGroups.Render]} />
							<NodeCategorySelectionButton Text="Logic" NodeCategory={NodeList[NodeGroups.Logic]} />
						</Div>
					)}
				</Div>
			</frame>
		</Div>
	);
}
