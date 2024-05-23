export const Rand = new Random(os.clock());
export const FrameRateMultiplier = 0.0167;
export const CFrameZero = new CFrame();

export function RemapValue(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
    if (value < oldMin || value > oldMax) {
        let errorString = "";
        errorString += "Input value is outside the specified range\n";
        errorString += `Input: ${value}\n`;
        errorString += `RangeOld: ${oldMin} - ${oldMax}\n`;
        errorString += `RangeNew: ${newMin} - ${newMax}\n`;

        error(errorString);
    }

    const rangeFactor = (newMax - newMin) / (oldMax - oldMin);
    const offset = newMin - oldMin * rangeFactor;

    return value * rangeFactor + offset;
}

export function LerpNumber(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function RoundDecimal(x: number, decimal: number) {
    return FixFloatingPointError(math.round(x / decimal) * decimal);
}

export function FixFloatingPointError(value: number) {
    const shortened = string.format("%.3f", tostring(value));
    return tonumber(shortened.gsub("%.?0+$", "")[0]) as number;
}

export function CapitalizeFirstLetter(text: string) {
    return text.gsub("^%l", string.upper)[0];
}

export function LowerFirstLetter(text: string) {
    return text.gsub("^%l", string.lower)[0];
}

export function ArraySwap(arr: unknown[], index1: number, index2: number) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}
