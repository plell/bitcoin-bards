import create from 'zustand'
import { Players, Pattern, Zone } from './types'
import { pattern, initialEnemyState, initialZones } from './constants'

type GameState = {
    attack: boolean
    players: Players
    enemies: Players
    zones: Zone[]
    loopPattern: Pattern
    setAttack: (attack: boolean) => void
    setPlayers: (players: Players) => void
    setEnemies: (enemies: Players) => void
    setZones: (zones: Zone[]) => void
    setLoopPattern: (loopPattern: Pattern) => void
}

export default create<GameState>((set, get) => ({
    attack: false,
    players: {},
    enemies: initialEnemyState,
    zones: initialZones,
    loopPattern: pattern,
    setAttack: (attack) => set({ attack }),
    setPlayers: (players) => set({ players }),
    setEnemies: (enemies) => set({ enemies }),
    setZones: (zones) => set({ zones }),
    setLoopPattern: (loopPattern) =>  set({ loopPattern }),
}))