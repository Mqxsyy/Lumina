import React, { useEffect, useRef, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import type { FastEvent, FastEventConnection } from "API/Bindables/FastEvent";
import { NodeGroups } from "API/NodeGroup";
import type { NodeSystem } from "API/NodeSystem";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { GetDraggingNodeId } from "Services/DraggingService";
import { BindNodeGroupFunction, type NodeSystemData, NodeSystemsChanged } from "Services/NodeSystemService";
import { GetNodeById, type NodeCollectionEntry, RemoveNode, UpdateNodeData } from "Services/NodesService";
import { StyleColors } from "Style";
import { GetMousePosition } from "Windows/MainWindow";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import Div from "../Div";
import { GROUP_BORDER_THICKNESS, GROUP_HEADER_HEIGHT, GROUP_LIST_PADDING, GROUP_PADDING } from "../SizeConfig";

// TODO: add node reordering

interface Props {
    SystemId: number;
    SystemAPI: NodeSystem;
    SystemDestroyEvent: FastEvent<[NodeSystemData]>;
    NodeGroup: NodeGroups;
    GradientStart: Color3;
    GradientEnd: Color3;
}

function NodeGroup({ SystemId, SystemAPI, SystemDestroyEvent, NodeGroup, GradientStart, GradientEnd }: Props) {
    const [childNodes, setChildNodes] = useState<NodeCollectionEntry[]>([]);
    const childNodesRef = useRef<NodeCollectionEntry[]>([]);

    const [zoomScale, setZoomScale] = useState(GetZoomScale());

    const nodeDestroyConnectionsRef = useRef<{
        [key: number]: FastEventConnection;
    }>({});
    const nodePositionCheckerConnectionRef = useRef<RBXScriptConnection | undefined>(undefined);

    const addToChildNodes = (node: NodeCollectionEntry) => {
        setChildNodes((prev) => [...prev, node]);
        childNodesRef.current.push(node);
        updateChildNodesOrders();
    };

    const removeFromChildNodes = (id: number) => {
        setChildNodes((prev) => prev.filter((n) => n.data.node.id !== id));
        childNodesRef.current = childNodesRef.current.filter((n) => n.data.node.id !== id);
        updateChildNodesOrders();
    };

    const swapChildNodes = (index1: number, id: number) => {
        const index2 = childNodesRef.current.findIndex((n) => n.data.node.id === id);

        const tempNode = childNodesRef.current[index2];

        childNodesRef.current[index2] = childNodesRef.current[index1];
        childNodesRef.current[index1] = tempNode;

        setChildNodes([...childNodesRef.current]);
        childNodesRef.current = [...childNodesRef.current];

        updateChildNodesOrders();
    };

    const updateChildNodesOrders = () => {
        for (let i = 0; i < childNodesRef.current.size(); i++) {
            const node = childNodesRef.current[i];
            UpdateNodeData(node.data.node.id, (data) => {
                data.order = i;
                return data;
            });
        }
    };

    const onHover = () => {
        const draggingNodeId = GetDraggingNodeId();
        if (draggingNodeId !== undefined) {
            addChildNode(draggingNodeId);
        }

        if (nodePositionCheckerConnectionRef.current !== undefined) return;

        nodePositionCheckerConnectionRef.current = RunService.RenderStepped.Connect(checkDraggingSorting);
    };

    const checkDraggingSorting = () => {
        const draggingNodeId = GetDraggingNodeId();
        if (draggingNodeId === undefined) return;

        if (childNodesRef.current.findIndex((n) => n.data.node.id === draggingNodeId) === -1) return;

        const draggingNode = GetNodeById(draggingNodeId) as NodeCollectionEntry;

        const mousePosition = GetMousePosition();
        for (let i = 0; i < childNodesRef.current.size(); i++) {
            const targetNode = childNodesRef.current[i];

            if (targetNode.data.node.id === draggingNodeId) continue;
            const y = (targetNode.element as ImageButton).AbsolutePosition.Y + (targetNode.element as ImageButton).AbsoluteSize.Y * 0.5;

            if (
                (targetNode.element as ImageButton).AbsolutePosition.Y < (draggingNode.element as ImageButton).AbsolutePosition.Y &&
                mousePosition.Y < y
            ) {
                swapChildNodes(i, draggingNodeId);
                return;
            }

            if (
                (targetNode.element as ImageButton).AbsolutePosition.Y > (draggingNode.element as ImageButton).AbsolutePosition.Y &&
                mousePosition.Y > y
            ) {
                swapChildNodes(i, draggingNodeId);
                return;
            }
        }
    };

    const addChildNode = (id: number) => {
        const node = GetNodeById(id);
        if (node === undefined) return;

        if (node.data.node.nodeGroup !== NodeGroup) return;

        addToChildNodes(node);

        node.data.node.ConnectToSystem(SystemId);
        SystemAPI.AddNode(node.data.node);

        nodeDestroyConnectionsRef.current[id] = node.data.onDestroy.Connect((nodeData) => {
            nodeDestroyConnectionsRef.current[id].Disconnect();
            delete nodeDestroyConnectionsRef.current[id];

            SystemAPI.RemoveNode(nodeData.node);
            removeFromChildNodes(id);
        });

        NodeSystemsChanged.Fire();
    };

    const onUnhover = () => {
        const nodeId = GetDraggingNodeId();
        if (nodeId !== undefined) {
            const node = childNodes.find((n) => n.data.node.id === nodeId);

            if (node !== undefined) {
                removeFromChildNodes(nodeId);

                node.data.node.RemoveSystemConnection();
                SystemAPI.RemoveNode(node.data.node);

                if (nodeDestroyConnectionsRef.current[nodeId] !== undefined) {
                    nodeDestroyConnectionsRef.current[nodeId].Disconnect();
                    delete nodeDestroyConnectionsRef.current[nodeId];
                }
            }
        }

        if (nodePositionCheckerConnectionRef.current !== undefined) {
            nodePositionCheckerConnectionRef.current.Disconnect();
            nodePositionCheckerConnectionRef.current = undefined;
        }
    };

    useEffect(() => {
        const zoomChangedConnection = ZoomScaleChanged.Connect((newScale) => {
            setZoomScale(newScale);
        });

        BindNodeGroupFunction(SystemId, NodeGroup, addChildNode);

        return () => {
            for (const [_, connection] of pairs(nodeDestroyConnectionsRef.current)) {
                connection.Disconnect();
            }

            zoomChangedConnection.Disconnect();
        };
    }, []);

    useEffect(() => {
        let destroyConnection: FastEventConnection | undefined = SystemDestroyEvent.Connect(() => {
            if (destroyConnection === undefined) return;
            destroyConnection = destroyConnection.Disconnect();

            for (const childNode of childNodes) {
                RemoveNode(childNode.data.node.id);
            }
        });

        return () => {
            if (destroyConnection === undefined) return;
            destroyConnection = destroyConnection.Disconnect();
        };
    }, [childNodes]);

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
                    <uilistlayout Padding={new UDim(0, GROUP_LIST_PADDING * zoomScale)} HorizontalAlignment={"Center"} />
                    <uistroke
                        Color={StyleColors.FullWhite}
                        Thickness={math.clamp(GROUP_BORDER_THICKNESS * zoomScale, 0.5, math.huge)}
                        Transparency={0.35}
                    >
                        <uigradient
                            Rotation={90}
                            Color={
                                new ColorSequence([new ColorSequenceKeypoint(0, GradientStart), new ColorSequenceKeypoint(1, GradientEnd)])
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
                        <uilistlayout HorizontalAlignment={"Center"} Padding={new UDim(0, 5 * zoomScale)} SortOrder={Enum.SortOrder.Name} />
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
