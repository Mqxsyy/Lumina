import React from "@rbxts/react";
import { GetZoomScale } from "ZoomScale";

interface Props {
    canvasSize: UDim2;
}

export default function CanvasBackground({ canvasSize }: Props) {
    const zoomScale = GetZoomScale();

    return (
        <>
            {/* Top Left */}
            <imagelabel
                Position={UDim2.fromOffset(0, 0)}
                Size={UDim2.fromOffset(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5)}
                Rotation={180}
                BackgroundTransparency={1}
                // BackgroundTransparency={0.95}
                // BackgroundColor3={Color3.fromRGB(255, 0, 0)}
                Image={"rbxassetid://15952812715"} // alt: 15952811095
                ImageTransparency={0.5}
                ScaleType={"Tile"}
                TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
            />
            {/* Bottom Right */}
            <imagelabel
                Position={UDim2.fromOffset(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5)}
                Size={UDim2.fromOffset(canvasSize.X.Offset * 0.5, canvasSize.Y.Offset * 0.5)}
                BackgroundTransparency={1}
                // BackgroundTransparency={0.95}
                // BackgroundColor3={Color3.fromRGB(0, 255, 0)}
                Image={"rbxassetid://15952812715"} // alt: 15952811095
                ImageTransparency={0.5}
                ScaleType={"Tile"}
                TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
            />
            {/* Top Right */}
            <imagelabel
                Position={
                    new UDim2(
                        0.5,
                        canvasSize.X.Offset * 0.25 - canvasSize.Y.Offset * 0.25,
                        0,
                        canvasSize.Y.Offset * 0.25 - canvasSize.X.Offset * 0.25,
                    )
                }
                Size={UDim2.fromOffset(canvasSize.Y.Offset * 0.5, canvasSize.X.Offset * 0.5)}
                Rotation={270}
                BackgroundTransparency={1}
                // BackgroundTransparency={0.95}
                // BackgroundColor3={Color3.fromRGB(0, 0, 255)}
                Image={"rbxassetid://15952812715"} // alt: 15952811095
                ImageTransparency={0.5}
                ScaleType={"Tile"}
                TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
            />
            {/* Bottom Left */}
            <imagelabel
                Position={
                    new UDim2(
                        0,
                        canvasSize.X.Offset * 0.25 - canvasSize.Y.Offset * 0.25,
                        0.5,
                        canvasSize.Y.Offset * 0.25 - canvasSize.X.Offset * 0.25,
                    )
                }
                Size={UDim2.fromOffset(canvasSize.Y.Offset * 0.5, canvasSize.X.Offset * 0.5)}
                Rotation={90}
                BackgroundTransparency={1}
                // BackgroundTransparency={0.95}
                // BackgroundColor3={Color3.fromRGB(255, 0, 255)}
                Image={"rbxassetid://15952812715"} // alt: 15952811095
                ImageTransparency={0.5}
                ScaleType={"Tile"}
                TileSize={UDim2.fromOffset(100 * zoomScale, 100 * zoomScale)}
            />
        </>
    );
}
