import create from 'zustand'
import { Players, Pattern, Zone, WorldTile, NextWorldTile } from './types'
import {  initialEnemyState, initialZones, worldTiles, defaultTempo } from './constants'

type GameState = {
    tempo: number
    attack: boolean
    players: Players
    enemies: Players
    zones: Zone[]
    world: WorldTile[]
    worldTile: WorldTile
    discoveredWorldTiles: number[]
    nextWorldTile: NextWorldTile | null
    setTempo: (tempo: number) => void
    setAttack: (attack: boolean) => void
    setPlayers: (players: Players) => void
    setEnemies: (enemies: Players) => void
    setZones: (zones: Zone[]) => void
    setWorld: (world: WorldTile[]) => void
    setWorldTile: (worldTile: WorldTile) => void
    setDiscoveredWorldTiles: (discoveredWorldTiles: number[]) => void
    setNextWorldTile: (nextWorldTile: NextWorldTile | null) => void
    setTempoUp: () => void,
    setTempoDown: () => void,
}

export default create<GameState>((set, get) => ({
    attack: false,
    players: {},
    enemies: initialEnemyState,
    zones: initialZones,
    world: worldTiles,
    worldTile: worldTiles.filter(f=>!f.shrine)[Math.floor(Math.random()*worldTiles.filter(f=>!f.shrine).length)],
    discoveredWorldTiles: [],
    nextWorldTile: null,
    tempo: defaultTempo,
    setTempoUp: () => {
        const tempo = get().tempo + 2

        if (tempo <= 70) {
            set({ tempo })    
        }
        
    },
    setTempoDown: () => {
        const tempo = get().tempo - 2

        if (tempo >= 0) {
            set({ tempo })    
        }
        
    },
    setTempo: (tempo) => set({ tempo }),
    setAttack: (attack) => set({ attack }),
    setPlayers: (players) => set({ players }),
    setEnemies: (enemies) => set({ enemies }),
    setZones: (zones) => set({ zones }),
    setWorld: (world) => set({ world }),
    setWorldTile: (worldTile) => set({ worldTile }),
    setNextWorldTile: (nextWorldTile) => set({ nextWorldTile }),
    setDiscoveredWorldTiles: (discoveredWorldTiles) => set({ discoveredWorldTiles }),
}))