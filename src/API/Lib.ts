export function RemapValue(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
	if (value < oldMin || value > oldMax) {
		error("Input value is outside the specified range.");
	}

	const rangeFactor = (newMax - newMin) / (oldMax - oldMin);
	const offset = newMin - oldMin * rangeFactor;

	return value * rangeFactor + offset;
}
