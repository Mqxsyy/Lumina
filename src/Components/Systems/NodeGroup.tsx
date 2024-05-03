import React, { useEffect, useRef, useState } from "@rbxts/react";
import { Event } from "API/Bindables/Event";
import { NodeGroups } from "API/NodeGroup";
import { NodeSystem } from "API/NodeSystem";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetDraggingNodeId } from "Services/DraggingService";
import { BindNodeGroupFunction, NodeSystemData, NodeSystemsChanged } from "Services/NodeSystemService";
import { GetNodeById, NodeCollectionEntry, RemoveNode } from "Services/NodesService";
import { StyleColors } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import Div from "../Div";
import { GROUP_BORDER_THICKNESS, GROUP_HEADER_HEIGHT, GROUP_LIST_PADDING, GROUP_PADDING } from "../SizeConfig";

// TODO: add node reordering

interface Props {
    SystemId: number;
    SystemAPI: NodeSystem;
    SystemDestroyEvent: Event<[NodeSystemData]>;
    NodeGroup: NodeGroups;
    GradientStart: Color3;
    GradientEnd: Color3;
}

function NodeGroup({ SystemId, SystemAPI, SystemDestroyEvent, NodeGroup, GradientStart, GradientEnd }: Props) {
    const [childNodes, setChildNodes] = useState([] as NodeCollectionEntry[]);
    const [zoomScale, setZoomScale] = useState(GetZoomScale());

    const nodeDestroyConnectionsRef = useRef<{ [key: number]: RBXScriptConnection }>({});
    const isDestroyingRef = useRef(false);

    const onHover = () => {
        const draggingNodeId = GetDraggingNodeId();
        if (draggingNodeId !== undefined) {
            addChildNode(draggingNodeId);
        }
    };

    const addChildNode = (id: number) => {
        const node = GetNodeById(id)!;

        if (node.data.node.nodeGroup !== NodeGroup) return;

        setChildNodes((prev) => [...prev, node]);

        node.data.node.ConnectToSystem(SystemId);
        SystemAPI.AddNode(node.data.node);

        nodeDestroyConnectionsRef.current[id] = node.data.onDestroy.Connect((nodeData) => {
            nodeDestroyConnectionsRef.current[id].Disconnect();
            delete nodeDestroyConnectionsRef.current[id];

            SystemAPI.RemoveNode(nodeData.node);
            setChildNodes((prev) => prev.filter((n) => n.data.node.id !== id));
        });

        NodeSystemsChanged.Fire();
    };

    const onUnhover = () => {
        const nodeId = GetDraggingNodeId();
        if (nodeId !== undefined) {
            const node = childNodes.find((n) => n.data.node.id === nodeId);

            if (node !== undefined) {
                setChildNodes((prev) => prev.filter((n) => n.data.node.id !== nodeId));
                node.data.node.RemoveSystemConnection();
                SystemAPI.RemoveNode(node.data.node);

                if (nodeDestroyConnectionsRef.current[nodeId] !== undefined) {
                    nodeDestroyConnectionsRef.current[nodeId].Disconnect();
                    delete nodeDestroyConnectionsRef.current[nodeId];
                }
            }
        }
    };

    useEffect(() => {
        const destroyConnection = SystemDestroyEvent.Connect(() => {
            destroyConnection.Disconnect();
            isDestroyingRef.current = true;
            childNodes.forEach((node) => {
                RemoveNode(node.data.node.id);
            });
        });

        const zoomChangedConnection = ZoomScaleChanged.Connect((newScale) => {
            setZoomScale(newScale);
        });

        BindNodeGroupFunction(SystemId, NodeGroup, addChildNode);

        return () => {
            for (const [_, connection] of pairs(nodeDestroyConnectionsRef.current)) {
                connection.Disconnect();
            }

            destroyConnection.Disconnect();
            zoomChangedConnection.Disconnect();
        };
    }, []);

    return (
        <Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"} onHover={onHover} onUnhover={onUnhover}>
            <Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
                <uipadding
                    PaddingLeft={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
                    PaddingRight={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
                    PaddingTop={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
                    PaddingBottom={new UDim(0, GROUP_BORDER_THICKNESS * zoomScale)}
                />

                <Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
                    <uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
                    <uilistlayout
                        Padding={new UDim(0, GROUP_LIST_PADDING * zoomScale)}
                        HorizontalAlignment={"Center"}
                    />
                    <uistroke
                        Color={StyleColors.FullWhite}
                        Thickness={math.clamp(GROUP_BORDER_THICKNESS * zoomScale, 0.5, math.huge)}
                        Transparency={0.35}
                    >
                        <uigradient
                            Rotation={90}
                            Color={
                                new ColorSequence([
                                    new ColorSequenceKeypoint(0, GradientStart),
                                    new ColorSequenceKeypoint(1, GradientEnd),
                                ])
                            }
                        />
                    </uistroke>
                    <uipadding
                        PaddingLeft={new UDim(0, GROUP_PADDING * zoomScale)}
                        PaddingRight={new UDim(0, GROUP_PADDING * zoomScale)}
                        PaddingTop={new UDim(0, GROUP_PADDING * zoomScale)}
                        PaddingBottom={new UDim(0, GROUP_PADDING * zoomScale)}
                    />

                    <BasicTextLabel Size={new UDim2(1, 0, 0, GROUP_HEADER_HEIGHT)} Text={NodeGroups[NodeGroup]} />
                    <Div Size={UDim2.fromScale(1, 0)} AutomaticSize="Y">
                        <uilistlayout HorizontalAlignment={"Center"} Padding={new UDim(0, 5 * zoomScale)} />
                        {childNodes.map((node) => {
                            return node.create(node.data);
                        })}
                    </Div>
                </Div>
            </Div>
        </Div>
    );
}

export default React.memo(NodeGroup);
