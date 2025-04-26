import React, { type PropsWithChildren } from "@rbxts/react";
import { StyleColors, StyleText } from "API/Style";
import { TextInput } from "./TextInput";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;

    HideBackground?: boolean;

    TextSize?: number;
    FontWeight?: Enum.FontWeight;
    TextColor?: Color3;
    TextXAlignment?: "Left" | "Center" | "Right";
    TextWrapped?: boolean;
    TextTruncate?: "None" | "AtEnd" | "SplitWord";
    PlaceholderText?: string;
    Text?: string | (() => string);

    IsAffectedByZoom?: boolean;
    AllowNegative?: boolean;

    Disabled?: boolean;

    NumberChanged?: (number: number) => undefined | number;
    FocusLost?: (number: number) => void;
}

export function NumberInput({
    AnchorPoint = Vector2.zero,
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromScale(1, 1),
    HideBackground = false,
    TextSize = StyleText.FontSize,
    FontWeight = StyleText.FontWeight,
    TextColor = StyleColors.TextDark,
    TextXAlignment = "Left",
    TextWrapped = true,
    TextTruncate = "AtEnd",
    PlaceholderText = "",
    Text = "",
    IsAffectedByZoom = true,
    AllowNegative = false,
    Disabled = false,
    NumberChanged = undefined,
    FocusLost = undefined,
    children,
}: PropsWithChildren<Props>) {
    const validateNumber = (text: string) => {
        const number = tonumber(text);

        if (number === undefined) {
            if (AllowNegative) {
                if (text === "-") return text;
            }

            return undefined;
        }

        if (!AllowNegative && (number < 0 || text.sub(1, 1) === "-")) {
            return undefined;
        }

        return text;
    };

    const getDefaultText = () => {
        if (typeIs(Text, "function")) {
            return Text();
        }

        return Text;
    };

    const textChanged = (text: string) => {
        let number = validateNumber(text);
        if (number === undefined) return "";
        if (number === "-") return number;

        if (NumberChanged !== undefined) {
            const adjustedNumber = NumberChanged(tonumber(number) as number);
            if (adjustedNumber !== undefined) {
                number = tostring(adjustedNumber);
            }
        }

        return number;
    };

    const lostFocus = (text: string) => {
        const number = validateNumber(text);

        if (FocusLost !== undefined && tonumber(number) !== undefined) {
            FocusLost(tonumber(number) as number);
        }

        if (number === undefined || number === "-") return getDefaultText();
    };

    return (
        <TextInput
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            HideBackground={HideBackground}
            TextSize={TextSize}
            FontWeight={FontWeight}
            TextColor={TextColor}
            TextXAlignment={TextXAlignment}
            TextWrapped={TextWrapped}
            TextTruncate={TextTruncate}
            PlaceholderText={PlaceholderText}
            Text={getDefaultText()}
            IsAffectedByZoom={IsAffectedByZoom}
            Disabled={Disabled}
            TextChanged={textChanged}
            LostFocus={lostFocus}
        >
            {children}
        </TextInput>
    );
}
