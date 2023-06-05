import { Vector3 } from "three"

export const controls = [
    {
        name: 'up',
        keys: ['ArrowUp', 'KeyW']
    },
    {
        name: 'down',
        keys: ['ArrowDown', 'KeyS']
    },
    {
        name: 'left',
        keys: ['ArrowLeft', 'KeyA']
    },
    {
        name: 'right',
        keys: ['ArrowRight', 'KeyD']
    }
]

export const grid = {
    x: 0,
    y: 0,
    z: -1,
    width: 60,
    height: 50
}

export const zoneWidth = grid.width / 4
export const zoneHeight = grid.height
export const gridLeft = grid.x - grid.width/2 + zoneWidth/2
export const zoneZ = -0.5



export const MOVEMENT_DAMPING = 5

export const getMovement = (a: number, b: number) => {
  return a - b;
}