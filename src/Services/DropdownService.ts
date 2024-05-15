import { Event } from "API/Bindables/Event";

interface DropdownData {
    position: UDim2 | undefined;
    width: number;
    elements: React.Element[];
}

export const DropdownDataChanged = new Event();

const DISABLE_COOLDOWN = 0.1;
let enableTime = 0;

const dropdownData: DropdownData = {
    position: undefined,
    width: 0,
    elements: [],
};

export function EnableDropdown(position: UDim2, width: number, elements: React.Element[]) {
    dropdownData.position = position;
    dropdownData.width = width;
    dropdownData.elements = elements;
    enableTime = os.clock();
    DropdownDataChanged.Fire();
}

export function DisableDropdown() {
    if (os.clock() - enableTime < DISABLE_COOLDOWN) return;

    dropdownData.position = undefined;
    dropdownData.width = 0;
    dropdownData.elements = [];
    DropdownDataChanged.Fire();
}

export function GetDropdownData() {
    return dropdownData;
}
