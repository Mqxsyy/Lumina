import React, { useRef, useState } from "@rbxts/react";
import { NodeGroups } from "API/NodeGroup";
import { SelectionEntry } from "API/Nodes/AutoGeneration/SelectionEntry";
import { NodeList } from "Lists/NodeList";
import { NodeSystems } from "Lists/SystemsList";
import { StyleColors, StyleProperties } from "Style";
import Div from "../Div";
import { NodeCategorySelectionButton } from "./NodeCategorySelectionButton";
import { NodeSearchInput } from "./NodeSearchInput";
import { NodeSelectionButton } from "./NodeSelectionButton";

// TODO: display only currently usable nodes, ex. when update group is selected show only ones valid in update -> requires selecting to be a thing
// TODO: add arrow navigation support
// MAYBE-TODO: make this utilize dropdown service and highlightableButton

const DIVIDER_SIZE_Y = 2;
const SELECTION_WIDTH = 200;

interface Props {
    Position: UDim2;
    ToggleSelection: () => void;
}

export function NodeSelection({ Position, ToggleSelection }: Props) {
    const [searchedSelection, setSearchedSelection] = useState<SelectionEntry[]>([]);
    const [displayDefaultCategories, setDisplayDefaultCategories] = useState(true);
    const categoryUnhoverFunctionsRef = useRef<(() => void)[]>([]);

    const textChanged = (text: string) => {
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

    const getCategoryUnhover = (fn: () => void) => {
        categoryUnhoverFunctionsRef.current.push(fn);
    };

    return (
        <imagebutton
            Position={Position}
            Size={UDim2.fromOffset(SELECTION_WIDTH, 0)}
            AutomaticSize="Y"
            BackgroundTransparency={1}
            ImageTransparency={1}
            ZIndex={20}
        >
            <frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={StyleColors.Primary}>
                <uicorner CornerRadius={StyleProperties.CornerRadius} />
                <uipadding PaddingTop={new UDim(0, 3)} PaddingBottom={new UDim(0, 3)} />

                <Div>
                    <uilistlayout FillDirection={"Vertical"} HorizontalAlignment={"Center"} Padding={new UDim(0, 5)} />

                    <NodeSearchInput TextChanged={textChanged} />

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
                                            ToggleSelection={ToggleSelection}
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
                                HorizontalAlignment={"Left"}
                                Padding={new UDim(0, 5)}
                            />

                            <NodeCategorySelectionButton
                                Text="Systems"
                                NodeCategory={NodeSystems}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Spawn"
                                NodeCategory={NodeList[NodeGroups.Spawn]}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Initialize"
                                NodeCategory={NodeList[NodeGroups.Initialize]}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Update"
                                NodeCategory={NodeList[NodeGroups.Update]}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Render"
                                NodeCategory={NodeList[NodeGroups.Render]}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Logic"
                                NodeCategory={NodeList[NodeGroups.Logic]}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                        </Div>
                    )}
                </Div>
            </frame>
        </imagebutton>
    );
}
