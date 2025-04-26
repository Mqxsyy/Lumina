import React from "@rbxts/react";
import { GetDropdownData } from "Services/DropdownService";
import { StyleColors, StyleProperties } from "API/Style";

export default function Dropdown() {
    const dropdownData = GetDropdownData();

    return (
        <imagebutton
            Position={dropdownData.position}
            Size={UDim2.fromOffset(dropdownData.width, 0)}
            AutomaticSize="Y"
            BackgroundColor3={StyleColors.Primary}
            ImageTransparency={1}
            AutoButtonColor={false}
            ZIndex={9}
        >
            <uicorner CornerRadius={StyleProperties.CornerRadius} />
            <uipadding
                PaddingTop={new UDim(0, 5)}
                PaddingBottom={new UDim(0, 5)}
                PaddingLeft={new UDim(0, 5)}
                PaddingRight={new UDim(0, 5)}
            />
            <uilistlayout FillDirection={"Vertical"} HorizontalAlignment={"Center"} Padding={new UDim(0, 5)} />

            {dropdownData.elements}
        </imagebutton>
    );
}
