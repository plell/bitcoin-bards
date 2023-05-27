import { Vector3 } from "three"

export type PlayerPosition = Vector3
export type PlayerPositions = Record<string, Vector3>
export type Zone = {
    position: Vector3
    height: number;
    width: number;
    color: string;
    value: number;
}

