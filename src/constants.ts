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

const gridX = 0
const gridY = 0
const gridZ = -1
const gridWidth = 60
const gridHeight = 40

export const grid = {
    x: gridX,
    y: gridY,
    z: gridZ,
    width: gridWidth,
    height: gridHeight,
    left: gridX - gridWidth/2,
    right:gridX + gridWidth/2,
    top: gridY + gridHeight/2,
    bottom: gridY - gridHeight/2,
}

export const zoneWidth = grid.width / 4
export const zoneHeight = grid.height
export const gridLeft = grid.x - grid.width/2 + zoneWidth/2
export const zoneZ = -0.5

export const MOVEMENT_DAMPING = 5

export const getMovement = (a: number, b: number) => {
  return a - b;
}