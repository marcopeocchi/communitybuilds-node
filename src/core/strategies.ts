import { Artifact, SearchStrategy, Weapon } from "../types/global";

export const artifactsMultipleSearchStrategy: SearchStrategy<Artifact> = {
    name: 'td.s94, td.s89, td.s66, td.s75',
    img: 'td.s93>div>img, td.s92>div>img, td.83>div>img',
    twoPieces: 'td.s90, td.s67, td.s80, td.s76',
    fourPieces: 'td.s91, td.s68, td.s86, td.s82',
}

export const weaponsMultipleSearchStrategy: SearchStrategy<Weapon> = {
    name: 'td.s27, td.s31, td.s56, td.s39, td.s45, td.s57, td.s32, td.s43',
    img: 'td.s42>div>img, td.s30>div>img',
    mainStat: 'td.s40, td.s28',
    subStat: 'td.s40, td.s28',
    passiveEffect: 'td.s41, td.s29'
}