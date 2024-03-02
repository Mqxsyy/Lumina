import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { Div } from "../Div";
import { GetZoomScale, ZoomScaleChanged } from "ZoomScale";
import { StyleColors } from "Style";
import { BasicTextLabel } from "Components/Basic/BasicTextLabel";
import { NodeDraggingEnded } from "Services/DraggingService";
import { GetNodeById, UpdateNodeAnchorPoint } from "Services/NodesService";
import { NodeGroups } from "API/NodeGroup";

const BORDER_THICKNESS = 2;

interface Props {
	NodeGroup: NodeGroups;
	GradientStart: Color3;
	GradientEnd: Color3;
}

export function NodeGroup({ NodeGroup, GradientStart, GradientEnd }: Props) {
	const [zoomScale, setZoomScale] = useState(GetZoomScale());

	const divRef = useRef(undefined as undefined | Frame);

	const isHovering = useRef(false);

	const getFrame = (frame: Frame) => {
		divRef.current = frame;
	};

	const onHover = () => {
		isHovering.current = true;
	};

	const onUnhover = () => {
		isHovering.current = false;
	};

	useEffect(() => {
		const dragConnection = NodeDraggingEnded.Connect((id) => {
			if (isHovering.current) {
				const node = GetNodeById(id);

				if (node === undefined) return;
				if (NodeGroup !== node.data.node.nodeGroup) return;

				UpdateNodeAnchorPoint(id, divRef.current!.AbsolutePosition);
			}
		});

		const zoomConnection = ZoomScaleChanged.Connect((zoomScale) => {
			setZoomScale(zoomScale as number);
		});

		return () => {
			dragConnection.Disconnect();
			zoomConnection.Disconnect();
		};
	}, []);

	return (
		<Div
			Size={UDim2.fromScale(1, 0)}
			AutomaticSize={"Y"}
			getFrame={getFrame}
			onHover={onHover}
			onUnhover={onUnhover}
		>
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

					<BasicTextLabel Size={new UDim2(1, 0, 0, 20 * zoomScale)} Text={NodeGroups[NodeGroup]} />
				</Div>
			</Div>
		</Div>
	);
}
