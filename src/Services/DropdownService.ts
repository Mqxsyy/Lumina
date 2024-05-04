import { Event } from "API/Bindables/Event";

interface DropdownData {
    position: UDim2 | undefined;
    width: number;
    elements: React.Element[];
}

export const DropdownDataChanged = new Event();

const dropdownData: DropdownData = {
    position: undefined,
    width: 0,
    elements: [],
};

export function EnableDropdown(position: UDim2, width: number, elements: React.Element[]) {
    dropdownData.position = position;
    dropdownData.width = width;
    dropdownData.elements = elements;
    DropdownDataChanged.Fire();
}

export function DisableDropdown() {
    dropdownData.position = undefined;
    dropdownData.width = 0;
    dropdownData.elements = [];
    DropdownDataChanged.Fire();
}

export function GetDropdownData() {
    return dropdownData;
}
