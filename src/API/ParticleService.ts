import { FastEvent } from "./Bindables/FastEvent";
import { IdPool } from "./IdPool";
import { CFrameZero } from "./Lib";
import type { UpdateNode } from "./Nodes/Update/UpdateNode";

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
    nextPos: Vector3 | undefined;

    rotation: CFrame;
    transparency: number;
    color: Color3;
    emission: number;

    spriteSheetFrame: number;

    updateNodes: UpdateNode[];
    isRemoving: FastEvent;
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
    particleData[particleId] = {
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
        nextPos: undefined,
        rotation: CFrameZero,
        transparency: 0,
        color: new Color3(1, 1, 1),
        updateNodes,
        isRemoving: new FastEvent(),
    };

    return particleData[particleId];
}

export function GetParticleData(id: number) {
    return particleData[id];
}

export function ClearParticleData(id: number) {
    delete particleData[id];
}
