import React from "@rbxts/react";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";

interface Props {
    Text: string;
}

export default function FeatureDetail({ Text }: Props) {
    return (
        <BasicTextLabel
            AutomaticSize="Y"
            Size={UDim2.fromScale(1, 0)}
            TextXAlignment="Left"
            TextWrapped={true}
            Text={Text}
            TextSize={20}
            TextYAlignment="Bottom"
        />
    );
}
