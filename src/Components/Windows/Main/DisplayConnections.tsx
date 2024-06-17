import { memo, useEffect, useState } from "@rbxts/react";
import { ReloadConnectionVisuals } from "Components/Events";
import { GetAllConnections } from "Services/ConnectionsService";

function DisplayConnections() {
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

export default memo(DisplayConnections);
