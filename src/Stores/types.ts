import { Vector3 } from "three"
import { RapierRigidBody } from "@react-three/rapier"

export type PlayerPosition = Vector3

export type Players = Record<string, Player>

export type Player = {
    id: string | number
    body: React.MutableRefObject<RapierRigidBody | null> | null
    health: number
    type: string
    dead: boolean
}

export type Zone = {
    position: Vector3
    height: number;
    width: number;
    color: string;
    value: number;
}

export type Note = {
    id: number
    step: number
    pitch: number
}

export type Pattern = {
    stepCount: number
    notes: Note[]
}

export type Interval = ReturnType<typeof setInterval> | null;
export type Timeout = ReturnType<typeof setTimeout> | null;