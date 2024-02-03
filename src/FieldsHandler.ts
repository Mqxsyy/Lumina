import { FieldQueryData } from "Components/NodeFields/ConnectionPoint/ConnectionPointIn";

let sourceSetGetData: undefined | ((getData: () => FieldQueryData) => void);
let sourceOnTargetFieldUpdate: undefined | (() => void);

export function SetSourceField(
	setGetTargetData: (getData: () => FieldQueryData) => void,
	onTargetFieldUpdate: () => void,
) {
	sourceSetGetData = setGetTargetData;
	sourceOnTargetFieldUpdate = onTargetFieldUpdate;
}

export function ResetSourceField() {
	sourceSetGetData = undefined;
	sourceOnTargetFieldUpdate = undefined;
}

export function SetTargetField(getConnectionPointPosition: () => FieldQueryData): undefined | (() => void) {
	if (sourceSetGetData !== undefined) {
		sourceSetGetData(getConnectionPointPosition);
	}

	if (sourceOnTargetFieldUpdate !== undefined) {
		return sourceOnTargetFieldUpdate;
	}

	return undefined;
}
