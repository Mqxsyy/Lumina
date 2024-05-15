export const Rand = new Random(os.clock());
export const FrameRateMultiplier = 0.0167;
export const CFrameZero = new CFrame();

export function RemapValue(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
    if (value < oldMin || value > oldMax) {
        error(`Input value is outside the specified range
            Input: ${value},
            RangeOld: ${oldMin} - ${oldMax} 
            RangeNew: ${newMin} - ${newMax}
        `);
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

export function FixFloatingPointError(value: number): number {
    const shortened = string.format("%.3f", tostring(value));
    return tonumber(shortened.gsub("%.?0+$", "")[0])!;
}

export function CapitalizeFirstLetter(text: string): string {
    return text.gsub("^%l", string.upper)[0];
}
