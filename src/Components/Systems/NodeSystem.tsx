import React, { useEffect, useMemo, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import type { FastEvent, FastEventConnection } from "API/Bindables/FastEvent";
import { NodeGroups } from "API/NodeGroup";
import type { NodeSystem as NodeSystemAPI } from "API/NodeSystem";
import { TextInput } from "Components/Basic/TextInput";
import { GetMousePosition, GetMousePositionOnCanvas } from "MainWindow";
import { GetSelectedSystemId, SetSelectSystemId, selectedSystemIdChanged } from "Services/SelectionService";
import { StyleColors } from "API/Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import {
    GetSystemById,
    type NodeSystemCollectioEntry,
    type NodeSystemData,
    RemoveNodeSystem,
    UpdateSystemData,
} from "../../Services/NodeSystemService";
import Div from "../Div";
import { SYSTEM_BORDER_THICKNESS, SYSTEM_HEADER_HEIGHT, SYSTEM_LIST_PADDING, SYSTEM_PADDING, SYSTEM_WIDTH } from "../SizeConfig";
import NodeGroup from "./NodeGroup";

const SYSTEM_SELECT_TIME = 0.1;

interface Props {
    anchorPoint: Vector2;
    canvasPosition: UDim2;
    systemId: number;
    systemAPI: NodeSystemAPI;
    systemDestroyEvent: FastEvent<[NodeSystemData]>;
}

function NodeSystem({ anchorPoint, canvasPosition, systemId, systemAPI, systemDestroyEvent }: Props) {
    const [_, setForceRender] = useState(0);
    const [zoomScale, setZoomScale] = useState(GetZoomScale());

    const mouseOffsetRef = useRef(new Vector2(0, 0));
    const selectingSystemTimeRef = useRef(0);
    const selectedSystemIdChangedConnectionRef = useRef<FastEventConnection>();

    const onMouseButton1Down = (element: TextButton) => {
        const mousePosition = GetMousePosition();
        mouseOffsetRef.current = element.AbsolutePosition.sub(mousePosition);

        selectingSystemTimeRef.current = os.clock();

        RunService.BindToRenderStep("MoveSystem", Enum.RenderPriority.Input.Value, () => {
            const mousePosition = GetMousePositionOnCanvas();
            const newAnchorPoint = mousePosition.add(mouseOffsetRef.current).div(zoomScale);

            if (anchorPoint !== newAnchorPoint) {
                UpdateSystemData(systemId, (systemData) => {
                    systemData.anchorPoint = newAnchorPoint;
                    return systemData;
                });
            }
        });
    };

    const onMouseButton1Up = () => {
        RunService.UnbindFromRenderStep("MoveSystem");

        if (os.clock() - selectingSystemTimeRef.current > SYSTEM_SELECT_TIME) return;

        SetSelectSystemId(systemId);
        setForceRender((prev) => prev + 1);

        if (selectedSystemIdChangedConnectionRef.current !== undefined) return;

        selectedSystemIdChangedConnectionRef.current = selectedSystemIdChanged.Connect((newSystemId) => {
            if (newSystemId !== systemId) {
                setForceRender((prev) => prev + 1);
                (selectedSystemIdChangedConnectionRef.current as FastEventConnection).Disconnect();
                selectedSystemIdChangedConnectionRef.current = undefined;
            }
        });
    };

    const onMouseButton2Down = () => {
        RemoveNodeSystem(systemId);
    };

    const getPosition = () => {
        const offsetFromCenter = anchorPoint.mul(zoomScale).add(new Vector2(SYSTEM_WIDTH * 0.5 * zoomScale, 0));
        const canvasPositionVec2 = new Vector2(canvasPosition.X.Offset, canvasPosition.Y.Offset);
        const position = canvasPositionVec2.add(offsetFromCenter);
        return UDim2.fromOffset(position.X, position.Y);
    };

    const getSystemName = () => {
        const data = GetSystemById(systemId) as NodeSystemCollectioEntry;
        return data.data.systemName;
    };

    const updateSystemName = (name: string) => {
        if (name === "") return "";

        UpdateSystemData(systemId, (systemData) => {
            systemData.systemName = name;
            return systemData;
        });
    };

    const updateSystemNameLostFocus = (name: string) => {
        if (name === "") return getSystemName();

        UpdateSystemData(systemId, (systemData) => {
            systemData.systemName = name;
            return systemData;
        });
    };

    useEffect(() => {
        const connection = ZoomScaleChanged.Connect((newScale) => {
            setZoomScale(newScale);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return (
        <textbutton
            Size={UDim2.fromOffset(SYSTEM_WIDTH * zoomScale, 0)}
            AutomaticSize={"Y"}
            AnchorPoint={new Vector2(0.5, 0)}
            Position={getPosition()}
            BackgroundTransparency={1}
            Text={""}
            Active={true}
            Event={{
                InputBegan: (element, inputObject) => {
                    if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
                        onMouseButton1Down(element);
                    } else if (inputObject.UserInputType === Enum.UserInputType.MouseButton2) {
                        onMouseButton2Down();
                    }
                },
                InputEnded: (_, inputObject) => {
                    if (inputObject.UserInputType === Enum.UserInputType.MouseButton1) {
                        onMouseButton1Up();
                    }
                },
            }}
        >
            <Div>
                <uipadding
                    PaddingLeft={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
                    PaddingRight={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
                    PaddingTop={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
                    PaddingBottom={new UDim(0, SYSTEM_BORDER_THICKNESS * zoomScale)}
                />
                {GetSelectedSystemId() === systemId && (
                    <>
                        <uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
                        <uistroke Thickness={math.clamp(3 * zoomScale, 1, math.huge)} Color={StyleColors.Selection} />
                    </>
                )}

                <Div>
                    <uistroke
                        Color={StyleColors.FullWhite}
                        Thickness={math.clamp(SYSTEM_BORDER_THICKNESS * zoomScale, 0.5, math.huge)}
                        Transparency={0.75}
                    >
                        <uigradient
                            Color={
                                new ColorSequence([
                                    new ColorSequenceKeypoint(0, StyleColors.SpawnGroup),
                                    new ColorSequenceKeypoint(1, StyleColors.RenderGroup),
                                ])
                            }
                            Rotation={90}
                        />
                    </uistroke>
                    <uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
                    <uipadding
                        PaddingBottom={new UDim(0, SYSTEM_PADDING * zoomScale)}
                        PaddingLeft={new UDim(0, SYSTEM_PADDING * zoomScale)}
                        PaddingRight={new UDim(0, SYSTEM_PADDING * zoomScale)}
                        PaddingTop={new UDim(0, SYSTEM_PADDING * zoomScale)}
                    />
                    <uilistlayout Padding={new UDim(0, 1 + SYSTEM_LIST_PADDING * zoomScale)} HorizontalAlignment={"Center"} />

                    {useMemo(
                        () => (
                            <TextInput
                                Size={new UDim2(1, 0, 0, SYSTEM_HEADER_HEIGHT)}
                                HideBackground={true}
                                Text={getSystemName()}
                                TextSize={20}
                                TextColor={StyleColors.White}
                                TextChanged={updateSystemName}
                                LostFocus={updateSystemNameLostFocus}
                            />
                        ),
                        [zoomScale],
                    )}

                    <NodeGroup
                        SystemId={systemId}
                        SystemAPI={systemAPI}
                        SystemDestroyEvent={systemDestroyEvent}
                        NodeGroup={NodeGroups.Spawn}
                        GradientStart={StyleColors.SpawnGroup}
                        GradientEnd={StyleColors.InitializeGroup}
                    />
                    <NodeGroup
                        SystemId={systemId}
                        SystemAPI={systemAPI}
                        SystemDestroyEvent={systemDestroyEvent}
                        NodeGroup={NodeGroups.Initialize}
                        GradientStart={StyleColors.InitializeGroup}
                        GradientEnd={StyleColors.MixedGroup}
                    />
                    <NodeGroup
                        SystemId={systemId}
                        SystemAPI={systemAPI}
                        SystemDestroyEvent={systemDestroyEvent}
                        NodeGroup={NodeGroups.Update}
                        GradientStart={StyleColors.MixedGroup}
                        GradientEnd={StyleColors.UpdateGroup}
                    />
                    <NodeGroup
                        SystemId={systemId}
                        SystemAPI={systemAPI}
                        SystemDestroyEvent={systemDestroyEvent}
                        NodeGroup={NodeGroups.Render}
                        GradientStart={StyleColors.UpdateGroup}
                        GradientEnd={StyleColors.RenderGroup}
                    />
                </Div>
            </Div>
        </textbutton>
    );
}

export default React.memo(NodeSystem);
