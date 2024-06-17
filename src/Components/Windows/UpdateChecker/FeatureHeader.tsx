import React from "@rbxts/react";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

interface Props {
    Text: string;
    FontSize?: number;
}

export default function FeatureHeader({ Text, FontSize = 30 }: Props) {
    return (
        <BasicTextLabel
            AutomaticSize="Y"
            Size={UDim2.fromScale(1, 0)}
            TextXAlignment="Left"
            TextWrapped={true}
            Text={Text}
            FontWeight={Enum.FontWeight.Bold}
            TextSize={FontSize}
            TextYAlignment="Bottom"
        />
    );
}
