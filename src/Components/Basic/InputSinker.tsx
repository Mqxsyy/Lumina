import React from "@rbxts/react";

interface Props {
    Size?: UDim2;
}

export default function InputSinker({ Size = UDim2.fromScale(1, 1) }: Props) {
    return <imagebutton Size={Size} BackgroundTransparency={1} ImageTransparency={1} AutoButtonColor={false} />;
}
