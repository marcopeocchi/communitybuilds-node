export type GenshinCharacterBuild = {
    role: string,
    equipment: string[]
    artifacts: string[]
    optimal: boolean
    notes?: string
}

export type GenshinCharacter = {
    name: string
    builds: GenshinCharacterBuild[]
}

export type GenshinElement = 'pyro' | 'hydro' | 'anemo' | 'electro' | 'dendro' | 'cryo' | 'geo'
export type GenshinWeapons = 'claymores' | 'swords' | 'catalysts' | 'polearms' | 'bows'

export type APIResponse<T> = {
    data: T[]
}

export type Sheet = Record<GenshinElement, APIResponse<GenshinCharacter>>

export type Artifact = {
    name: string
    img?: string
    twoPieces: string
    fourPieces: string
}

export type Weapon = {
    name: string
    img?: string,
    mainStat: {
        baseATKlv1: number
        baseATKlv90: number
    }
    subStat: {
        type: string
        valueLv1: number
        valueLv90: number
    }
    passiveEffect?: string
}

export type SearchStrategy<T> = Record<keyof T, string>
export type SearchStrategyMapping = Record<GenshinWeapons, SearchStrategy<Weapon>>
