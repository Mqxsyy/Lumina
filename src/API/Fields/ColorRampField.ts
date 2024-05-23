import { IdPool } from "API/IdPool";
import type { Src } from "API/VFXScriptCreator";
import { ColorField, type SerializedColorField } from "./ColorField";
import { NodeField } from "./NodeField";

export interface ColorPoint {
    id: number;
    canEditTime: boolean;
    time: number;
    color: ColorField;
}

interface SerializedPoint {
    time: number;
    color: SerializedColorField;
}

interface SerializedData {
    startPoint: SerializedPoint;
    endPoint: SerializedPoint;
    colorPoints: SerializedPoint[];
}

export class ColorRampField extends NodeField {
    idPool = new IdPool();

    startPoint: ColorPoint = {
        id: this.idPool.GetNextId(),
        canEditTime: false,
        time: 0,
        color: new ColorField(0, 0, 1),
    };

    endPoint: ColorPoint = {
        id: this.idPool.GetNextId(),
        canEditTime: false,
        time: 1,
        color: new ColorField(0, 0, 0),
    };

    colorPoints: ColorPoint[] = [];

    GetAllPoints() {
        const points = [];

        points.push(this.startPoint);
        for (const point of this.colorPoints) {
            points.push(point);
        }
        points.push(this.endPoint);

        return points;
    }

    GetPoints() {
        return this.colorPoints;
    }

    CountPoints() {
        return this.colorPoints.size() + 2;
    }

    GetColor(t: number) {
        if (this.colorPoints.size() === 0) {
            return this.startPoint.color.GetColor().Lerp(this.endPoint.color.GetColor(), t);
        }

        let lastPoint = this.startPoint;
        for (const point of this.colorPoints) {
            if (t < point.time) {
                const alpha = (t - lastPoint.time) / (point.time - lastPoint.time);
                return lastPoint.color.GetColor().Lerp(point.color.GetColor(), alpha);
            }

            lastPoint = point;
        }

        const alpha = (t - lastPoint.time) / (this.endPoint.time - lastPoint.time);
        return lastPoint.color.GetColor().Lerp(this.endPoint.color.GetColor(), alpha);
    }

    GetGradient() {
        const points = [];

        points.push(this.startPoint);
        for (const point of this.colorPoints) {
            points.push(point);
        }
        points.push(this.endPoint);

        const keypoints = points.map((point) => new ColorSequenceKeypoint(point.time, point.color.GetColor()));
        return new ColorSequence(keypoints);
    }

    AddPoint(time: number, color: Vector3) {
        const data: ColorPoint = {
            id: this.idPool.GetNextId(),
            canEditTime: true,
            time,
            color: new ColorField(color.X, color.Y, color.Z),
        };

        this.colorPoints.push(data);
        this.colorPoints.sort((a, b) => a.time < b.time);
        this.FieldChanged.Fire();

        return data;
    }

    UpdatePointTime(id: number, time: number) {
        const index = this.colorPoints.findIndex((point) => point.id === id);
        if (index !== -1) {
            this.colorPoints[index].time = time;
        }
        this.colorPoints.sort((a, b) => a.time < b.time);
        this.FieldChanged.Fire();
    }

    RemovePoint(id: number) {
        delete this.colorPoints[this.colorPoints.findIndex((point) => point.id === id)];
        this.FieldChanged.Fire();
    }

    AutoGenerateField(fieldPath: string, src: Src) {
        const startPoint = this.startPoint.color;
        src.value += `${fieldPath}.startPoint.color.SetHSV(${startPoint.hue}, ${startPoint.saturation}, ${startPoint.value}) \n`;

        const endPoint = this.endPoint.color;
        src.value += `${fieldPath}.endPoint.color.SetHSV(${endPoint.hue}, ${endPoint.saturation}, ${endPoint.value}) \n`;

        const rampPoints = this.GetPoints();
        for (const point of rampPoints) {
            src.value += `${fieldPath}:AddPoint(${point.time}, Vector3.new(${point.color.hue}, ${point.color.saturation}, ${point.color.value})) \n`;
        }
    }

    SerializeData() {
        return {
            startPoint: {
                time: this.startPoint.time,
                color: this.startPoint.color.SerializeData(),
            },
            endPoint: {
                time: this.endPoint.time,
                color: this.endPoint.color.SerializeData(),
            },
            colorPoints: this.colorPoints.map((point) => ({
                time: point.time,
                color: point.color.SerializeData(),
            })),
        };
    }

    ReadSerializedData(data: SerializedData) {
        this.startPoint.time = data.startPoint.time;
        this.startPoint.color.ReadSerializedData(data.startPoint.color);

        this.endPoint.time = data.endPoint.time;
        this.endPoint.color.ReadSerializedData(data.endPoint.color);
        this.FieldChanged.Fire();

        for (const point of this.colorPoints) {
            this.AddPoint(point.time, new Vector3(point.color.hue, point.color.saturation, point.color.value));
        }
    }
}
