import React, { useEffect, useRef, useState } from "@rbxts/react";
import { GetCanvasData } from "Services/CanvasService";
import type { ConnectionData } from "Services/ConnectionsService";
import { StyleColors } from "Style";
import { GetZoomScale } from "ZoomScale";

export const CreateConnectionLine = (connectionData: ConnectionData) => {
    return <ConnectionLine key={`connection_${connectionData.id}`} data={connectionData} />;
};

interface LineSegment {
    length: number;
    position: Vector2;
    rotation: number;
}

function ConnectionLine({ data }: { data: ConnectionData }) {
    const [startSegment, setStartSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });
    const [middleSegment, setMiddleSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });
    const [endSegment, setEndSegment] = useState({ position: Vector2.zero, length: 0, rotation: 0 });

    const zoomScale = GetZoomScale();
    const canvasData = useRef(GetCanvasData());

    useEffect(() => {
        if (data.endPos === undefined && data.endElement === undefined) return;

        const canvasPositionUDim2 = canvasData.current.Position;
        const canvasPosition = new Vector2(canvasPositionUDim2.X.Offset, canvasPositionUDim2.Y.Offset);

        const startPoint1 = data.startElement.AbsolutePosition.add(data.startElement.AbsoluteSize.div(2)).sub(canvasPosition);

        const endPoint1 =
            data.endElement === undefined
                ? (data.endPos as Vector2)
                : data.endElement.AbsolutePosition.add(data.endElement.AbsoluteSize.div(2)).sub(canvasPosition);

        const xDistance = endPoint1.X - startPoint1.X;

        const startPoint2 = startPoint1.add(new Vector2(xDistance * 0.2, 0));
        const endPoint2 = endPoint1.sub(new Vector2(xDistance * 0.2, 0));

        const startSegmentPosition1 = canvasPosition.add(startPoint1);
        const startSegmentPosition2 = canvasPosition.add(startPoint2);

        const endSegmentPosition1 = canvasPosition.add(endPoint1);
        const endSegmentPosition2 = canvasPosition.add(endPoint2);

        const startSegment = {
            position: startSegmentPosition1,
            length: startSegmentPosition2.sub(startSegmentPosition1).Magnitude,
            rotation: 0,
        } as LineSegment;
        setStartSegment(startSegment);

        const vectorDiff = endPoint2.sub(startPoint2);
        const rotationRad = math.atan2(vectorDiff.Y, vectorDiff.X);

        const middleSegement = {
            position: startSegmentPosition2.add(endSegmentPosition2.sub(startSegmentPosition2).mul(0.5)),
            length: vectorDiff.Magnitude,
            rotation: math.round(math.deg(rotationRad)),
        } as LineSegment;
        setMiddleSegment(middleSegement);

        const endSegment = {
            position: endSegmentPosition1,
            length: endSegmentPosition2.sub(endSegmentPosition1).Magnitude,
            rotation: 0,
        } as LineSegment;
        setEndSegment(endSegment);
    }, [data.startElement.AbsolutePosition, data.endPos, data.endElement?.AbsolutePosition, canvasData.current.Position]);

    return (
        <>
            <frame
                AnchorPoint={startSegment.position.X < endSegment.position.X ? new Vector2(0, 0.5) : new Vector2(1, 0.5)}
                Position={UDim2.fromOffset(startSegment.position.X, startSegment.position.Y)}
                Rotation={startSegment.rotation}
                Size={UDim2.fromOffset(startSegment.length + 1, math.clamp(3 * zoomScale, 1, math.huge))}
                BackgroundColor3={StyleColors.Highlight}
                BackgroundTransparency={0}
                BorderSizePixel={0}
                ZIndex={3}
                key={`connection_start_${data.id}`}
            >
                <uicorner CornerRadius={new UDim(1, 10)} />
            </frame>
            <frame
                AnchorPoint={new Vector2(0.5, 0.5)}
                Position={UDim2.fromOffset(middleSegment.position.X, middleSegment.position.Y)}
                Rotation={middleSegment.rotation}
                Size={UDim2.fromOffset(middleSegment.length + 2, math.clamp(3 * zoomScale, 1, math.huge))}
                BackgroundColor3={StyleColors.Highlight}
                BackgroundTransparency={0}
                BorderSizePixel={0}
                ZIndex={3}
                key={`connection_middle_${data.id}`}
            >
                <uicorner CornerRadius={new UDim(1, 10)} />
            </frame>
            <frame
                AnchorPoint={startSegment.position.X < endSegment.position.X ? new Vector2(1, 0.5) : new Vector2(0, 0.5)}
                Position={UDim2.fromOffset(endSegment.position.X, endSegment.position.Y)}
                Rotation={endSegment.rotation}
                Size={UDim2.fromOffset(endSegment.length + 1, math.clamp(3 * zoomScale, 1, math.huge))}
                BackgroundColor3={StyleColors.Highlight}
                BackgroundTransparency={0}
                BorderSizePixel={0}
                ZIndex={3}
                key={`connection_end_${data.id}`}
            >
                <uicorner CornerRadius={new UDim(1, 10)} />
            </frame>
        </>
    );
}
