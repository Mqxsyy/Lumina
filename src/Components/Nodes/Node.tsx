import Roact, { useEffect, useState } from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { TextInput } from "Components/Basic/TextInput";
import { StyleColors, StyleProperties } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

export function Node() {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	useEffect(() => {
		ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});
	}, []);

	return (
		<frame Size={new UDim2(1, 0, 0, (20 * 2 + 5 + 10) * zoomScale)} BackgroundColor3={StyleColors.Primary}>
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
			<uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />
			<uipadding
				PaddingLeft={new UDim(0, 5 * zoomScale)}
				PaddingRight={new UDim(0, 5 * zoomScale)}
				PaddingTop={new UDim(0, 5 * zoomScale)}
				PaddingBottom={new UDim(0, 5 * zoomScale)}
			/>

			<BasicTextLabel Size={new UDim2(1, 0, 0, 20 * zoomScale)} Text="Node" />
			<TextInput Size={new UDim2(1, 0, 0, 20 * zoomScale)} PlaceholderText="Enter Node Name" />
		</frame>
	);
}
