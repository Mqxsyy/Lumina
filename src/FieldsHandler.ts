import { FieldQueryData } from "Components/NodeFields/ConnectionPoint/ConnectionPointIn";

let sourceSetGetData: undefined | ((getData: () => FieldQueryData) => void);
let sourceOnTargetFieldUpdate: undefined | (() => void);
let sourceOnDisconnect: undefined | ((onDisconnect: () => void) => void);

export function SetSourceField(
	setGetTargetData: (getData: () => FieldQueryData) => void,
	onTargetFieldUpdate: () => void,
	setOnDisconnect: (onDisconnect: () => void) => void,
) {
	sourceSetGetData = setGetTargetData;
	sourceOnTargetFieldUpdate = onTargetFieldUpdate;
	sourceOnDisconnect = setOnDisconnect;
}

export function ResetSourceField() {
	sourceSetGetData = undefined;
	sourceOnTargetFieldUpdate = undefined;
	sourceOnDisconnect = undefined;
}

export function SetTargetField(
	getConnectionPointPosition: () => FieldQueryData,
	onDisconnect: () => void,
): undefined | (() => void) {
	if (sourceSetGetData !== undefined) {
		sourceSetGetData(getConnectionPointPosition);
	}

	if (sourceOnDisconnect !== undefined) {
		sourceOnDisconnect(onDisconnect);
	}

	if (sourceOnTargetFieldUpdate !== undefined) {
		return sourceOnTargetFieldUpdate;
	}

	return undefined;
}
