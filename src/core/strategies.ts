import { Artifact, SearchStrategy, Weapon } from '../types/index.js'

export const artifactsMultipleSearchStrategy: SearchStrategy<Artifact> = {
    name: 'td.s96, td.s92, td.s68, td.s78',
    img: 'td>div>img',
    twoPieces: 'td.s93, td.s70, td.s83, td.s79, td.s98',
    fourPieces: 'td.s94, td.s71, td.s89, td.s85, td.s99',
}

export const weaponsMultipleSearchStrategy: SearchStrategy<Weapon> = {
    name: 'td.s30, td.s58, td.s42, td.s47, td.s59, td.s34, td.s45, td.s46, td.s50, td.s35',
    img: 'td>div>img',
    mainStat: 'td.s43, td.s31, td.s51',
    subStat: 'td.s43, td.s31, td.s51',
    passiveEffect: 'td.s44, td.s32, td.s52'
}