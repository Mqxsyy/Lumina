import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { StyleColors, StyleProperties, StyleText } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

interface Props {
	AnchorPoint?: Vector2;
	Position?: UDim2;
	Size?: UDim2;

	FontWeight?: Enum.FontWeight;
	TextSize?: number;
	TextColor?: Color3;
	TextXAlignment?: Enum.TextXAlignment;
	PlaceholderText: string;
	Text?: string;

	IsAffectedByZoom?: boolean;

	Disabled?: boolean;
	TextChanged?: (text: string) => string;
}

export function TextInput({
	AnchorPoint = Vector2.zero,
	Position = UDim2.fromScale(0, 0),
	Size = UDim2.fromScale(1, 1),
	TextSize = StyleText.FontSize,
	FontWeight = StyleText.FontWeight,
	TextColor = StyleColors.TextDark,
	TextXAlignment = Enum.TextXAlignment.Left,
	PlaceholderText,
	Text = "",
	IsAffectedByZoom = true,
	Disabled = false,
	TextChanged = undefined,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const textBoxRef = useRef<TextBox | undefined>();
	const lastText = useRef<string>("");

	const textChanged = () => {
		if (textBoxRef.current!.Text === lastText.current) return;
		lastText.current = textBoxRef.current!.Text;

		if (TextChanged !== undefined) {
			textBoxRef.current!.Text = TextChanged(textBoxRef.current!.Text);
		}
	};

	useEffect(() => {
		if (!IsAffectedByZoom) return;

		ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});
	}, []);

	useEffect(() => {
		if (textBoxRef.current === undefined) return;
		let connection: undefined | RBXScriptConnection;

		if (!Disabled) {
			connection = textBoxRef.current.FocusLost.Connect(textChanged);
		}

		return () => {
			if (connection === undefined) return;
			connection.Disconnect();
		};
	}, [textBoxRef.current, Disabled]);

	return (
		<textbox
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={
				IsAffectedByZoom
					? new UDim2(Size.X.Scale, Size.X.Offset, Size.Y.Scale, Size.Y.Offset * zoomScale)
					: Size
			}
			BackgroundColor3={Disabled ? StyleColors.Disabled : StyleColors.Highlight}
			BorderSizePixel={0}
			TextSize={IsAffectedByZoom ? TextSize * zoomScale : TextSize}
			FontFace={new Font(StyleText.FontId, FontWeight)}
			TextColor3={Disabled ? StyleColors.TextLight : TextColor}
			TextXAlignment={TextXAlignment}
			PlaceholderText={PlaceholderText}
			PlaceholderColor3={TextColor}
			TextWrapped={true}
			TextTruncate={Enum.TextTruncate.AtEnd}
			ClearTextOnFocus={!Disabled}
			TextEditable={!Disabled}
			Text={Disabled ? "-" : Text}
			ref={textBoxRef}
		>
			<uipadding PaddingLeft={new UDim(0, 5)} />
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
		</textbox>
	);
}
