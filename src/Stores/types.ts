import { Vector3 } from "three"
import { RapierRigidBody } from "@react-three/rapier"

export type PlayerPosition = Vector3

export type playerBodyRefs = Record<string, React.MutableRefObject<RapierRigidBody | null>>

export type BodyRefs = Record<string, React.MutableRefObject<RapierRigidBody | null>>

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
