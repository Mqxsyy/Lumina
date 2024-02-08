import { BurstSpawn } from "./Nodes/Spawn/BurstSpawn";
import { NodeSystem } from "./NodeSystem";
import { ParticlePlane } from "./Nodes/Render/ParticlePlane";
import { Lifetime } from "./Nodes/Initialize/Lifetime";
import { StaticForce } from "./Nodes/Update/StaticForce";
import { Position } from "./Nodes/Initialize/Position";

let id = 0;

const nodeSystem = new NodeSystem();

nodeSystem.AddNode(new BurstSpawn(id++, 10));

nodeSystem.AddNode(new Lifetime(id++, 2));
nodeSystem.AddNode(new Position(id++, new Vector3(0, 0, 0)));

nodeSystem.AddNode(new StaticForce(id++, new Vector3(0, 1, 0), true));

nodeSystem.AddNode(new ParticlePlane(id++));

nodeSystem.Run();
