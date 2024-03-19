import { IdPool } from "./IdPool";
import { PlaneParticle } from "./Nodes/Render/ParticlePlane";

interface ParticleData {
	particle: PlaneParticle;
	lifetime: number;
	spawnTime: number;
}

const idPool = new IdPool();
const particleData: { [key: number]: ParticleData } = {};

export function GetNextParticleId() {
	return idPool.GetNextId();
}

export function CreateParticleData(id: number, particle: PlaneParticle) {
	return (particleData[id] = {
		particle: particle,
		lifetime: 0,
		spawnTime: os.clock(),
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
