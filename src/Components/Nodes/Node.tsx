import React, { useEffect, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { FastEventConnection } from "API/Bindables/FastEvent";
import { LogicNode } from "API/Nodes/Logic/LogicNode";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import ConnectionPointOut from "Components/Connections/ConnectionPointOut";
import Div from "Components/Div";
import { NODE_WIDTH } from "Components/SizeConfig";
import { GetCanvasData } from "Services/CanvasService";
import { SetDraggingNodeId } from "Services/DraggingService";
import { GetNodeById, RemoveNode, SetNodeElement, UpdateNodeData } from "Services/NodesService";
import { GetSelectedNodeId, SetSelectNodeId, selectedNodeIdChanged } from "Services/SelectionService";
import { StyleColors, StyleProperties } from "Style";
import { GetMousePosition, GetMousePositionOnCanvas } from "Windows/MainWindow";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

const NODE_SELECT_TIME = 0.1;

interface Props {
    Name: string;
    NodeId: number;
    NodeAnchorPoint: Vector2;
    IsConnectedToSystem: boolean;
    ConnectionFunction?: () => number;
    ConnectioNode?: LogicNode;
}

function Node({
    Name,
    NodeId,
    NodeAnchorPoint,
    IsConnectedToSystem,
    ConnectionFunction = undefined,
    ConnectioNode = undefined,
    children,
}: React.PropsWithChildren<Props>) {
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
            const nodeData = GetNodeById(NodeId)!;
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
        setForceRender((prev) => ++prev);

        if (selectedNodeIdChangedConnectionRef.current !== undefined) return;

        selectedNodeIdChangedConnectionRef.current = selectedNodeIdChanged.Connect((newNodeId) => {
            if (newNodeId !== NodeId) {
                setForceRender((prev) => ++prev);
                selectedNodeIdChangedConnectionRef.current!.Disconnect();
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
        const offsetFromCenter = NodeAnchorPoint.mul(zoomScale).add(
            new Vector2(NODE_WIDTH * 0.5 * zoomScale, nodeHeight * 0.5),
        );
        const canvasPosition = new Vector2(canvasData.current.Position.X.Offset, canvasData.current.Position.Y.Offset);
        const position = canvasPosition.add(offsetFromCenter);
        return UDim2.fromOffset(position.X, position.Y);
    };

    useEffect(() => {
        const connection = ZoomScaleChanged.Connect((newScale) => {
            setZoomScale(newScale);
        });

        return () => {
            if (selectedNodeIdChangedConnectionRef.current !== undefined) {
                selectedNodeIdChangedConnectionRef.current.Disconnect();
            }

            connection.Disconnect();
        };
    }, []);

    useEffect(() => {
        if (elementRef.current === undefined) return;
        SetNodeElement(NodeId, elementRef.current);
        setForceRender((prev) => ++prev);
    }, [elementRef.current]);

    return (
        <imagebutton
            Size={UDim2.fromOffset(NODE_WIDTH * zoomScale, 0)}
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
            <uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />
            <uipadding
                PaddingLeft={new UDim(0, 1 + 5 * zoomScale)}
                PaddingRight={new UDim(0, 1 + 5 * zoomScale)}
                PaddingTop={new UDim(0, 1 + 5 * zoomScale)}
                PaddingBottom={new UDim(0, 1 + 5 * zoomScale)}
            />
            {GetSelectedNodeId() === NodeId && (
                <uistroke Thickness={math.clamp(3 * zoomScale, 1, math.huge)} Color={StyleColors.Selection} />
            )}
            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout
                    FillDirection={"Horizontal"}
                    Padding={new UDim(0, 10 * zoomScale)}
                    VerticalAlignment={"Center"}
                />

                <BasicTextLabel Size={new UDim2(1, 0, 0, 20)} Text={Name}>
                    <uiflexitem FlexMode={"Fill"} />
                </BasicTextLabel>
                {ConnectionFunction !== undefined && ConnectioNode !== undefined && (
                    <ConnectionPointOut NodeId={NodeId} BindFunction={ConnectionFunction} />
                )}
            </Div>
            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                <uilistlayout Padding={new UDim(0, 5 * zoomScale)} />
                <uipadding PaddingLeft={new UDim(0, 10 * zoomScale)} />

                {children}
            </Div>
        </imagebutton>
    );
}

export default React.memo(Node);
