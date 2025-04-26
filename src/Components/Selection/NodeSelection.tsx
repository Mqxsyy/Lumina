import React, { useRef, useState } from "@rbxts/react";
import { NodeGroups } from "API/NodeGroup";
import type { Entry } from "API/Nodes/SelectionEntry";
import { NodeList } from "Lists/NodeList";
import { NodeSystems } from "Lists/SystemsList";
import { StyleColors, StyleProperties } from "API/Style";
import Div from "../Div";
import { NodeCategorySelectionButton } from "./NodeCategorySelectionButton";
import { NodeSearchInput } from "./NodeSearchInput";
import { NodeSelectionButton } from "./NodeSelectionButton";

const DIVIDER_SIZE_Y = 2;
const SELECTION_WIDTH = 200;

interface Props {
    Position: UDim2;
    ToggleSelection: () => void;
}

const spawnNodes: Entry[] = [];
const initializeNodes: Entry[] = [];
const updateNodes: Entry[] = [];
const renderNodes: Entry[] = [];
const logicNodes: Entry[] = [];

function GetEntries(trg: Entry[], group: NodeGroups) {
    for (const node of NodeList.filter((n) => n.nodeGroups.findIndex((e) => e === group) !== -1)) {
        if (node.alternativeEntries !== undefined) {
            for (const alt of node.alternativeEntries) {
                trg.push(alt);
            }
        } else {
            trg.push(node.defaultEntry);
        }
    }
}

GetEntries(spawnNodes, NodeGroups.Spawn);
GetEntries(initializeNodes, NodeGroups.Initialize);
GetEntries(updateNodes, NodeGroups.Update);
GetEntries(renderNodes, NodeGroups.Render);
GetEntries(logicNodes, NodeGroups.Logic);

const allNodes: Entry[] = [];
for (const node of NodeList) {
    if (node.alternativeEntries !== undefined) {
        for (const alt of node.alternativeEntries) {
            allNodes.push(alt);
        }
    } else {
        allNodes.push(node.defaultEntry);
    }
}

export function NodeSelection({ Position, ToggleSelection }: Props) {
    const [searchedSelection, setSearchedSelection] = useState<Entry[]>([]);
    const [displayDefaultCategories, setDisplayDefaultCategories] = useState(true);
    const categoryUnhoverFunctionsRef = useRef<(() => void)[]>([]);

    const textChanged = (text: string) => {
        if (text === "") {
            setDisplayDefaultCategories(true);
            setSearchedSelection([]);
            return;
        }

        setDisplayDefaultCategories(false);
        const entries = [] as Entry[];

        for (const entry of NodeSystems) {
            if (entry.name.lower().find(text.lower())[0] !== undefined) {
                entries.push(entry);
            }
        }

        for (const entry of allNodes) {
            if (entry.name.lower().find(text.lower())[0] !== undefined) {
                entries.push(entry);
            }
        }

        setSearchedSelection(entries);
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

                    <frame Size={new UDim2(0.9, 0, 0, DIVIDER_SIZE_Y)} BackgroundColor3={StyleColors.White} Transparency={0.5} />

                    {/* For some reason ternary doesn't want to work in this case */}
                    {searchedSelection.size() > 0 && (
                        <Div
                            Size={new UDim2(1, 0, 0, searchedSelection.size() < 8 ? searchedSelection.size() * 30 + 1 : 8 * 30 + 1)}
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
                            <uilistlayout FillDirection={"Vertical"} HorizontalAlignment={"Left"} Padding={new UDim(0, 5)} />

                            <NodeCategorySelectionButton
                                Text="Systems"
                                Nodes={NodeSystems}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Spawn"
                                Nodes={spawnNodes}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Initialize"
                                Nodes={initializeNodes}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Update"
                                Nodes={updateNodes}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Render"
                                Nodes={renderNodes}
                                CategoryUnhoverFunctions={categoryUnhoverFunctionsRef.current}
                                ToggleSelection={ToggleSelection}
                                ExposeUnhover={getCategoryUnhover}
                            />
                            <NodeCategorySelectionButton
                                Text="Logic"
                                Nodes={logicNodes}
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
