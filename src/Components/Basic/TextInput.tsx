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

	TextChanged?: (text: string) => void;
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
	TextChanged = undefined,
}: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const textBoxRef = useRef<TextBox | undefined>();
	const lastText = useRef<string>("");

	const textChanged = () => {
		if (textBoxRef.current!.Text === lastText.current) return;
		lastText.current = textBoxRef.current!.Text;

		if (TextChanged !== undefined) {
			TextChanged(textBoxRef.current!.Text);
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
		const conn = textBoxRef.current!.GetPropertyChangedSignal("Text").Connect(textChanged);

		return () => {
			conn.Disconnect();
		};
	}, [textBoxRef.current]);

	return (
		<textbox
			AnchorPoint={AnchorPoint}
			Position={Position}
			Size={Size}
			BackgroundColor3={StyleColors.Highlight}
			BorderSizePixel={0}
			TextSize={IsAffectedByZoom ? TextSize * zoomScale : TextSize}
			FontFace={new Font(StyleText.FontId, FontWeight)}
			TextColor3={TextColor}
			TextXAlignment={TextXAlignment}
			PlaceholderText={PlaceholderText}
			PlaceholderColor3={TextColor}
			TextWrapped={true}
			TextTruncate={Enum.TextTruncate.AtEnd}
			Text={Text}
			ref={textBoxRef}
		>
			<uipadding PaddingLeft={new UDim(0, 5)} />
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
		</textbox>
	);
}
