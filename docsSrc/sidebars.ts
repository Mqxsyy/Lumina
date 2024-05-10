import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
    gettingStartedSidebar: ["gettingStarted/index"],
    nodesSidebar: [
        "nodes/intro",
        {
            type: "category",
            label: "Spawn nodes",
            items: ["nodes/spawn/constantSpawn", "nodes/spawn/burstSpawn"],
        },
        {
            type: "category",
            label: "Initialize nodes",
            items: [
                "nodes/initialize/setColor",
                "nodes/initialize/setEmission",
                "nodes/initialize/setLifetime",
                "nodes/initialize/setLifetimeRandom",
                "nodes/initialize/setPosition",
                "nodes/initialize/setRotationZ",
                "nodes/initialize/setRotationZRandom",
                "nodes/initialize/setSize",
                "nodes/initialize/setSizeRandom",
                "nodes/initialize/setTransparency",
                "nodes/initialize/setVelocity",
                "nodes/initialize/setVelocityRandom",
            ],
        },
        {
            type: "category",
            label: "Update nodes",
            items: [
                "nodes/update/accelerate",
                "nodes/update/addRotationZ",
                "nodes/update/addRotationZRandom",
                "nodes/update/addVelocity",
                "nodes/update/drag",
                "nodes/update/multiplySizeOverLife",
                "nodes/update/setColorOverLife",
                "nodes/update/setSizeOverLife",
                "nodes/update/setTransparencyOverLife",
            ],
        },
        {
            type: "category",
            label: "Render nodes",
            items: ["nodes/render/particlePlane"],
        },
        {
            type: "category",
            label: "Logic nodes",
            items: ["nodes/logic/randomNumber"],
        },
    ],
};

export default sidebars;
