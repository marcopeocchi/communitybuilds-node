import { Artifact, SearchStrategy, Weapon } from "../types/global";

export const artifactsMultipleSearchStrategy: SearchStrategy<Artifact> = {
    name: 'td.s95, td.s90, td.s67, td.s76',
    img: 'td>div>img',
    twoPieces: 'td.s91, td.s68, td.s81, td.s77',
    fourPieces: 'td.s92, td.s69, td.s87, td.s83',
}

export const weaponsMultipleSearchStrategy: SearchStrategy<Weapon> = {
    name: 'td.s28, td.s32, td.s57, td.s40, td.s46, td.s58, td.s33, td.s44',
    img: 'td>div>img',
    mainStat: 'td.s41, td.s29',
    subStat: 'td.s41, td.s29',
    passiveEffect: 'td.s42, td.s30'
}