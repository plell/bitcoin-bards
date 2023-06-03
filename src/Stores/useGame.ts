import create from 'zustand'
import { BodyRefs, Zone } from './types'
import { initialZones } from '../constants'

type GameState = {
    playerBodyRefs: BodyRefs
    eenemyBodyRefs: BodyRefs
    zones: Zone[]
    setPlayerBodyRefs: (playerBodyRefs: BodyRefs) => void
    setEnemyBodyRefs: (eenemyBodyRefs: BodyRefs) => void
    setZones: (zones: Zone[]) => void
}

export default create<GameState>((set, get) => ({
    playerBodyRefs: {},
    eenemyBodyRefs: {},
    zones: initialZones,
    setPlayerBodyRefs: (playerBodyRefs) => set({ playerBodyRefs }),
    setEnemyBodyRefs: (eenemyBodyRefs) => set({ eenemyBodyRefs }),
    setZones: (zones) =>  set({ zones }),
}))