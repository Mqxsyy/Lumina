import { IdPool } from "API/IdPool";
import { LerpNumber } from "API/Lib";
import type { Src } from "API/VFXScriptCreator";
import { NodeField } from "./NodeField";

export interface GraphPoint {
    id: number;
    canEditTime: boolean;
    time: number;
    value: number;
}

interface SerializedPoint {
    time: number;
    value: number;
}

interface SerializedData {
    startPoint: SerializedPoint;
    endPoint: SerializedPoint;
    graphPoints: SerializedPoint[];
}

export class LineGraphField extends NodeField {
    idPool = new IdPool();

    startPoint: GraphPoint = {
        id: this.idPool.GetNextId(),
        canEditTime: false,
        time: 0,
        value: 0,
    };

    endPoint: GraphPoint = {
        id: this.idPool.GetNextId(),
        canEditTime: false,
        time: 1,
        value: 0,
    };

    graphPoints: GraphPoint[] = [];

    constructor(startValue = 0, endValue = 0) {
        super();
        this.startPoint.value = startValue;
        this.endPoint.value = endValue;
    }

    GetAllPoints() {
        const points = [];

        points.push(this.startPoint);
        for (const point of this.graphPoints) {
            points.push(point);
        }
        points.push(this.endPoint);

        return points;
    }

    GetPoints() {
        return this.graphPoints;
    }

    GetNumber(t: number) {
        if (this.graphPoints.size() === 0) {
            return LerpNumber(this.startPoint.value, this.endPoint.value, t);
        }

        let lastPoint = this.startPoint;
        for (const point of this.graphPoints) {
            if (t < point.time) {
                return LerpNumber(lastPoint.value, point.value, (t - lastPoint.time) / (point.time - lastPoint.time));
            }

            lastPoint = point;
        }

        return LerpNumber(lastPoint.value, this.endPoint.value, (t - lastPoint.time) / (this.endPoint.time - lastPoint.time));
    }

    AddPoint(time: number, value: number) {
        const data: GraphPoint = {
            id: this.idPool.GetNextId(),
            canEditTime: true,
            time,
            value,
        };

        this.graphPoints.push(data);
        this.graphPoints.sort((a, b) => a.time < b.time);
        this.FieldChanged.Fire();

        return data;
    }

    UpdatePoint(id: number, time: number, value: number, fireEvent = true) {
        if (id === this.startPoint.id) {
            this.UpdatePointValues(this.startPoint, time, value);
        } else if (id === this.endPoint.id) {
            this.UpdatePointValues(this.endPoint, time, value);
        } else {
            const index = this.graphPoints.findIndex((point) => point.id === id);
            if (index !== -1) {
                this.UpdatePointValues(this.graphPoints[index], time, value);
            }
        }

        this.graphPoints.sort((a, b) => a.time < b.time);

        if (fireEvent) {
            this.FieldChanged.Fire();
        }
    }

    RemovePoint(id: number) {
        delete this.graphPoints[this.graphPoints.findIndex((point) => point.id === id)];
        this.FieldChanged.Fire();
    }

    AutoGenerateField(fieldPath: string, src: Src) {
        src.value += `${fieldPath}.startPoint.value = ${this.startPoint.value} \n`;
        src.value += `${fieldPath}.endPoint.value = ${this.endPoint.value} \n`;

        const graphPoints = this.GetPoints();
        for (const point of graphPoints) {
            src.value += `${fieldPath}:AddPoint(${point.time}, ${point.value}) \n`;
        }
    }

    SerializeData() {
        return {
            startPoint: {
                time: this.startPoint.time,
                value: this.startPoint.value,
            },
            endPoint: {
                time: this.endPoint.time,
                value: this.endPoint.value,
            },
            graphPoints: this.graphPoints.map((point) => ({
                time: point.time,
                value: point.value,
            })),
        };
    }

    ReadSerializedData(data: SerializedData) {
        this.startPoint.time = data.startPoint.time;
        this.startPoint.value = data.startPoint.value;

        this.endPoint.time = data.endPoint.time;
        this.endPoint.value = data.endPoint.value;
        this.FieldChanged.Fire();

        for (const point of data.graphPoints) {
            this.AddPoint(point.time, point.value);
        }
    }

    private UpdatePointValues(point: GraphPoint, time: number, value: number) {
        if (point.canEditTime) {
            point.time = time;
        }

        point.value = value;
    }
}
