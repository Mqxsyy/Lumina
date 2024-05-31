export function IsAxisX(axisType: string) {
    return axisType === "X" || axisType === "XY" || axisType === "XZ" || axisType === "XYZ";
}

export function IsAxisY(axisType: string) {
    return axisType === "Y" || axisType === "XY" || axisType === "YZ" || axisType === "XYZ";
}

export function IsAxisZ(axisType: string) {
    return axisType === "Z" || axisType === "XZ" || axisType === "YZ" || axisType === "XYZ";
}
