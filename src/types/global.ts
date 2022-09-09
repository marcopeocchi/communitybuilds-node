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

export type APIResponse = {
    data: GenshinCharacter[]
}

export type Sheet = Record<GenshinElement, APIResponse>
