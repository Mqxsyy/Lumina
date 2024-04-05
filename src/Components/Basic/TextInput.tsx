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

	ClearTextOnFocus?: boolean;
	AutoFocus?: boolean;
	IsAffectedByZoom?: boolean;

	Disabled?: boolean;
	TextChanged?: (text: string) => string | void;
	GetRef?: (textBox: TextBox) => void;
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
	ClearTextOnFocus = true,
	AutoFocus = false,
	IsAffectedByZoom = true,
	Disabled = false,
	TextChanged = undefined,
	GetRef = undefined,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const textBoxRef = useRef<TextBox | undefined>();
	const lastText = useRef<string>(""); // not sure if i need to check anymore

	const textChanged = () => {
		if (textBoxRef.current!.Text === lastText.current) return;
		lastText.current = textBoxRef.current!.Text;

		if (TextChanged !== undefined) {
			const newText = TextChanged(textBoxRef.current!.Text);

			if (newText !== undefined && newText !== textBoxRef.current!.Text) {
				textBoxRef.current!.Text = newText;
			}
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

		if (GetRef !== undefined) {
			GetRef(textBoxRef.current);
		}

		if (!Disabled) {
			connection = textBoxRef.current.GetPropertyChangedSignal("Text").Connect(textChanged);
		}

		if (AutoFocus && !Disabled) {
			textBoxRef.current.CaptureFocus();
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
			PlaceholderColor3={StyleColors.TextDarkPlaceholder}
			TextWrapped={true}
			TextTruncate={Enum.TextTruncate.AtEnd}
			ClearTextOnFocus={Disabled ? false : ClearTextOnFocus}
			TextEditable={!Disabled}
			Text={Disabled ? "-" : Text}
			ref={textBoxRef}
		>
			<uipadding PaddingLeft={new UDim(0, 5)} />
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
		</textbox>
	);
}
