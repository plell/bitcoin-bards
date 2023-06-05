import create from 'zustand'
import { Players, Pattern, Zone } from './types'
import { initialZones } from '../constants'
import { pattern } from './constants'

type GameState = {
    playerDied: boolean
    players: Players
    enemies: Players
    zones: Zone[]
    loopPattern: Pattern
    setPlayerDied: (playerDied: boolean) => void
    setPlayers: (players: Players) => void
    setEnemies: (enemies: Players) => void
    setZones: (zones: Zone[]) => void
    setLoopPattern: (loopPattern: Pattern) => void
}

export default create<GameState>((set, get) => ({
    playerDied: false,
    players: {},
    enemies: {},
    zones: initialZones,
    loopPattern: pattern,
    setPlayerDied: (playerDied) => set({ playerDied }),
    setPlayers: (players) => set({ players }),
    setEnemies: (enemies) => set({ enemies }),
    setZones: (zones) => set({ zones }),
    setLoopPattern: (loopPattern) =>  set({ loopPattern }),
}))