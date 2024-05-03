import { IdPool } from "./IdPool";
import { PlaneParticle } from "./Nodes/Render/ParticlePlane";

interface ParticleData {
    particle: PlaneParticle;
    spawnTime: number;
    lifetime: number;
    aliveTimePercent: number;
    spriteSheetFrame: number;
    size: Vector3;
    velocity: Vector3;
}

const idPool = new IdPool();
const particleData: { [key: number]: ParticleData } = {};

export function GetNextParticleId() {
    return idPool.GetNextId();
}

export function CreateParticleData(id: number, particle: PlaneParticle) {
    return (particleData[id] = {
        particle,
        spawnTime: os.clock(),
        lifetime: 0,
        aliveTimePercent: 0,
        spriteSheetFrame: 0,
        size: new Vector3(1, 1, 1),
        velocity: Vector3.zero,
    });
}

export function GetParticleData(id: number) {
    return particleData[id];
}

export function UpdateParticleData(id: number, update: (data: ParticleData) => ParticleData) {
    particleData[id] = update(particleData[id]);
}

export function ClearParticleData(id: number) {
    delete particleData[id];
}
