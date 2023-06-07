import { Vector3 } from "three"
import { Direction, TilePosition, WorldTile,  Pattern, Players, } from "./types"

function generateWorld() {
  const totalTiles = 200
  const columnLimit = 15
  
  const tiles: WorldTile[] = []
  
  let row = 0
  let column = 0
  
  for (let i = 0; i < totalTiles; i += 1){
    var randomColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
      
    tiles.push({
          position: {
              row,
              column
          },
          color: randomColor
    }) 

    column += 1 
    
    if (column > columnLimit) {
      row += 1
      column = 0
    }
  }

  console.log('tiles',tiles)

  return tiles
}

export const worldTiles = generateWorld()

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


export const MOVEMENT_DAMPING = 5

const reuseableVector3 = new Vector3()

export const getMovement = (from: Vector3, to: Vector3, speed = 1, ratio = 0.5) => {
    let amp = 3
    const distance = from.distanceTo(to)
    
    if (distance < 10) {
        amp = 4
    }

    const x =  (to.x - from.x) * ratio
    const y =  (to.y - from.y) * ratio
    const z = from.z

  return reuseableVector3.set(x*speed*amp,y*speed*amp,z);
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
  

export const pattern: Pattern = {
    stepCount: 10,
    notes: [
        {
            id: 1,
            step: 1,
            pitch: 200
            
        },
        {
            id: 2,
            step: 2,
            pitch: 300
            
        },
        {
            id: 3,
            step: 7,
            pitch: 400
            
        },
        {
            id: 4,
            step: 9,
            pitch: 500
        }
    ]
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