import React from "@rbxts/react";
import { StyleColors, StyleText } from "Style";
import { TextInput } from "./TextInput";

interface Props {
    AnchorPoint?: Vector2;
    Position?: UDim2;
    Size?: UDim2;

    TextSize?: number;
    FontWeight?: Enum.FontWeight;
    TextColor?: Color3;
    TextXAlignment?: Enum.TextXAlignment;
    PlaceholderText?: string;
    Text?: string | (() => string);

    IsAffectedByZoom?: boolean;
    AllowNegative?: boolean;

    Disabled?: boolean;

    NumberChanged?: (number: number) => void | number;
}

export function NumberInput({
    AnchorPoint = Vector2.zero,
    Position = UDim2.fromScale(0, 0),
    Size = UDim2.fromScale(1, 1),
    TextSize = StyleText.FontSize,
    FontWeight = StyleText.FontWeight,
    TextColor = StyleColors.TextDark,
    TextXAlignment = Enum.TextXAlignment.Left,
    PlaceholderText = "",
    Text = "",
    IsAffectedByZoom = true,
    AllowNegative = false,
    Disabled = false,
    NumberChanged = undefined,
    children,
}: React.PropsWithChildren<Props>) {
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
        if (number === undefined || number === "-") return getDefaultText();
    };

    return (
        <TextInput
            AnchorPoint={AnchorPoint}
            Position={Position}
            Size={Size}
            TextSize={TextSize}
            FontWeight={FontWeight}
            TextColor={TextColor}
            TextXAlignment={TextXAlignment}
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
