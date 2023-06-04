import create from 'zustand'
import { BodyRefs, Pattern, Zone } from './types'
import { initialZones } from '../constants'
import { pattern } from './constants'

type GameState = {
    playerBodyRefs: BodyRefs
    enemyBodyRefs: BodyRefs
    zones: Zone[]
    loopPattern: Pattern
    setPlayerBodyRefs: (playerBodyRefs: BodyRefs) => void
    setEnemyBodyRefs: (enemyBodyRefs: BodyRefs) => void
    setZones: (zones: Zone[]) => void
    setLoopPattern: (loopPattern: Pattern) => void
}

export default create<GameState>((set, get) => ({
    playerBodyRefs: {},
    enemyBodyRefs: {},
    zones: initialZones,
    loopPattern: pattern,
    setPlayerBodyRefs: (playerBodyRefs) => set({ playerBodyRefs }),
    setEnemyBodyRefs: (enemyBodyRefs) => set({ enemyBodyRefs }),
    setZones: (zones) => set({ zones }),
    setLoopPattern: (loopPattern) =>  set({ loopPattern }),
}))