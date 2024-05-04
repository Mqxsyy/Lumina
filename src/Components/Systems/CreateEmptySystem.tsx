import React from "@rbxts/react";
import { NodeSystem as NodeSystemAPI } from "API/NodeSystem";
import { GetCanvasData } from "Services/CanvasService";
import { AddSystem } from "Services/NodeSystemService";
import NodeSystem from "./NodeSystem";

export function CreateEmptySystem(position?: Vector2) {
    return AddSystem(
        new NodeSystemAPI(),
        "Empty System",
        (systemData) => (
            <NodeSystem
                key={`system_${systemData.id}`}
                anchorPoint={systemData.anchorPoint}
                canvasPosition={GetCanvasData().Position}
                systemId={systemData.id}
                systemAPI={systemData.system}
                systemDestroyEvent={systemData.onDestroy}
            />
        ),
        position,
    );
}
