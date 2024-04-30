import { NodeGroups } from "API/NodeGroup";
import { SetEmission } from "API/Nodes/Initialize/SetEmission";
import { SetLifetimeRandom } from "API/Nodes/Initialize/SetLifetimeRandom";
import { SetPosition } from "API/Nodes/Initialize/SetPosition";
import { SetRotationZRandom } from "API/Nodes/Initialize/SetRotationZRandom";
import { SetSizeRandom } from "API/Nodes/Initialize/SetSizeRandom";
import { SetVelocityRandom } from "API/Nodes/Initialize/SetVelocityRandom";
import { ParticlePlane } from "API/Nodes/Render/ParticlePlane";
import { ConstantSpawn } from "API/Nodes/Spawn/ConstantSpawn";
import { AddRotationZRandom } from "API/Nodes/Update/AddRotationZRandom";
import { Drag } from "API/Nodes/Update/Drag";
import { MultiplySizeOverLife } from "API/Nodes/Update/MultiplySizeOverLife";
import { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";
import { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";
import { CreateSetPosition } from "Components/Nodes/Initialize/SetPosition";
import { CreateSetRotationZRandom } from "Components/Nodes/Initialize/SetRotationZRandom";
import { CreateParticlePlane } from "Components/Nodes/Render/ParticlePlane";
import { CreateConstantSpawn } from "Components/Nodes/Spawn/ConstantSpawn";
import {
	CreateAddRotationZRandom,
	CreateDrag,
	CreateMultiplySizeOverLife,
	CreateSetColorOverLife,
	CreateSetEmission,
	CreateSetLifetimeRandom,
	CreateSetSizeRandom,
	CreateSetTransparencyOverLife,
	CreateSetVelocityRandom,
} from "Lists/NodesListNodeBarrel";
import { CreateEmptySystem } from "./CreateEmptySystem";

export function CreateFlameSystem() {
	const flameSystem = CreateEmptySystem();
	flameSystem.anchorPoint = new Vector2(-325, 0);
	flameSystem.finishedBindingGroups.Connect(() => {
		// spawn
		const constantSpawn = CreateConstantSpawn();
		(constantSpawn.node as ConstantSpawn).nodeFields.rate.SetNumber(60);
		constantSpawn.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Spawn]!(constantSpawn.node.id);
		});

		// init
		const setLifetimeRandom = CreateSetLifetimeRandom();
		(setLifetimeRandom.node as SetLifetimeRandom).nodeFields.range.SetVector2(0.8, 1.2);
		setLifetimeRandom.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Initialize]!(setLifetimeRandom.node.id);
		});

		const setPosition = CreateSetPosition();
		(setPosition.node as SetPosition).nodeFields.position.SetY(5);
		setPosition.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Initialize]!(setPosition.node.id);
		});

		const setSizeRandom = CreateSetSizeRandom();
		(setSizeRandom.node as SetSizeRandom).nodeFields.range.SetVector2(1, 2);
		setSizeRandom.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Initialize]!(setSizeRandom.node.id);
		});

		const setEmission = CreateSetEmission();
		(setEmission.node as SetEmission).nodeFields.emission.SetNumber(5);
		setEmission.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Initialize]!(setEmission.node.id);
		});

		const setRotationZRandom = CreateSetRotationZRandom();
		(setRotationZRandom.node as SetRotationZRandom).nodeFields.range.SetVector2(-360, 360);
		setRotationZRandom.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Initialize]!(setRotationZRandom.node.id);
		});

		const setVelocityRandom = CreateSetVelocityRandom();
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeX.SetVector2(-0.5, 0.5);
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeY.SetVector2(10, 15);
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeZ.SetVector2(-0.5, 0.5);
		setVelocityRandom.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Initialize]!(setVelocityRandom.node.id);
		});

		// upd
		const setColorOverLife = CreateSetColorOverLife();
		(setColorOverLife.node as SetColorOverLife).nodeFields.ramp.startPoint.color.SetHSV(0.15, 0.2, 1);
		(setColorOverLife.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.2, new Vector3(0.15, 0.85, 1));
		(setColorOverLife.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.45, new Vector3(0.01, 0.9, 1));
		(setColorOverLife.node as SetColorOverLife).nodeFields.ramp.AddPoint(0.8, new Vector3(0, 1, 0.1));
		(setColorOverLife.node as SetColorOverLife).nodeFields.ramp.endPoint.color.SetHSV(0, 0, 0);
		setColorOverLife.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Update]!(setColorOverLife.node.id);
		});

		const multiplySizeOverLife = CreateMultiplySizeOverLife();
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.startPoint.value = 0.5;
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.05, 1.5);
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.15, 2);
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.5, 1.5);
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.endPoint.value = 0.25;
		multiplySizeOverLife.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Update]!(multiplySizeOverLife.node.id);
		});

		const setTransparencyOverLife = CreateSetTransparencyOverLife();
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.startPoint.value = 1;
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.05, 0.75);
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.2, 0.25);
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.5, 0.25);
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.85, 0.4);
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.endPoint.value = 1;
		setTransparencyOverLife.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Update]!(setTransparencyOverLife.node.id);
		});

		const drag = CreateDrag();
		(drag.node as Drag).nodeFields.drag.SetNumber(2);
		drag.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Update]!(drag.node.id);
		});

		const addRotationZRandom = CreateAddRotationZRandom();
		(addRotationZRandom.node as AddRotationZRandom).nodeFields.range.SetVector2(-360, 360);
		addRotationZRandom.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Update]!(addRotationZRandom.node.id);
		});

		// rend
		const particlePlane = CreateParticlePlane();
		(particlePlane.node as ParticlePlane).nodeFields.assetId.SetNumber(14151781963);
		(particlePlane.node as ParticlePlane).nodeFields.imageSize.SetVector2(1024, 1024);
		(particlePlane.node as ParticlePlane).nodeFields.spriteSheetRows.SetNumber(4);
		(particlePlane.node as ParticlePlane).nodeFields.spriteSheetColumns.SetNumber(4);
		(particlePlane.node as ParticlePlane).nodeFields.spriteSheetFrameCount.SetNumber(16);
		particlePlane.elementLoaded.Connect(() => {
			flameSystem.addToNodeGroup[NodeGroups.Render]!(particlePlane.node.id);
		});
	});

	const smokeSystem = CreateEmptySystem();
	smokeSystem.anchorPoint = new Vector2(25, 0);
	smokeSystem.finishedBindingGroups.Connect(() => {
		// spwn
		const constantSpawn = CreateConstantSpawn();
		(constantSpawn.node as ConstantSpawn).nodeFields.rate.SetNumber(20);
		constantSpawn.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Spawn]!(constantSpawn.node.id);
		});

		// init
		const setLifetimeRandom = CreateSetLifetimeRandom();
		(setLifetimeRandom.node as SetLifetimeRandom).nodeFields.range.SetVector2(0.75, 1.5);
		setLifetimeRandom.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Initialize]!(setLifetimeRandom.node.id);
		});

		const setPosition = CreateSetPosition();
		(setPosition.node as SetPosition).nodeFields.position.SetY(5);
		setPosition.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Initialize]!(setPosition.node.id);
		});

		const setVelocityRandom = CreateSetVelocityRandom();
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeX.SetVector2(-0.4, 0.4);
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeY.SetVector2(15, 20);
		(setVelocityRandom.node as SetVelocityRandom).nodeFields.rangeZ.SetVector2(-0.4, 0.4);
		setVelocityRandom.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Initialize]!(setVelocityRandom.node.id);
		});

		const setRotationZRandom = CreateSetRotationZRandom();
		(setRotationZRandom.node as SetRotationZRandom).nodeFields.range.SetVector2(-360, 360);
		setRotationZRandom.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Initialize]!(setRotationZRandom.node.id);
		});

		const setEmission = CreateSetEmission();
		(setEmission.node as SetEmission).nodeFields.emission.SetNumber(0);
		setEmission.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Initialize]!(setEmission.node.id);
		});

		const setSizeRandom = CreateSetSizeRandom();
		(setSizeRandom.node as SetSizeRandom).nodeFields.range.SetVector2(1, 2);
		setSizeRandom.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Initialize]!(setSizeRandom.node.id);
		});

		// upd
		const setTransparencyOverLife = CreateSetTransparencyOverLife();
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.startPoint.value = 1;
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.1, 1);
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.4, 0.8);
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.AddPoint(0.75, 0.85);
		(setTransparencyOverLife.node as SetTransparencyOverLife).nodeFields.graph.endPoint.value = 1;
		setTransparencyOverLife.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Update]!(setTransparencyOverLife.node.id);
		});

		const drag = CreateDrag();
		(drag.node as Drag).nodeFields.drag.SetNumber(2.5);
		drag.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Update]!(drag.node.id);
		});

		const multiplySizeOverLife = CreateMultiplySizeOverLife();
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.startPoint.value = 0;
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.2, 2);
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.4, 2);
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.AddPoint(0.6, 1);
		(multiplySizeOverLife.node as MultiplySizeOverLife).nodeFields.graph.endPoint.value = 0.5;
		multiplySizeOverLife.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Update]!(multiplySizeOverLife.node.id);
		});

		const addRotationZRandom = CreateAddRotationZRandom();
		(addRotationZRandom.node as AddRotationZRandom).nodeFields.range.SetVector2(-180, 180);
		addRotationZRandom.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Update]!(addRotationZRandom.node.id);
		});

		//rend
		const particlePlane = CreateParticlePlane();
		(particlePlane.node as ParticlePlane).nodeFields.assetId.SetNumber(14151754389);
		(particlePlane.node as ParticlePlane).nodeFields.imageSize.SetVector2(1024, 1024);
		(particlePlane.node as ParticlePlane).nodeFields.spriteSheetRows.SetNumber(4);
		(particlePlane.node as ParticlePlane).nodeFields.spriteSheetColumns.SetNumber(4);
		(particlePlane.node as ParticlePlane).nodeFields.spriteSheetFrameCount.SetNumber(16);
		particlePlane.elementLoaded.Connect(() => {
			smokeSystem.addToNodeGroup[NodeGroups.Render]!(particlePlane.node.id);
		});
	});

	return [flameSystem, smokeSystem];
}
