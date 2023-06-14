import { Vector3 } from "three"
import { Direction, TilePosition, WorldTile,  Players, Note, } from "./types"

export const columnLimit = 15



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

const randomColor = () => {
  return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

function generateWorld() {
  const totalTiles = 200
  const shrineCount = 20
  
  const tiles: WorldTile[] = []
  
  let row = 0
  let column = 0
  
  for (let i = 0; i < totalTiles; i += 1){
    tiles.push({
      position: {
          row,
          column
      },
      color: randomColor(),
      id: i,
      pattern: generatePattern(),
      shrine: null
    }) 

    column += 1 
    
    if (column > columnLimit) {
      row += 1
      column = 0
    }
  }

  for (let i = 0; i < shrineCount; i++){
    // place castles
    let index = Math.floor(Math.random() * totalTiles)
    
    tiles[index].shrine = {
      position: new Vector3(grid.top - grid.height/2,grid.right- grid.width/2,0),
      color: randomColor()
    }  
  }


  console.log('tiles',tiles)

  return tiles
}

export const worldTiles = generateWorld()


export const MOVEMENT_DAMPING = 5

export const getMovement = (from: Vector3, to: Vector3, speed = 1, ratio = 0.5) => {
  let amp = 40
  
  // slingshot movement
  // const x =  (to.x - from.x) * ratio
  // const y =  (to.y - from.y) * ratio
  // const z = from.z

  const direction = to.sub(from).normalize()
  direction.x *= ratio*speed*amp
  direction.y *= ratio*speed*amp

  return direction
}



type WallCheck = {
    name: Direction;
    check: (position: TilePosition) => TilePosition;
  };
  
  const directionsCheck: WallCheck[] = [
    {
      name: "right",
      check: (position: TilePosition) => ({
        ...position,
        column: position.column + 1,
      }),
    },
    {
      name: "left",
      check: (position: TilePosition) => ({
        ...position,
        column: position.column - 1,
      }),
    },
    {
      name: "top",
      check: (position: TilePosition) => ({
        ...position,
        row: position.row - 1,
      }),
    },
    {
      name: "bottom",
      check: (position: TilePosition) => ({
        ...position,
        row: position.row + 1,
      }),
    },
  ];

export type NeighborTiles = {
    top: WorldTile | null
    right: WorldTile | null
    left: WorldTile | null
    bottom: WorldTile | null
}

export const getNeighborTiles = (worldTilePosition: TilePosition) => {
    const neighborTiles: NeighborTiles = {
        'top': null,
        'right': null,
        'left': null,
        'bottom': null, 
    }
    
    directionsCheck.forEach((d) => {
        const { row, column } = d.check(worldTilePosition);
  
        const tileFound = worldTiles.find(
          (f) => f.position.row === row && f.position.column === column
        );
  
        if (tileFound) {
            neighborTiles[d.name] = tileFound
        }
    });
    
    return neighborTiles
}
  


function generatePattern() {

  const allNotes: string[] = [
    'A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3',
    'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4',
    'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5',
  ]

  let stepCount = Math.floor(Math.random() * 40)
  
  let noteCount = Math.floor(Math.random() * stepCount) + 3

  const notes: Note[] = []

  for (let i = 0; i < noteCount; i += 1){

    const randomStep = Math.floor(Math.random() * noteCount)
    const randomY = Math.floor(Math.random() * grid.height) - (grid.height / 2)

    notes.push({
        id: i,
        step: randomStep,
        y: randomY,
        pitch: allNotes[Math.floor(Math.random() * notes.length)]
    })
  }
  
  return {
    stepCount,
    notes
  }
}

export const initialEnemyState: Players = {};

export const zoneWidth = grid.width / 4
export const zoneHeight = grid.height
export const zoneZ = -0.5

const zoneLeft = grid.left + zoneWidth/2

export const initialZones = [
    {
      position: new Vector3(zoneLeft, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "red",
      value: 2,
    },
    {
      position: new Vector3(zoneLeft+zoneWidth, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "blue",
      value: 3,
    },
    {
      position: new Vector3(zoneLeft+zoneWidth*2, 0, zoneZ),
      width: zoneWidth,
      height: zoneHeight,
      color: "teal",
      value: 4,
    },
    {
        position: new Vector3(zoneLeft+zoneWidth*3, 0, zoneZ),
        width: zoneWidth,
        height: zoneHeight,
        color: "lime",
        value: 8,
      },
]

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

let bufferTimeout: ReturnType<typeof setTimeout>|null = null;
export const postDebounce = (fn: Function, ms = 300) => {
  if (!bufferTimeout) {
    fn()
    bufferTimeout = setTimeout(() => {
      if (bufferTimeout) {
        clearTimeout(bufferTimeout)   
        bufferTimeout = null
      }
    }, ms)
  }
};