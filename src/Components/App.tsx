import React, { useEffect, useMemo, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { CanvasDataChanged, GetCanvasData, UpdateCanvasData } from "Services/CanvasService";
import { ConnectionsChanged, GetAllConnections, UnbindMovingConnection } from "Services/ConnectionsService";
import { SetDraggingNodeId } from "Services/DraggingService";
import { StyleColors } from "Style";
import { GetMousePosition, GetMousePositionOnCanvas, WidgetSizeChanged } from "Windows/MainWindow";
import { GetWindow, Windows } from "Windows/WindowSevice";
import { GetZoomScale, UpdateZoomScale, ZoomScaleChanged } from "ZoomScale";
import { GetAllSystems, NodeSystemsChanged } from "../Services/NodeSystemService";
import { GetAllNodes, NodesChanged } from "../Services/NodesService";
import { BasicTextLabel } from "./Basic/BasicTextLabel";
import Controls from "./Controls/Controls";
import Div from "./Div";
import { NodeSelection } from "./Selection/NodeSelection";

// TODO: add selecting, copy and paste, group selection moving, undo & redo

// No wonder i have such rendering lag, i'm re-rendering everything from the root every frame, why didn't i just re-render the things that changed?
// tbh probs cause many things can depend on a single value and it's easier to re-render everything than to keep track of what depends on what

export function App() {
    const [widgetSize, setWidgetSize] = useState(GetWindow(Windows.Lumina)!.AbsoluteSize);
    const [zoomScale, setZoomScale] = useState(1);
    const [nodeSelectionPosition, setNodeSelectionPosition] = useState(undefined as UDim2 | undefined);
    const [_, setForceRender] = useState(0);

    const canvasRef = useRef(undefined as Frame | undefined);
    const canvasDataRef = useRef(GetCanvasData());

    const StartMoveCanvas = () => {
        const mousePositionVec2 = GetMousePosition();
        const widgetSize = GetWindow(Windows.Lumina)!.AbsoluteSize.mul(0.5);

        const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);
        const mouseOffset = mousePosition
            .sub(canvasDataRef.current.Position)
            .add(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

        RunService.BindToRenderStep("MoveCanvas", Enum.RenderPriority.Input.Value, () => MoveCanvas(mouseOffset));
    };

    const EndMoveCanvas = () => {
        RunService.UnbindFromRenderStep("MoveCanvas");
    };

    const MoveCanvas = (mouseOffset: UDim2) => {
        const mousePositionVec2 = GetMousePosition();

        const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);
        const newPosition = mousePosition.sub(mouseOffset);

        const canvasData = GetCanvasData();
        const newCanvasPosition = UDim2.fromOffset(widgetSize.X * 0.5, widgetSize.Y * 0.5).add(newPosition);

        if (canvasData.Position !== newCanvasPosition) {
            UpdateCanvasData((canvasData) => {
                canvasData.Position = newCanvasPosition;
                canvasData.Size = UDim2.fromOffset(widgetSize.X, widgetSize.Y).add(
                    UDim2.fromOffset(math.abs(newPosition.X.Offset) * 2, math.abs(newPosition.Y.Offset) * 2),
                );

                return canvasData;
            });
        }
    };

    const adjustCanvasPositionAfterZoom = (oldZoom: number, newZoom: number) => {
        // i hate making zooming to mouse
        const mousePosition = GetMousePositionOnCanvas();
        const newMousePosition = mousePosition.div(oldZoom).mul(newZoom);
        const delta = newMousePosition.sub(mousePosition);

        UpdateCanvasData((canvasData) => {
            canvasData.Position = UDim2.fromOffset(
                canvasData.Position.X.Offset - delta.X,
                canvasData.Position.Y.Offset - delta.Y,
            );

            canvasData.Size = UDim2.fromOffset(widgetSize.X, widgetSize.Y).add(
                UDim2.fromOffset(
                    math.abs(canvasData.Position.X.Offset - widgetSize.X * 0.5) * 2,
                    math.abs(canvasData.Position.Y.Offset - widgetSize.Y * 0.5) * 2,
                ),
            );

            return canvasData;
        });
    };

    const UpdateZoom = (inputObject: InputObject) => {
        if (inputObject.Position.Z > 0) {
            const oldZoom = GetZoomScale();
            const newZoom = UpdateZoomScale(0.1);
            adjustCanvasPositionAfterZoom(oldZoom, newZoom);
        } else if (inputObject.Position.Z < 0) {
            const oldZoom = GetZoomScale();
            const newZoom = UpdateZoomScale(-0.1);
            adjustCanvasPositionAfterZoom(oldZoom, newZoom);
        }
    };

    useEffect(() => {
        const widgetSizeChangedConnection = WidgetSizeChanged.Connect((newSize) => {
            setWidgetSize(newSize as Vector2);

            UpdateCanvasData((canvasData) => {
                canvasData.Position = UDim2.fromOffset(newSize.X * 0.5, newSize.Y * 0.5);
                canvasData.Size = UDim2.fromOffset(newSize.X, newSize.Y);
                return canvasData;
            });
        });

        const zoomChangedConnection = ZoomScaleChanged.Connect((zoom) => {
            setZoomScale(zoom as number);
        });

        const canvasDataChangedConnection = CanvasDataChanged.Connect(() => {
            setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
        });

        const nodeSystemsChangedConnection = NodeSystemsChanged.Connect(() => {
            setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
        });

        const nodesChangedConnection = NodesChanged.Connect(() => {
            setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
        });

        const connectionsChangedConnection = ConnectionsChanged.Connect(() => {
            setForceRender((prevValue) => (prevValue > 10 ? 0 : ++prevValue));
        });

        UpdateCanvasData((canvasData) => {
            canvasData.Position = UDim2.fromOffset(widgetSize.X * 0.5, widgetSize.Y * 0.5);
            canvasData.Size = UDim2.fromOffset(widgetSize.X, widgetSize.Y);
            return canvasData;
        });

        return () => {
            widgetSizeChangedConnection.Disconnect();
            zoomChangedConnection.Disconnect();
            canvasDataChangedConnection.Disconnect();
            nodeSystemsChangedConnection.Disconnect();
            nodesChangedConnection.Disconnect();
            connectionsChangedConnection.Disconnect();
        };
    }, []);

    return (
        <>
            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={canvasDataRef.current.Position}
                Size={canvasDataRef.current.Size}
                BackgroundColor3={StyleColors.Background}
                Event={{
                    InputBegan: (_, input: InputObject) => {
                        if (input.KeyCode === Enum.KeyCode.Space) {
                            const mousePositionVec2 = GetMousePosition();
                            setNodeSelectionPosition(UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y));
                        } else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
                            UnbindMovingConnection(true);
                            setNodeSelectionPosition(undefined);
                        } else if (input.UserInputType === Enum.UserInputType.MouseButton3) {
                            setNodeSelectionPosition(undefined);
                        }
                    },
                }}
                key={"Background"}
                ref={canvasRef}
            >
                {/* Top Left */}
                <imagelabel
                    Position={UDim2.fromOffset(0, 0)}
                    Size={UDim2.fromOffset(
                        canvasDataRef.current.Size.X.Offset * 0.5,
                        canvasDataRef.current.Size.Y.Offset * 0.5,
                    )}
                    Rotation={180}
                    BackgroundTransparency={1}
                    // BackgroundTransparency={0.95}
                    // BackgroundColor3={Color3.fromRGB(255, 0, 0)}
                    Image={"rbxassetid://15952812715"} // alt: 15952811095
                    ImageTransparency={0.5}
                    ScaleType={"Tile"}
                    TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
                />
                {/* Bottom Right */}
                <imagelabel
                    Position={UDim2.fromOffset(
                        canvasDataRef.current.Size.X.Offset * 0.5,
                        canvasDataRef.current.Size.Y.Offset * 0.5,
                    )}
                    Size={UDim2.fromOffset(
                        canvasDataRef.current.Size.X.Offset * 0.5,
                        canvasDataRef.current.Size.Y.Offset * 0.5,
                    )}
                    BackgroundTransparency={1}
                    // BackgroundTransparency={0.95}
                    // BackgroundColor3={Color3.fromRGB(0, 255, 0)}
                    Image={"rbxassetid://15952812715"} // alt: 15952811095
                    ImageTransparency={0.5}
                    ScaleType={"Tile"}
                    TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
                />
                {/* Top Right */}
                <imagelabel
                    Position={
                        new UDim2(
                            0.5,
                            canvasDataRef.current.Size.X.Offset * 0.25 - canvasDataRef.current.Size.Y.Offset * 0.25,
                            0,
                            canvasDataRef.current.Size.Y.Offset * 0.25 - canvasDataRef.current.Size.X.Offset * 0.25,
                        )
                    }
                    Size={UDim2.fromOffset(
                        canvasDataRef.current.Size.Y.Offset * 0.5,
                        canvasDataRef.current.Size.X.Offset * 0.5,
                    )}
                    Rotation={270}
                    BackgroundTransparency={1}
                    // BackgroundTransparency={0.95}
                    // BackgroundColor3={Color3.fromRGB(0, 0, 255)}
                    Image={"rbxassetid://15952812715"} // alt: 15952811095
                    ImageTransparency={0.5}
                    ScaleType={"Tile"}
                    TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
                />
                {/* Bottom Left */}
                <imagelabel
                    Position={
                        new UDim2(
                            0,
                            canvasDataRef.current.Size.X.Offset * 0.25 - canvasDataRef.current.Size.Y.Offset * 0.25,
                            0.5,
                            canvasDataRef.current.Size.Y.Offset * 0.25 - canvasDataRef.current.Size.X.Offset * 0.25,
                        )
                    }
                    Size={UDim2.fromOffset(
                        canvasDataRef.current.Size.Y.Offset * 0.5,
                        canvasDataRef.current.Size.X.Offset * 0.5,
                    )}
                    Rotation={90}
                    BackgroundTransparency={1}
                    // BackgroundTransparency={0.95}
                    // BackgroundColor3={Color3.fromRGB(255, 0, 255)}
                    Image={"rbxassetid://15952812715"} // alt: 15952811095
                    ImageTransparency={0.5}
                    ScaleType={"Tile"}
                    TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
                />
                <frame
                    Size={UDim2.fromScale(1, 1)}
                    BackgroundTransparency={1}
                    Event={{
                        InputBegan: (element, inputObject: InputObject) => {
                            if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;
                            StartMoveCanvas();
                        },
                        InputEnded: (_, inputObject: InputObject) => {
                            if (inputObject.UserInputType !== Enum.UserInputType.MouseButton3) return;
                            EndMoveCanvas();
                        },
                        InputChanged: (_, inputObject: InputObject) => {
                            if (inputObject.UserInputType !== Enum.UserInputType.MouseWheel) return;
                            UpdateZoom(inputObject);
                        },
                    }}
                />
            </frame>
            {GetAllSystems().map((nodeSystem) => {
                return nodeSystem.create(nodeSystem.data);
            })}
            {GetAllNodes().map((node) => {
                if (node.data.node.connectedSystemId !== undefined) return undefined;
                return node.create(node.data);
            })}
            {GetAllConnections().map((connection) => {
                return connection.create(connection.data);
            })}
            {nodeSelectionPosition !== undefined && (
                <NodeSelection
                    key="NodeSelection"
                    Position={nodeSelectionPosition}
                    ToggleSelection={() => setNodeSelectionPosition(undefined)}
                />
            )}
            <Controls key={"Controls"} />
            {useMemo(
                () => (
                    <BasicTextLabel
                        key={"ZoomLabel"}
                        AnchorPoint={new Vector2(0, 1)}
                        Position={UDim2.fromScale(0, 1)}
                        Size={UDim2.fromOffset(50, 20)}
                        Text={`${math.round(GetZoomScale() * 100)}%`}
                        IsAffectedByZoom={false}
                        ZIndex={10}
                    />
                ),
                [zoomScale],
            )}
            <Div
                key={"ClickDetector"}
                ZIndex={2}
                onMouseButton1Up={() => {
                    SetDraggingNodeId(undefined);
                    RunService.UnbindFromRenderStep("MoveNode");
                }}
            />
        </>
    );
}
