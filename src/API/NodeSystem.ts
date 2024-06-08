import { RunService } from "@rbxts/services";
import { IdPool } from "./IdPool";
import { NodeGroup, NodeGroups } from "./NodeGroup";
import type { InitializeNode } from "./Nodes/Initialize/InitializeNode";
import type { Node } from "./Nodes/Node";
import type { RenderNode } from "./Nodes/Render/RenderNode";
import { BurstSpawn } from "./Nodes/Spawn/BurstSpawn";
import { ConstantSpawn } from "./Nodes/Spawn/ConstantSpawn";
import type { SpawnNode } from "./Nodes/Spawn/SpawnNode";
import type { UpdateNode } from "./Nodes/Update/UpdateNode";

if (!RunService.IsStudio()) {
    print(
        "This game utilizes a free custom particle system and plugin called 'Lumina' to easily create visual effects. Plugin can be found in the toolbox or creator store for absolutely FREE.",
    );
}

export class NodeSystem {
    ParticleIdPool = new IdPool();

    NodeGroups: { [key in NodeGroups]: NodeGroup<Node> };
    SpawnConnection: RBXScriptConnection | undefined;
    SpawnRateChangedConnection: RBXScriptConnection | undefined;

    spawnNode: SpawnNode | undefined;
    initializeNodes: InitializeNode[] = [];
    updateNodes: UpdateNode[] = [];
    renderNode: RenderNode | undefined;

    constructor() {
        this.NodeGroups = {
            [NodeGroups.Spawn]: new NodeGroup<SpawnNode>(),
            [NodeGroups.Initialize]: new NodeGroup<InitializeNode>(),
            [NodeGroups.Update]: new NodeGroup<UpdateNode>(),
            [NodeGroups.Render]: new NodeGroup<RenderNode>(),
            [NodeGroups.Logic]: undefined as never,
        };
    }

    AddNode(node: Node, nodeGroup: NodeGroups) {
        this.NodeGroups[nodeGroup].AddNode(node);
        this.UpdateNodes();
    }

    RemoveNode(node: Node, nodeGroup: NodeGroups) {
        this.NodeGroups[nodeGroup].RemoveNode(node);
        this.UpdateNodes();
    }

    UpdateNodes() {
        let restart = false;

        if (this.SpawnConnection !== undefined) {
            this.Stop();
            restart = true;
        }

        this.ResetNodes();

        this.UpdateSpawnNodes();
        this.UpdateInitializeNodes();
        this.UpdateUpdateNodes();
        this.UpdateRenderNodes();

        if (restart) {
            this.Run();
        }
    }

    Run() {
        if (this.SpawnConnection !== undefined) {
            warn("System already running.");
            return;
        }

        if (this.spawnNode && this.renderNode) {
            if (this.spawnNode.GetClassName() === ConstantSpawn.className) {
                let passedTime = 0;

                this.SpawnConnection = RunService.RenderStepped.Connect((dt) => {
                    passedTime += dt;

                    const interval = 1 / (this.spawnNode as SpawnNode).GetValue();
                    while (passedTime >= interval) {
                        this.SpawnParticle();
                        passedTime -= interval;
                    }
                });
            } else if (this.spawnNode.GetClassName() === BurstSpawn.className) {
                const amount = this.spawnNode.GetValue();
                const delay = (this.spawnNode as BurstSpawn).nodeFields.delay.GetNumber();

                task.spawn(() => {
                    for (let i = 0; i < amount; i++) {
                        this.SpawnParticle();
                        if (delay > 0) {
                            task.wait(delay);
                        }
                    }
                });
            }
        }
    }

    Stop() {
        if (this.SpawnConnection !== undefined) {
            this.SpawnConnection.Disconnect();
            this.SpawnConnection = undefined;
        }
    }

    private SpawnParticle() {
        task.spawn(() => {
            (this.renderNode as RenderNode).Render(this.initializeNodes, this.updateNodes);
        });
    }

    private ResetNodes() {
        this.spawnNode = undefined;
        this.initializeNodes = [];
        this.updateNodes = [];
        this.renderNode = undefined;
    }

    private UpdateSpawnNodes() {
        const spawnNodes = this.NodeGroups[NodeGroups.Spawn].GetNodes();

        if (spawnNodes.size() > 1) {
            warn("More than one node used, only one will be used.");
        }

        if (spawnNodes.size() >= 1) {
            this.spawnNode = spawnNodes[0] as SpawnNode;
        }
    }

    private UpdateInitializeNodes() {
        this.initializeNodes = this.NodeGroups[NodeGroups.Initialize].GetNodes() as InitializeNode[];
    }

    private UpdateUpdateNodes() {
        this.updateNodes = this.NodeGroups[NodeGroups.Update].GetNodes() as UpdateNode[];
    }

    private UpdateRenderNodes() {
        const renderNodes = this.NodeGroups[NodeGroups.Render].GetNodes();

        if (renderNodes.size() > 1) {
            warn("More than one node used, only one will be used.");
        }

        if (renderNodes.size() >= 1) {
            this.renderNode = renderNodes[0] as RenderNode;
        }
    }
}
