import { MathOperationType, TrigonometryType } from "API/Nodes/FieldStates";
import { SetColor } from "API/Nodes/Mixed/SetColor";
import { SetLifetime } from "API/Nodes/Initialize/SetLifetime";
import { AliveTime } from "API/Nodes/Logic/Alivetime";
import { Clamp } from "API/Nodes/Logic/Clamp";
import { GetParentProperty } from "API/Nodes/Logic/GetParentProperty";
import { NumberMath } from "API/Nodes/Logic/NumberMath";
import { RandomNumber } from "API/Nodes/Logic/RandomNumber";
import { Remap } from "API/Nodes/Logic/Remap";
import { Shape } from "API/Nodes/Logic/Shape";
import { Time } from "API/Nodes/Logic/Time";
import { Trigonometry } from "API/Nodes/Logic/Trigonometry";
import { ValueOut } from "API/Nodes/Logic/ValueOut";
import { VectorMath } from "API/Nodes/Logic/VectorMath";
import { DirectVelocity } from "API/Nodes/Mixed/DirectVelocity";
import { Position } from "API/Nodes/Mixed/Position";
import { Rotation } from "API/Nodes/Mixed/Rotation";
import { SetEmission } from "API/Nodes/Mixed/SetEmission";
import { SetSize } from "API/Nodes/Mixed/SetSize";
import { SetTransparency } from "API/Nodes/Mixed/SetTransparency";
import { Velocity } from "API/Nodes/Mixed/Velocity";
import { MeshParticle } from "API/Nodes/Render/MeshParticle";
import { PlaneParticle } from "API/Nodes/Render/PlaneParticle";
import { VolumetricParticle } from "API/Nodes/Render/VolumetricParticle";
import type { SelectionEntry } from "API/Nodes/SelectionEntry";
import { BurstSpawn } from "API/Nodes/Spawn/BurstSpawn";
import { ConstantSpawn } from "API/Nodes/Spawn/ConstantSpawn";
import { Accelerate } from "API/Nodes/Update/Accelerate";
import { Bounce } from "API/Nodes/Update/Bounce";
import { Drag } from "API/Nodes/Update/Drag";
import { LookTowards } from "API/Nodes/Update/LookTowards";
import { MoveTowards } from "API/Nodes/Update/MoveTowards";
import { MultiplyRotationOverLife } from "API/Nodes/Update/MultiplyRotationOverLife";
import { MultiplySizeOverLife } from "API/Nodes/Update/MultiplySizeOverLife";
import { MultiplyVelocityOverLife } from "API/Nodes/Update/MultiplyVelocityOverLife";
import { SetColorOverLife } from "API/Nodes/Update/SetColorOverLife";
import { SetSizeOverLife } from "API/Nodes/Update/SetSizeOverLife";
import { SetTransparencyOverLife } from "API/Nodes/Update/SetTransparencyOverLife";
import { CreatePosition } from "Components/Nodes/Initialize/Position";
import { CreateSetColor } from "Components/Nodes/Mixed/SetColor";
import { CreateSetLifetime } from "Components/Nodes/Initialize/SetLifetime";
import { CreateAliveTime } from "Components/Nodes/Logic/AliveTime";
import { CreateClamp } from "Components/Nodes/Logic/Clamp";
import { CreateGetParentProperty } from "Components/Nodes/Logic/GetParentProperty";
import { CreateNumberMath } from "Components/Nodes/Logic/NumberMath";
import { CreateRandomNumber } from "Components/Nodes/Logic/RandomNumber";
import { CreateRemap } from "Components/Nodes/Logic/Remap";
import { CreateShape } from "Components/Nodes/Logic/Shape";
import { CreateTime } from "Components/Nodes/Logic/Time";
import { CreateTrigonometry } from "Components/Nodes/Logic/Trigonometry";
import { CreateValueOut } from "Components/Nodes/Logic/ValueOut";
import { CreateVectorMath } from "Components/Nodes/Logic/VectorMath";
import { CreateDirectVelocity } from "Components/Nodes/Mixed/DirectVelocity";
import { CreateRotation } from "Components/Nodes/Mixed/Rotation";
import { CreateSetEmission } from "Components/Nodes/Mixed/SetEmission";
import { CreateSetSize } from "Components/Nodes/Mixed/SetSize";
import { CreateSetTransparency } from "Components/Nodes/Mixed/SetTransparency";
import { CreateVelocity } from "Components/Nodes/Mixed/Velocity";
import { CreateMeshParticle } from "Components/Nodes/Render/MeshParticle";
import { CreatePlaneParticle } from "Components/Nodes/Render/PlaneParticle";
import { CreateVolumetricParticle } from "Components/Nodes/Render/VolumetricParticle";
import { CreateBurstSpawn } from "Components/Nodes/Spawn/BurstSpawn";
import { CreateConstantSpawn } from "Components/Nodes/Spawn/ConstantSpawn";
import { CreateAccelerate } from "Components/Nodes/Update/Accelerate";
import { CreateBounce } from "Components/Nodes/Update/Bounce";
import { CreateDrag } from "Components/Nodes/Update/Drag";
import { CreateLookTowards } from "Components/Nodes/Update/LookTowards";
import { CreateMoveTowards } from "Components/Nodes/Update/MoveTowards";
import { CreateMultiplyRotationOverLife } from "Components/Nodes/Update/MultiplyRotationOverLife";
import { CreateMultiplySizeOverLife } from "Components/Nodes/Update/MultiplySizeOverLife";
import { CreateMultiplyVelocityOverLife } from "Components/Nodes/Update/MultiplyVelocityOverLife";
import { CreateSetColorOverLife } from "Components/Nodes/Update/SetColorOverLife";
import { CreateSetSizeOverLife } from "Components/Nodes/Update/SetSizeOverLife";
import { CreateSetTransparencyOverLife } from "Components/Nodes/Update/SetTransparencyOverLife";

// hehe, imports brr

export const NodeList: SelectionEntry[] = [
    {
        className: ConstantSpawn.className,
        nodeGroups: ConstantSpawn.nodeGroups,
        defaultEntry: {
            name: "Constant Spawn",
            create: () => CreateConstantSpawn(),
        },
    },
    {
        className: BurstSpawn.className,
        nodeGroups: BurstSpawn.nodeGroups,
        defaultEntry: {
            name: "Burst Spawn",
            create: () => CreateBurstSpawn(),
        },
    },
    {
        className: SetColor.className,
        nodeGroups: SetColor.nodeGroups,
        defaultEntry: {
            name: "Set Color",
            create: () => CreateSetColor(),
        },
    },
    {
        className: SetEmission.className,
        nodeGroups: SetEmission.nodeGroups,
        defaultEntry: {
            name: "Set Emission",
            create: () => CreateSetEmission(),
        },
    },

    {
        className: SetLifetime.className,
        nodeGroups: SetLifetime.nodeGroups,
        defaultEntry: {
            name: "Set Lifetime",
            create: () => CreateSetLifetime(),
        },
    },
    {
        className: Position.className,
        nodeGroups: Position.nodeGroups,
        defaultEntry: {
            name: "Position",
            create: () => CreatePosition(),
        },
    },
    {
        className: Shape.className,
        nodeGroups: Shape.nodeGroups,
        defaultEntry: {
            name: "Shape",
            create: () => CreateShape(),
        },
    },
    {
        className: Rotation.className,
        nodeGroups: Rotation.nodeGroups,
        defaultEntry: {
            name: "Rotation",
            create: () => CreateRotation(),
        },
    },
    {
        className: SetSize.className,
        nodeGroups: SetSize.nodeGroups,
        defaultEntry: {
            name: "Set Size",
            create: () => CreateSetSize(),
        },
    },
    {
        className: SetTransparency.className,
        nodeGroups: SetTransparency.nodeGroups,
        defaultEntry: {
            name: "Set Transparency",
            create: () => CreateSetTransparency(),
        },
    },
    {
        className: Velocity.className,
        nodeGroups: Velocity.nodeGroups,
        defaultEntry: {
            name: "Velocity",
            create: () => CreateVelocity(),
        },
    },
    {
        className: DirectVelocity.className,
        nodeGroups: DirectVelocity.nodeGroups,
        defaultEntry: {
            name: "Direct Velocity",
            create: () => CreateDirectVelocity(),
        },
    },
    {
        className: Bounce.className,
        nodeGroups: Bounce.nodeGroups,
        defaultEntry: {
            name: "Bounce",
            create: () => CreateBounce(),
        },
    },
    {
        className: Drag.className,
        nodeGroups: Drag.nodeGroups,
        defaultEntry: {
            name: "Drag",
            create: () => CreateDrag(),
        },
    },
    {
        className: MultiplyVelocityOverLife.className,
        nodeGroups: MultiplyVelocityOverLife.nodeGroups,
        defaultEntry: {
            name: "Multiply Velocity Over Life",
            create: () => CreateMultiplyVelocityOverLife(),
        },
    },
    {
        className: MultiplySizeOverLife.className,
        nodeGroups: MultiplySizeOverLife.nodeGroups,
        defaultEntry: {
            name: "Multiply Size Over Life",
            create: () => CreateMultiplySizeOverLife(),
        },
    },
    {
        className: SetColorOverLife.className,
        nodeGroups: SetColorOverLife.nodeGroups,
        defaultEntry: {
            name: "Set Color Over Life",
            create: () => CreateSetColorOverLife(),
        },
    },
    {
        className: SetSizeOverLife.className,
        nodeGroups: SetSizeOverLife.nodeGroups,
        defaultEntry: {
            name: "Set Size Over Life",
            create: () => CreateSetSizeOverLife(),
        },
    },
    {
        className: SetTransparencyOverLife.className,
        nodeGroups: SetTransparencyOverLife.nodeGroups,
        defaultEntry: {
            name: "Set Transparency Over Life",
            create: () => CreateSetTransparencyOverLife(),
        },
    },
    {
        className: Accelerate.className,
        nodeGroups: Accelerate.nodeGroups,
        defaultEntry: {
            name: "Accelerate",
            create: () => CreateAccelerate(),
        },
    },
    {
        className: MoveTowards.className,
        nodeGroups: MoveTowards.nodeGroups,
        defaultEntry: {
            name: "Move Towards",
            create: () => CreateMoveTowards(),
        },
    },
    {
        className: LookTowards.className,
        nodeGroups: LookTowards.nodeGroups,
        defaultEntry: {
            name: "Look Towards",
            create: () => CreateLookTowards(),
        },
    },
    {
        className: PlaneParticle.className,
        nodeGroups: PlaneParticle.nodeGroups,
        defaultEntry: {
            name: "Plane Particle",
            create: () => CreatePlaneParticle(),
        },
    },
    {
        className: VolumetricParticle.className,
        nodeGroups: VolumetricParticle.nodeGroups,
        defaultEntry: {
            name: "Volumetric Particle",
            create: () => CreateVolumetricParticle(),
        },
    },
    {
        className: MeshParticle.className,
        nodeGroups: MeshParticle.nodeGroups,
        defaultEntry: {
            name: "Mesh Particle",
            create: () => CreateMeshParticle(),
        },
    },
    {
        className: ValueOut.className,
        nodeGroups: ValueOut.nodeGroups,
        defaultEntry: {
            name: "Value Out",
            create: () => CreateValueOut(),
        },
    },
    {
        className: NumberMath.className,
        nodeGroups: NumberMath.nodeGroups,
        defaultEntry: {
            name: "Basic Math Operation",
            create: () => CreateNumberMath(),
        },
        alternativeEntries: [
            {
                name: "Add (number)",
                create: () => CreateNumberMath(MathOperationType.Add),
            },
            {
                name: "Subtract (number)",
                create: () => CreateNumberMath(MathOperationType.Subtract),
            },
            {
                name: "Multiply (number)",
                create: () => CreateNumberMath(MathOperationType.Multiply),
            },
            {
                name: "Divide (number)",
                create: () => CreateNumberMath(MathOperationType.Divide),
            },
        ],
    },
    {
        className: Trigonometry.className,
        nodeGroups: Trigonometry.nodeGroups,
        defaultEntry: {
            name: "Trigonometry",
            create: () => CreateTrigonometry(),
        },
        alternativeEntries: [
            {
                name: "Sin",
                create: () => CreateTrigonometry(TrigonometryType.Sin),
            },
            {
                name: "Cos",
                create: () => CreateTrigonometry(TrigonometryType.Cos),
            },
            {
                name: "Tan",
                create: () => CreateTrigonometry(TrigonometryType.Tan),
            },
        ],
    },
    {
        className: Clamp.className,
        nodeGroups: Clamp.nodeGroups,
        defaultEntry: {
            name: "Clamp",
            create: () => CreateClamp(),
        },
    },
    {
        className: Remap.className,
        nodeGroups: Remap.nodeGroups,
        defaultEntry: {
            name: "Remap",
            create: () => CreateRemap(),
        },
    },
    {
        className: RandomNumber.className,
        nodeGroups: RandomNumber.nodeGroups,
        defaultEntry: {
            name: "Random Number",
            create: () => CreateRandomNumber(),
        },
    },
    {
        className: Time.className,
        nodeGroups: Time.nodeGroups,
        defaultEntry: {
            name: "Time",
            create: () => CreateTime(),
        },
    },
    {
        className: AliveTime.className,
        nodeGroups: AliveTime.nodeGroups,
        defaultEntry: {
            name: "Alive Time",
            create: () => CreateAliveTime(),
        },
    },
    {
        className: VectorMath.className,
        nodeGroups: VectorMath.nodeGroups,
        defaultEntry: {
            name: "Vector Math",
            create: () => CreateVectorMath(),
        },
        alternativeEntries: [
            {
                name: "Add (vector)",
                create: () => CreateVectorMath(MathOperationType.Add),
            },
            {
                name: "Subtract (vector)",
                create: () => CreateVectorMath(MathOperationType.Subtract),
            },
            {
                name: "Multiply (vector)",
                create: () => CreateVectorMath(MathOperationType.Multiply),
            },
            {
                name: "Divide (vector)",
                create: () => CreateVectorMath(MathOperationType.Divide),
            },
        ],
    },
    {
        className: GetParentProperty.className,
        nodeGroups: GetParentProperty.nodeGroups,
        defaultEntry: {
            name: "Get Parent Property",
            create: () => CreateGetParentProperty(),
        },
    },
    {
        className: MultiplyRotationOverLife.className,
        nodeGroups: MultiplyRotationOverLife.nodeGroups,
        defaultEntry: {
            name: "Multiply Rotation Over Life",
            create: () => CreateMultiplyRotationOverLife(),
        },
    },
];
