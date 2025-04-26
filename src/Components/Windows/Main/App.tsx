import React, { StrictMode, useEffect, useMemo, useRef, useState } from "@rbxts/react";
import { createRoot } from "@rbxts/react-roblox";
import { RunService } from "@rbxts/services";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import Dropdown from "Components/Basic/Dropdown";
import Div from "Components/Div";
import { NodeSelection } from "Components/Selection/NodeSelection";
import Toolbar from "Components/Toolbar/Toolbar";
import { GetMousePosition, GetMousePositionOnCanvas, WidgetSizeChanged } from "MainWindow";
import { CanvasDataChanged, GetCanvasData, UpdateCanvasData } from "Services/CanvasService";
import { UnbindMovingConnection } from "Services/ConnectionsService";
import { Copy, Cut, Duplicate, Paste } from "Services/CopyPasteService";
import { SetDraggingNodeId } from "Services/DraggingService";
import { DisableDropdown, DropdownDataChanged, GetDropdownData } from "Services/DropdownService";
import { GetAllSystems, NodeSystemsChanged } from "Services/NodeSystemService";
import { GetAllNodes, NodesChanged } from "Services/NodesService";
import { LoadingFinished } from "Services/Saving/LoadService";
import { SetIsHoldingControl, SetSelectNodeId, SetSelectSystemId } from "Services/SelectionService";
import { GetWindow, Windows } from "Services/WindowSevice";
import { StyleColors } from "API/Style";
import { GetZoomScale, UpdateZoomScale } from "ZoomScale";
import CanvasBackground from "./Background";
import DisplayConnections from "./DisplayConnections";
import MainToolbar, { CloseMainToolbar } from "./MainToolbar";

// yes it's bad architecture (the way it handles rerenders) but too late to change :p

export function InitializeMain() {
    const window = GetWindow(Windows.Lumina);
    const root = createRoot(window);

    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}

export function App() {
    const [widgetSize, setWidgetSize] = useState(GetWindow(Windows.Lumina).AbsoluteSize);
    const [zoomScale, setZoomScale] = useState(1);
    const [nodeSelectionPosition, setNodeSelectionPosition] = useState(undefined as UDim2 | undefined);
    const [_, setForceRender] = useState(0);

    const canvasRef = useRef(undefined as Frame | undefined);
    const canvasDataRef = useRef(GetCanvasData());

    const dropdownData = GetDropdownData();

    const startMoveCanvas = () => {
        const mousePositionVec2 = GetMousePosition();
        const widgetSize = GetWindow(Windows.Lumina).AbsoluteSize.mul(0.5);

        const mousePosition = UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y);
        const mouseOffset = mousePosition.sub(canvasDataRef.current.Position).add(UDim2.fromOffset(widgetSize.X, widgetSize.Y));

        RunService.BindToRenderStep("MoveCanvas", Enum.RenderPriority.Input.Value, () => moveCanvas(mouseOffset));
    };

    const endMoveCanvas = () => {
        RunService.UnbindFromRenderStep("MoveCanvas");
    };

    const moveCanvas = (mouseOffset: UDim2) => {
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
            canvasData.Position = UDim2.fromOffset(canvasData.Position.X.Offset - delta.X, canvasData.Position.Y.Offset - delta.Y);

            canvasData.Size = UDim2.fromOffset(widgetSize.X, widgetSize.Y).add(
                UDim2.fromOffset(
                    math.abs(canvasData.Position.X.Offset - widgetSize.X * 0.5) * 2,
                    math.abs(canvasData.Position.Y.Offset - widgetSize.Y * 0.5) * 2,
                ),
            );

            return canvasData;
        });
    };

    const updateZoom = (inputObject: InputObject) => {
        if (inputObject.Position.Z > 0) {
            const oldZoom = GetZoomScale();
            const newZoom = UpdateZoomScale(0.1);
            adjustCanvasPositionAfterZoom(oldZoom, newZoom);
            setZoomScale(newZoom);
        } else if (inputObject.Position.Z < 0) {
            const oldZoom = GetZoomScale();
            const newZoom = UpdateZoomScale(-0.1);
            adjustCanvasPositionAfterZoom(oldZoom, newZoom);
            setZoomScale(newZoom);
        }

        DisableDropdown();
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

        const canvasDataChangedConnection = CanvasDataChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const nodeSystemsChangedConnection = NodeSystemsChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const nodesChangedConnection = NodesChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const dropdownDataChangedConnection = DropdownDataChanged.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        const loadServiceConnection = LoadingFinished.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        UpdateCanvasData((canvasData) => {
            canvasData.Position = UDim2.fromOffset(widgetSize.X * 0.5, widgetSize.Y * 0.5);
            canvasData.Size = UDim2.fromOffset(widgetSize.X, widgetSize.Y);
            return canvasData;
        });

        return () => {
            widgetSizeChangedConnection.Disconnect();
            canvasDataChangedConnection.Disconnect();
            nodeSystemsChangedConnection.Disconnect();
            nodesChangedConnection.Disconnect();
            dropdownDataChangedConnection.Disconnect();
            loadServiceConnection.Disconnect();
        };
    }, []);

    return (
        <>
            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={canvasDataRef.current.Position}
                Size={canvasDataRef.current.Size}
                BackgroundColor3={StyleColors.Background}
                key={"Background"}
                ref={canvasRef}
            >
                <CanvasBackground canvasSize={canvasDataRef.current.Size} />
                <Div
                    onMouseButton1Down={() => {
                        UnbindMovingConnection(true);
                        SetSelectNodeId(-1);
                        SetSelectSystemId(-1);
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
            <DisplayConnections />
            {nodeSelectionPosition !== undefined && (
                <NodeSelection
                    key="NodeSelection"
                    Position={nodeSelectionPosition}
                    ToggleSelection={() => setNodeSelectionPosition(undefined)}
                />
            )}
            {dropdownData.position !== undefined && <Dropdown key={"Dropdown"} />}
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
            <MainToolbar key={"Toolbar"} />
            <frame
                key={"InputListener"}
                Size={UDim2.fromScale(1, 1)}
                BackgroundTransparency={1}
                ZIndex={10}
                Event={{
                    InputBegan: (_, input: InputObject) => {
                        CloseMainToolbar.Fire();

                        switch (input.KeyCode) {
                            case Enum.KeyCode.Space: {
                                const mousePositionVec2 = GetMousePosition();
                                setNodeSelectionPosition(UDim2.fromOffset(mousePositionVec2.X, mousePositionVec2.Y));
                                return;
                            }
                            case Enum.KeyCode.LeftControl: {
                                SetIsHoldingControl(true);
                                return;
                            }
                            case Enum.KeyCode.C: {
                                Copy();
                                return;
                            }
                            case Enum.KeyCode.V: {
                                Paste();
                                return;
                            }
                            case Enum.KeyCode.D: {
                                Duplicate();
                                return;
                            }
                            case Enum.KeyCode.X: {
                                Cut();
                                return;
                            }
                        }

                        switch (input.UserInputType) {
                            case Enum.UserInputType.MouseButton1: {
                                setNodeSelectionPosition(undefined);
                                DisableDropdown();
                                return;
                            }
                            case Enum.UserInputType.MouseButton2: {
                                setNodeSelectionPosition(undefined);
                                DisableDropdown();
                                return;
                            }
                            case Enum.UserInputType.MouseButton3: {
                                setNodeSelectionPosition(undefined);
                                startMoveCanvas();
                                DisableDropdown();
                                return;
                            }
                        }
                    },

                    InputEnded: (_, input: InputObject) => {
                        switch (input.KeyCode) {
                            case Enum.KeyCode.LeftControl: {
                                SetIsHoldingControl(false);
                                return;
                            }
                        }

                        switch (input.UserInputType) {
                            case Enum.UserInputType.MouseButton1: {
                                SetDraggingNodeId(undefined);
                                RunService.UnbindFromRenderStep("MoveNode");
                                return;
                            }
                            case Enum.UserInputType.MouseButton3: {
                                endMoveCanvas();
                                return;
                            }
                        }
                    },

                    InputChanged: (_, input: InputObject) => {
                        switch (input.UserInputType) {
                            case Enum.UserInputType.MouseWheel: {
                                updateZoom(input);
                                return;
                            }
                        }
                    },
                }}
            />
        </>
    );
}
