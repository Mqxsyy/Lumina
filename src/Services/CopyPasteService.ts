import { GetMousePositionOnCanvas } from "Windows/MainWindow";
import { GetZoomScale } from "ZoomScale";
import { GetSystemById, RemoveNodeSystem } from "./NodeSystemService";
import { GetNodeById, RemoveNode } from "./NodesService";
import { CreateNode, CreateSystem } from "./Saving/LoadService";
import { SerializedFloatingNode, SerializedSystem } from "./Saving/SaveData";
import { SerializeNode, SerializeSystem } from "./Saving/SaveService";
import { GetIsHoldingControl, GetSelectedNodeId, GetSelectedSystemId } from "./SelectionService";

let serializedNode: SerializedFloatingNode | undefined;
let serializedSystem: SerializedSystem | undefined;

export function Copy() {
    if (!GetIsHoldingControl()) return;

    const selectedNodeId = GetSelectedNodeId();
    if (selectedNodeId !== -1) {
        serializedSystem = undefined;
        serializedNode = LocalSerializeNode();
        return;
    }

    const selectedSystemId = GetSelectedSystemId();
    if (selectedSystemId !== -1) {
        serializedNode = undefined;
        serializedSystem = LocalSerializeSystem();
        return;
    }
}

export function Paste() {
    if (!GetIsHoldingControl()) return;

    if (serializedNode !== undefined) {
        LocalLoadNode(serializedNode);
        return;
    }

    if (serializedSystem !== undefined) {
        LocalLoadSystem(serializedSystem);
        return;
    }
}

export function Duplicate() {
    if (!GetIsHoldingControl()) return;

    const selectedNodeId = GetSelectedNodeId();
    if (selectedNodeId !== -1) {
        LocalLoadNode(LocalSerializeNode());
        return;
    }

    const selectedSystemId = GetSelectedSystemId();
    if (selectedSystemId !== -1) {
        LocalLoadSystem(LocalSerializeSystem());
        return;
    }
}

export function Cut() {
    if (!GetIsHoldingControl()) return;

    Copy();

    const selectedNodeId = GetSelectedNodeId();
    if (serializedNode !== undefined && selectedNodeId !== -1) {
        RemoveNode(selectedNodeId);
    }

    const selectedSystemId = GetSelectedSystemId();
    if (serializedSystem !== undefined && selectedSystemId !== -1) {
        RemoveNodeSystem(selectedSystemId);
    }
}

function LocalSerializeNode() {
    const data = GetNodeById(GetSelectedNodeId())!.data;

    return {
        ...SerializeNode(data.node, true),
        nodeGroup: data.node.nodeGroup,
        anchorPoint: { x: data.anchorPoint.X, y: data.anchorPoint.Y },
    };
}

function LocalSerializeSystem() {
    const data = GetSystemById(GetSelectedSystemId())!.data;
    return SerializeSystem(data);
}

function LocalLoadNode(serializedNode: SerializedFloatingNode) {
    CreateNode(serializedNode.nodeGroup, serializedNode.nodeName, serializedNode.fields);
}

function LocalLoadSystem(serializedSystem: SerializedSystem) {
    const mousePosition = GetMousePositionOnCanvas().div(GetZoomScale());
    serializedSystem.anchorPoint = { x: mousePosition.X, y: mousePosition.Y };
    CreateSystem(serializedSystem);
}