export type FieldState = { [key: string]: string };

export const CalculationType1 = {
    Uniform: "Uniform",
    UniformConnected: "Uniform Connected",
    Random: "Random",
    RandomConncted: "Random Connected",
};

export const CalculationType2 = {
    Connected: "Connected",
    Individual: "Individual",
};

export const AxisType = {
    X: "X",
    Y: "Y",
    Z: "Z",
    XY: "XY",
    XZ: "XZ",
    YZ: "YZ",
    XYZ: "XYZ",
};

export const MathOperationType = {
    Add: "Add",
    Subtract: "Subtract",
    Multiply: "Multiply",
    Divide: "Divide",
};

export const TrigonometryType = {
    Sin: "Sin",
    Cos: "Cos",
    Tan: "Tan",
};

export const NodeOperationType = {
    Set: "Set",
    Add: "Add",
    Multiply: "Multiply",
};

export const SpaceType = {
    WorldSpace: "World Space",
    LocalSpace: "Local Space",
};

export const SpawnShapeType = {
    Square: "Square",
    Cube: "Cube",
    Ellipse: "Ellipse",
    Sphere: "Sphere",
};

export const VolumetricParticleShapeType = {
    Cube: "Cube",
    Sphere: "Sphere",
};

export const OrientationType = {
    FacingCamera: "Facing Camera",
    VelocityParallel: "Velocity Parallel",
    VelocityPerpendicular: "Velocity Perpendicular",
};

export const ValueType = {
    Number: "Number",
    Vector2: "Vector2",
    Vector3: "Vector3",
    Color: "Color3",
};

export const PropertyType = {
    Position: "Position",
    Size: "Size",
    Rotation: "Rotation",
    LookVector: "LookVector",
    RightVector: "RightVector",
    UpVector: "UpVector",
};

export const RangeCount = {
    SingleRange: "Single Range",
    DoubleRange: "Double Range",
};
