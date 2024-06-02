import { useEffect, useState } from "@rbxts/react";
import { FastEvent } from "API/Bindables/FastEvent";
import { GetAllConnections } from "Services/ConnectionsService";

export const ReloadConnectionVisuals = new FastEvent();

export default function DisplayConnections() {
    const [_, setForceRender] = useState(0);

    useEffect(() => {
        const connection = ReloadConnectionVisuals.Connect(() => {
            setForceRender((prev) => prev + 1);
        });

        return () => {
            connection.Disconnect();
        };
    }, []);

    return GetAllConnections().map((connection) => {
        return connection.create(connection.data);
    });
}
