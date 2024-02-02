let sourceFieldCallback: undefined | ((targetPoint: Vector2) => void);

export function SetSourceField(callback: (targetPoint: Vector2) => void) {
	sourceFieldCallback = callback;
}

export function ResetSourceField() {
	sourceFieldCallback = undefined;
}

export function SetTargetField(targetPoint: Vector2) {
	if (sourceFieldCallback === undefined) return;

	sourceFieldCallback(targetPoint);
}

// SOURCE <- TARGET = visuals
// SOURCE <- TARGET = asks data
// SOURCE -> TARGET = data changed
