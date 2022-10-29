import { Artifact, SearchStrategy, Weapon } from "../types/global";

export const artifactsMultipleSearchStrategy: SearchStrategy<Artifact> = {
    name: 'td.s96, td.s91, td.s68, td.s77',
    img: 'td>div>img',
    twoPieces: 'td.s92, td.s69, td.s82, td.s78, td.s97',
    fourPieces: 'td.s93, td.s70, td.s88, td.s84, td.s98',
}

export const weaponsMultipleSearchStrategy: SearchStrategy<Weapon> = {
    name: 'td.s29, td.s57, td.s41, td.s46, td.s58, td.s33, td.s44, td.s45, td.s49, td.s34',
    img: 'td>div>img',
    mainStat: 'td.s42, td.s30, td.s50',
    subStat: 'td.s42, td.s30, td.s50',
    passiveEffect: 'td.s43, td.s31, td.s51'
}