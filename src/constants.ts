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

const zoneWidth = grid.width / 4
const zoneHeight = grid.height
const gridLeft = grid.x - grid.width/2 + zoneWidth/2

const zoneZ = -0.5


export const initialZones = [
    {
      position: new Vector3(gridLeft, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "red",
      value: 2,
    },
    {
      position: new Vector3(gridLeft+zoneWidth, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "blue",
      value: 3,
    },
    {
      position: new Vector3(gridLeft+zoneWidth*2, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "teal",
      value: 4,
    },
    {
        position: new Vector3(gridLeft+zoneWidth*3, 0, zoneZ),
        width: zoneWidth,
        height: zoneHeight,
        color: "lime",
        value: 8,
      },
  ]

export const MOVEMENT_DAMPING = 5

export const getMovement = (a: number, b: number) => {
  return a - b;
}