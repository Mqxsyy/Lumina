import { IdPool } from "./IdPool";
import { DoubleSidedPlaneParticle, OneSidedPlaneParticle } from "./Nodes/Render/ParticlePlane";

// OPTIMIZE: mem leak? array only continues to grow

export enum ParticleTypes {
    OneSidedPlane = 1,
    DoubleSidedPlane = 2,
}

export interface ParticleData {
    particleType: ParticleTypes;
    particle: OneSidedPlaneParticle | DoubleSidedPlaneParticle;
    spawnTime: number;
    lifetime: number;
    aliveTimePercent: number;

    sizeNormal: Vector3;
    sizeMultiplier: Vector3;
    velocity: Vector3;
    rotation: Vector3;
    transparency: number;
    color: Color3;
    emission: number;

    spriteSheetFrame: number;
}

const idPool = new IdPool();
const particleData: { [key: number]: ParticleData } = {};

export function GetNextParticleId() {
    return idPool.GetNextId();
}

export function CreateParticleData(
    particleType: ParticleTypes,
    id: number,
    particle: OneSidedPlaneParticle | DoubleSidedPlaneParticle,
): ParticleData {
    return (particleData[id] = {
        particleType,
        particle,
        spawnTime: os.clock(),
        lifetime: 0,
        aliveTimePercent: 0,
        spriteSheetFrame: 0,
        emission: 0,
        sizeNormal: new Vector3(1, 1, 1),
        sizeMultiplier: new Vector3(0, 0, 0),
        velocity: Vector3.zero,
        rotation: Vector3.zero,
        transparency: 0,
        color: new Color3(1, 1, 1),
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
