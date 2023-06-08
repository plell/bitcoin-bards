import create from 'zustand'
import { Players, Pattern, Zone, WorldTile, NextWorldTile } from './types'
import { pattern, initialEnemyState, initialZones, worldTiles } from './constants'

type GameState = {
    attack: boolean
    players: Players
    enemies: Players
    zones: Zone[]
    loopPattern: Pattern
    worldTile: WorldTile
    discoveredWorldTiles: number[]
    nextWorldTile: NextWorldTile | null
    setAttack: (attack: boolean) => void
    setPlayers: (players: Players) => void
    setEnemies: (enemies: Players) => void
    setZones: (zones: Zone[]) => void
    setLoopPattern: (loopPattern: Pattern) => void
    setWorldTile: (worldTile: WorldTile) => void
    setDiscoveredWorldTiles: (discoveredWorldTiles: number[]) => void
    setNextWorldTile: (nextWorldTile: NextWorldTile | null) => void
}

export default create<GameState>((set, get) => ({
    attack: false,
    players: {},
    enemies: initialEnemyState,
    zones: initialZones,
    loopPattern: pattern,
    worldTile: worldTiles[worldTiles.length / 2],
    discoveredWorldTiles: [],
    nextWorldTile: null,
    setAttack: (attack) => set({ attack }),
    setPlayers: (players) => set({ players }),
    setEnemies: (enemies) => set({ enemies }),
    setZones: (zones) => set({ zones }),
    setLoopPattern: (loopPattern) => set({ loopPattern }),
    setWorldTile: (worldTile) => set({ worldTile }),
    setNextWorldTile: (nextWorldTile) => set({ nextWorldTile }),
    setDiscoveredWorldTiles: (discoveredWorldTiles) => set({ discoveredWorldTiles }),
}))