import { Vector3 } from 'three'
import create from 'zustand'
import { PlayerPositions, Zone } from './types'
import { initialZones } from '../constants'

type GameState = {
    playerPositions: Record<string, Vector3>
    enemyPositions: Record<string, Vector3>
    zones: Zone[]
    setPlayerPositions: (playerPositions: PlayerPositions) => void
    setEnemyPositions: (enemyPositions: PlayerPositions) => void
    setZones: (zones: Zone[]) => void
}

export default create<GameState>((set, get) => ({
    playerPositions: {},
    enemyPositions: {},
    zones: initialZones,
    setPlayerPositions: (playerPositions) => set({ playerPositions }),
    setEnemyPositions: (enemyPositions) => set({ enemyPositions }),
    setZones: (zones) =>  set({ zones }),
}))