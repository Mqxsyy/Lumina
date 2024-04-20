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
	PlaceholderText?: string;
	Text?: string;

	ClearTextOnFocus?: boolean;
	AutoFocus?: boolean;
	IsAffectedByZoom?: boolean;

	Disabled?: boolean;
	TextChanged?: (text: string) => string | void;
	LostFocus?: (text: string) => string | void;
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
	PlaceholderText = "",
	Text = "",
	ClearTextOnFocus = true,
	AutoFocus = false,
	IsAffectedByZoom = true,
	Disabled = false,
	TextChanged = undefined,
	LostFocus = undefined,
	GetRef = undefined,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const textBoxRef = useRef<TextBox | undefined>();

	const textChanged = () => {
		if (TextChanged === undefined) return;

		const newText = TextChanged(textBoxRef.current!.Text);
		if (newText !== undefined && newText !== textBoxRef.current!.Text) {
			textBoxRef.current!.Text = newText;
		}
	};

	const focusLost = () => {
		if (LostFocus === undefined) return;

		const newText = LostFocus(textBoxRef.current!.Text);
		if (newText !== undefined && newText !== textBoxRef.current!.Text) {
			textBoxRef.current!.Text = newText;
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

		let textChangedConnection: RBXScriptConnection;
		let focusLostConnection: RBXScriptConnection;

		if (GetRef !== undefined) {
			GetRef(textBoxRef.current);
		}

		if (!Disabled) {
			textChangedConnection = textBoxRef.current.GetPropertyChangedSignal("Text").Connect(textChanged);
			focusLostConnection = textBoxRef.current.FocusLost.Connect(focusLost);
		}

		if (AutoFocus && !Disabled) {
			textBoxRef.current.CaptureFocus();
		}

		return () => {
			if (textChangedConnection !== undefined) {
				textChangedConnection.Disconnect();
			}

			if (focusLostConnection !== undefined) {
				focusLostConnection.Disconnect();
			}
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
