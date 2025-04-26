import React, { type Element, useEffect, useRef, useState, type PropsWithChildren } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import type { FastEventConnection } from "API/Bindables/FastEvent";
import type { StateField as StateFieldAPI } from "API/Fields/StateField";
import type { ParticleData } from "API/ParticleService";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import ConnectionPointOut from "Components/Connections/ConnectionPointOut";
import Div from "Components/Div";
import StateField from "Components/NodeFields/StateField";
import { NODE_WIDTH } from "Components/SizeConfig";
import { GetMousePosition, GetMousePositionOnCanvas } from "MainWindow";
import { GetCanvasData } from "Services/CanvasService";
import { SetDraggingNodeId } from "Services/DraggingService";
import { GetNodeById, type NodeCollectionEntry, RemoveNode, SetNodeElement, UpdateNodeData } from "Services/NodesService";
import { GetSelectedNodeId, SetSelectNodeId, selectedNodeIdChanged } from "Services/SelectionService";
import { StyleColors, StyleProperties } from "API/Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

const NODE_SELECT_TIME = 0.1;

interface Props {
    Name: string;
    Width?: number;
    NodeId: number;
    NodeAnchorPoint: Vector2;
    IsConnectedToSystem: boolean;
    Types?: Array<{ field: StateFieldAPI; order: number; name?: string }>;
    TypesExtras?: Array<() => Element>;
    Outputs?: Array<{
        order: number;
        valueType: string;
        valueName: string;
        fn: (data: ParticleData) => number | Vector2 | Vector3;
        label?: string;
    }>;
}

function Node({
    Name,
    Width = NODE_WIDTH,
    NodeId,
    NodeAnchorPoint,
    IsConnectedToSystem,
    Types = undefined,
    TypesExtras = undefined,
    Outputs = undefined,
    children,
}: PropsWithChildren<Props>) {
    const [_, setForceRender] = useState(0);
    const [zoomScale, setZoomScale] = useState(GetZoomScale());

    const mouseOffsetRef = useRef(new Vector2(0, 0));
    const canvasData = useRef(GetCanvasData());
    const elementRef = useRef(undefined as undefined | ImageButton);
    const selectingNodeTimeRef = useRef(0);
    const selectedNodeIdChangedConnectionRef = useRef<FastEventConnection>();

    const onMouseButton1Down = (element: ImageButton) => {
        const mousePosition = GetMousePosition();
        mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);

        SetDraggingNodeId(NodeId);
        selectingNodeTimeRef.current = os.clock();

        RunService.BindToRenderStep("MoveNode", 110, () => {
            const nodeData = GetNodeById(NodeId) as NodeCollectionEntry;
            const newAnchorPosition = GetMousePositionOnCanvas().add(mouseOffsetRef.current).div(zoomScale);

            if (nodeData.data.anchorPoint !== newAnchorPosition) {
                UpdateNodeData(NodeId, (data) => {
                    data.anchorPoint = newAnchorPosition;
                    return data;
                });
            }
        });
    };

    const onMouseButton1Up = () => {
        if (os.clock() - selectingNodeTimeRef.current > NODE_SELECT_TIME) return;

        SetSelectNodeId(NodeId);
        setForceRender((prev) => prev + 1);

        if (selectedNodeIdChangedConnectionRef.current !== undefined) return;

        selectedNodeIdChangedConnectionRef.current = selectedNodeIdChanged.Connect((newNodeId) => {
            if (newNodeId !== NodeId) {
                setForceRender((prev) => prev + 1);
                (selectedNodeIdChangedConnectionRef.current as FastEventConnection).Disconnect();
                selectedNodeIdChangedConnectionRef.current = undefined;
            }
        });
    };

    const onMouseButton2Down = () => {
        RemoveNode(NodeId);

        if (GetSelectedNodeId() === NodeId) {
            SetSelectNodeId(-1);
        }
    };

    const getPosition = () => {
        const nodeHeight = elementRef.current === undefined ? 0 : elementRef.current.AbsoluteSize.Y;
        const offsetFromCenter = NodeAnchorPoint.mul(zoomScale).add(new Vector2(Width * 0.5 * zoomScale, nodeHeight * 0.5));
        const canvasPosition = new Vector2(canvasData.current.Position.X.Offset, canvasData.current.Position.Y.Offset);
        const position = canvasPosition.add(offsetFromCenter);
        return UDim2.fromOffset(position.X, position.Y);
    };

    useEffect(() => {
        const zoomConnection = ZoomScaleChanged.Connect((newScale) => {
            setZoomScale(newScale);
        });

        const fieldsConnections: RBXScriptConnection[] = [];

        const node = GetNodeById(NodeId) as NodeCollectionEntry;
        const fields = node.data.node.nodeFields;
        for (const [_, field] of pairs(fields)) {
            fieldsConnections.push(
                field.FieldChanged.Connect(() => {
                    setForceRender((prev) => prev + 1);
                }),
            );
        }

        return () => {
            if (selectedNodeIdChangedConnectionRef.current !== undefined) {
                selectedNodeIdChangedConnectionRef.current.Disconnect();
            }

            zoomConnection.Disconnect();
            for (const fieldConnection of fieldsConnections) {
                fieldConnection.Disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (elementRef.current === undefined) return;
        SetNodeElement(NodeId, elementRef.current);
        setForceRender((prev) => prev + 1);

        const connection = elementRef.current.GetPropertyChangedSignal("AbsoluteSize").Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    }, [elementRef.current]);

    return (
        <imagebutton
            Size={UDim2.fromOffset(Width * zoomScale, 0)}
            AutomaticSize={"Y"}
            AnchorPoint={new Vector2(0.5, 0.5)}
            Position={IsConnectedToSystem ? UDim2.fromScale(0, 0) : getPosition()}
            BackgroundColor3={StyleColors.Primary}
            AutoButtonColor={false}
            ImageTransparency={1}
            ref={elementRef}
            Event={{
                InputBegan: (element, inputObject) => {
                    if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
                        onMouseButton1Down(element);
                    } else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
                        onMouseButton2Down();
                    }
                },

                InputEnded: (_, inputObject) => {
                    if (inputObject.UserInputType !== Enum.UserInputType.MouseButton1) return;
                    onMouseButton1Up();
                },
            }}
        >
            <uicorner CornerRadius={StyleProperties.CornerRadius} />
            <uilistlayout FillDirection={"Vertical"} />

            {GetSelectedNodeId() === NodeId && (
                <uistroke Thickness={math.clamp(3 * zoomScale, 1, math.huge)} Color={StyleColors.Selection} />
            )}

            {/* Header */}
            <Div Size={new UDim2(1, 0, 0, 24)} ClipsDescendants={true}>
                <Div Size={new UDim2(1, 0, 0, 30)} BackgroundColor={(GetNodeById(NodeId) as NodeCollectionEntry).data.node.GetColor()}>
                    <uicorner CornerRadius={StyleProperties.CornerRadius} />
                    <uipadding PaddingLeft={new UDim(0, 10)} PaddingBottom={new UDim(0, 9)} PaddingTop={new UDim(0, 5)} />

                    <BasicTextLabel
                        Size={UDim2.fromScale(1, 1)}
                        FontWeight={Enum.FontWeight.SemiBold}
                        TextColor={StyleColors.TextDark}
                        Text={Name}
                    />
                </Div>
            </Div>

            <Div Size={new UDim2(1, 0, 0, 2)} BackgroundColor={Color3.fromHex("15161E")} />

            {/* Types */}
            {(Types !== undefined || TypesExtras !== undefined) && (
                <Div Size={UDim2.fromScale(0, 0)} AutomaticSize="XY">
                    <uilistlayout FillDirection={"Vertical"} />

                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />

                        <uipadding
                            PaddingBottom={new UDim(0, 5)}
                            PaddingRight={new UDim(0, 5)}
                            PaddingLeft={new UDim(0, 5)}
                            PaddingTop={new UDim(0, 5)}
                        />

                        {Types?.map((t) => (
                            <StateField key={t.order} NodeId={NodeId} NodeField={t.field} Label={t.name} />
                        ))}

                        {TypesExtras?.map((extra) => extra())}
                    </Div>

                    <Div Size={new UDim2(1, 0, 0, 2)} BackgroundColor={Color3.fromHex("15161E")} />
                </Div>
            )}

            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout FillDirection={"Horizontal"} VerticalFlex={"Fill"} />

                {/* Inputs */}
                {children !== undefined && (
                    <Div Size={UDim2.fromOffset(0, 0)} AutomaticSize="Y">
                        <uiflexitem FlexMode={"Fill"} />
                        <uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />
                        <uipadding
                            PaddingLeft={new UDim(0, 5)}
                            PaddingRight={new UDim(0, 5)}
                            PaddingTop={new UDim(0, 5)}
                            PaddingBottom={new UDim(0, 5)}
                        />

                        {children}
                    </Div>
                )}

                {Outputs !== undefined && children !== undefined && (
                    <Div Size={new UDim2(0, 2, 0, 0)} BackgroundColor={Color3.fromHex("15161E")} />
                )}

                {/* Outputs */}
                {Outputs !== undefined && (
                    <Div Size={UDim2.fromScale(children !== undefined ? 0 : 1, 0)} AutomaticSize={children !== undefined ? "XY" : "Y"}>
                        <uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Center"} VerticalFlex={"Fill"} />

                        <Div
                            Size={new UDim2(children !== undefined ? 0 : 1, children !== undefined ? -2 : 0, 0, 0)}
                            AutomaticSize={children !== undefined ? "XY" : "Y"}
                            BackgroundColor={Color3.fromHex("1B1D2D")}
                        >
                            <uilistlayout
                                FillDirection={"Vertical"}
                                HorizontalFlex={Outputs[0].label === undefined && children === undefined ? "None" : "Fill"}
                                HorizontalAlignment={"Right"}
                                Padding={new UDim(0, 2)}
                            />
                            <uipadding
                                PaddingBottom={new UDim(0, 2)}
                                PaddingTop={new UDim(0, 2)}
                                PaddingLeft={new UDim(0, 4)}
                                PaddingRight={new UDim(0, 4)}
                            />

                            {Outputs.map((output) => {
                                if (output.label === undefined) {
                                    return (
                                        <ConnectionPointOut
                                            key={output.order}
                                            NodeId={NodeId}
                                            ValueType={output.valueType}
                                            ValueName={output.valueName}
                                            Fn={output.fn}
                                        />
                                    );
                                }

                                return (
                                    <Div key={output.order} Size={UDim2.fromScale(0, 0)} AutomaticSize="XY">
                                        <uilistlayout
                                            FillDirection={"Horizontal"}
                                            VerticalFlex={"Fill"}
                                            HorizontalAlignment={"Right"}
                                            Padding={new UDim(0, 5)}
                                        />
                                        <uipadding PaddingLeft={new UDim(0, 2)} />

                                        <BasicTextLabel
                                            Size={UDim2.fromOffset(0, 20)}
                                            AutomaticSize="X"
                                            TextColor={StyleColors.TextLight}
                                            Text={output.label as string}
                                        />
                                        <ConnectionPointOut
                                            NodeId={NodeId}
                                            ValueType={output.valueType}
                                            ValueName={output.valueName}
                                            Fn={output.fn}
                                        />
                                    </Div>
                                );
                            })}
                        </Div>
                    </Div>
                )}
            </Div>
        </imagebutton>
    );
}

export default React.memo(Node);
