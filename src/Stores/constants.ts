import { Vector3 } from "three";
import { gridLeft, zoneHeight, zoneWidth, zoneZ } from "../constants";
import { Pattern, Players, WorldTile } from "./types"

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
  
export const worldTiles: WorldTile[] = [
    {
        position: {
            row: 0,
            column: 0
        }   
    },
    {
        position: {
            row: 0,
            column: 1
        }   
    },
    {
        position: {
            row: 0,
            column: 2
        }   
    },
    {
        position: {
            row: 0,
            column: 3
        }   
    }
]