import Roact, { useEffect, useState } from "@rbxts/roact";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { StyleColors, StyleProperties } from "Style";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";

interface Props {
	Name: string;
}

export function Node({ Name, children }: Roact.PropsWithChildren<Props>) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	useEffect(() => {
		ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});
	}, []);

	return (
		<frame Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"} BackgroundColor3={StyleColors.Primary}>
			<uicorner CornerRadius={StyleProperties.CornerRadius} />
			<uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />
			<uipadding
				PaddingLeft={new UDim(0, 5 * zoomScale)}
				PaddingRight={new UDim(0, 5 * zoomScale)}
				PaddingTop={new UDim(0, 5 * zoomScale)}
				PaddingBottom={new UDim(0, 5 * zoomScale)}
			/>

			<BasicTextLabel Size={new UDim2(1, 0, 0, 20 * zoomScale)} Text={Name} />
			{children}
		</frame>
	);
}
