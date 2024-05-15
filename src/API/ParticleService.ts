import { IdPool } from "./IdPool";
import { UpdateNode } from "./Nodes/Update/UpdateNode";

// OPTIMIZE: mem leak? array only continues to grow

export enum ParticleTypes {
    OneSidedPlane = 1,
    DoubleSidedPlane = 2,
    Cube = 3,
}

export interface ParticleData {
    particleId: number;

    particleType: ParticleTypes;
    particle: BasePart;
    spawnTime: number;
    lifetime: number; // total time particle stays alive
    alivetime: number; // how long particle has been alive

    sizeNormal: Vector3;
    sizeMultiplier: Vector3;
    velocityNormal: Vector3;
    velocityMultiplier: Vector3;

    rotation: Vector3;
    transparency: number;
    color: Color3;
    emission: number;

    spriteSheetFrame: number;

    updateNodes: UpdateNode[];
}

const idPool = new IdPool();
const particleData: { [key: number]: ParticleData } = {};

export function GetNextParticleId() {
    return idPool.GetNextId();
}

export function CreateParticleData(
    particleId: number,
    particleType: ParticleTypes,
    particle: BasePart,
    updateNodes: UpdateNode[],
): ParticleData {
    return (particleData[particleId] = {
        particleId,
        particleType,
        particle,
        spawnTime: os.clock(),
        lifetime: 0,
        alivetime: 0,
        spriteSheetFrame: 0,
        emission: 1,
        sizeNormal: new Vector3(1, 1, 1),
        sizeMultiplier: Vector3.zero,
        velocityNormal: Vector3.zero,
        velocityMultiplier: Vector3.one,
        rotation: Vector3.zero,
        transparency: 0,
        color: new Color3(1, 1, 1),
        updateNodes,
    });
}

export function GetParticleData(id: number) {
    return particleData[id];
}

export function ClearParticleData(id: number) {
    delete particleData[id];
}
