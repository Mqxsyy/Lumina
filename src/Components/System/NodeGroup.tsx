import Roact, { useEffect, useState } from "@rbxts/roact";
import { Div } from "../Div";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import { StyleColors, StyleProperties } from "Style";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { Node } from "Components/Nodes/Node";

const BORDER_THICKNESS = 2;

interface Props {
	Title: string;
	GradientStart: Color3;
	GradientEnd: Color3;
}

export function NodeGroup({ Title, GradientStart, GradientEnd }: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	useEffect(() => {
		ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});
	}, []);

	return (
		<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
			<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
				<uipadding
					PaddingLeft={new UDim(0, BORDER_THICKNESS * zoomScale)}
					PaddingRight={new UDim(0, BORDER_THICKNESS * zoomScale)}
					PaddingTop={new UDim(0, BORDER_THICKNESS * zoomScale)}
					PaddingBottom={new UDim(0, BORDER_THICKNESS * zoomScale)}
				/>

				<Div Size={UDim2.fromScale(1, 0)} AutomaticSize={"Y"}>
					<uisizeconstraint MinSize={new Vector2(0, 50 * zoomScale)} />
					<uicorner CornerRadius={new UDim(0, 5 * zoomScale)} />
					<uilistlayout Padding={new UDim(0, 5 * zoomScale)} HorizontalAlignment={"Center"} />
					<uistroke
						Color={StyleColors.FullWhite}
						Thickness={BORDER_THICKNESS * zoomScale}
						Transparency={0.35}
					>
						<uigradient
							Rotation={90}
							Color={
								new ColorSequence([
									new ColorSequenceKeypoint(0, GradientStart),
									new ColorSequenceKeypoint(1, GradientEnd),
								])
							}
						/>
					</uistroke>
					<uipadding
						PaddingLeft={new UDim(0, 5 * zoomScale)}
						PaddingRight={new UDim(0, 5 * zoomScale)}
						PaddingTop={new UDim(0, 5 * zoomScale)}
						PaddingBottom={new UDim(0, 5 * zoomScale)}
					/>

					<BasicTextLabel Size={new UDim2(1, 0, 0, 20 * zoomScale)} Text={Title} />
					<Node />
					<Node />
					<Node />
				</Div>
			</Div>
		</Div>
	);
}
