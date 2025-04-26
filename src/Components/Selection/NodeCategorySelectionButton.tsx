import React, { useEffect, useRef, useState } from "@rbxts/react";
import type { Entry, SelectionEntry } from "API/Nodes/SelectionEntry";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { StyleColors, StyleProperties } from "API/Style";
import Div from "../Div";
import { NodeSelectionButton } from "./NodeSelectionButton";

interface Props {
    Text: string;
    Nodes: Entry[];
    CategoryUnhoverFunctions: (() => void)[];
    ToggleSelection: () => void;
    ExposeUnhover: (fn: () => void) => void;
}

export function NodeCategorySelectionButton({ Text, Nodes, CategoryUnhoverFunctions, ToggleSelection, ExposeUnhover }: Props) {
    const [hovering, setHovering] = useState(false);
    const [nodes, setNodes] = useState([] as Entry[]);

    const isHoveringButtonRef = useRef(false);
    const isHoveringSelectionRef = useRef(false);

    const onHoverButton = () => {
        for (const fn of CategoryUnhoverFunctions) fn();

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

        for (const node of Nodes) {
            nodes.push(node);
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
                        <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} SortOrder={"Name"} />
                        <uipadding PaddingRight={new UDim(0, nodes.size() > 8 ? 6 : 0)} />

                        {nodes.map((node) => {
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
            <Div Size={new UDim2(1, -8, 1, 0)} ZIndex={2}>
                <uipadding PaddingLeft={new UDim(0, 15)} PaddingRight={new UDim(0, 15)} />

                <BasicTextLabel Text={Text} TextXAlignment={"Center"} IsAffectedByZoom={false} />
                <BasicTextLabel Text=">" TextXAlignment={"Right"} IsAffectedByZoom={false} />
            </Div>
        </Div>
    );
}
