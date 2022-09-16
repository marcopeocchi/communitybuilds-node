import * as cheerio from 'cheerio';
import { googleDocsArtifacts, googleDocsArtifactsPath, httpHeaders } from './constants';
import myHttp from './http';

import LRUCache from 'lru-cache';
import { APIResponse, Artifact, GenshinWeapons, SearchStrategy, Weapon } from '../types/global';
import {
    artifactsMultipleSearchStrategy,
    weaponsMultipleSearchStrategy,
} from './strategies';
import { bumpClassBy, Decouple } from './utils';

const CLASS_BUMPS = 50

const cache = new LRUCache<string, Weapon[] | Artifact[]>({
    max: 50,
    ttl: 1000 * 60,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
})

/**
 * Scrape google docs published page to fetch data of all weapons
 * @param type genshin weapon type/kind to fetch
 * @returns standard api response with weapons data
 */
export async function findWeapons(type: GenshinWeapons): Promise<APIResponse<Weapon>> {
    if (cache.peek(type)) {
        return new Promise<APIResponse<Weapon>>((resolve) => resolve({
            data: cache.get(type) as Weapon[]
        }))
    }

    const res = await myHttp.html(googleDocsArtifacts, {
        path: googleDocsArtifactsPath,
        headers: httpHeaders,
    })

    const typeMapping: Record<GenshinWeapons, number> = {
        claymores: 2,
        swords: 3,
        catalysts: 4,
        polearms: 5,
        bows: 6,
    }

    const $ = cheerio.load(res)

    const tbody = $('tbody')[typeMapping[type]]
    const trs = $(tbody).find('tr')

    const fetchClosure = (weaponsMultipleSearchStrategy: SearchStrategy<Weapon>) => {
        const weapons: Array<Weapon> = Array.from(trs).map((tr, idx) => {
            const name = $(tr).find(Decouple($(weaponsMultipleSearchStrategy.name))).first().text()
            // img sists on the next tr 🙄
            const img = (idx + 1) < trs.length ? $(trs[idx + 1]).find('img').attr('src') : ''

            const [mainStats, subStats] = $(tr).find(Decouple($(weaponsMultipleSearchStrategy.mainStat)))
            const passives = $(tr).find(Decouple($(weaponsMultipleSearchStrategy.passiveEffect))).first().text()

            if (name && mainStats && subStats && passives) {
                const [baseATKlv1, baseATKlv90] = $(mainStats).text().replace('Base ATK:', '').split('/')
                const [subStatType, numValues] = $(subStats).text().split(':')
                const [subStatLv1, subStatLv90] = numValues.split('/')

                return {
                    name: name,
                    img: img,
                    mainStat: {
                        baseATKlv1: Number(baseATKlv1.trim()),
                        baseATKlv90: Number(baseATKlv90.trim())
                    },
                    subStat: {
                        type: subStatType,
                        valueLv1: Number(subStatLv1),
                        valueLv90: Number(subStatLv90)
                    },
                    passiveEffect: passives
                }
            }
            return undefined
        }).filter(Boolean) as Weapon[]

        return {
            data: weapons
        }
    }

    for (let i = 0; i <= CLASS_BUMPS; i++) {
        const artifacts = fetchClosure(bumpClassBy<Weapon>(weaponsMultipleSearchStrategy, i))
        if (artifacts) {
            cache.set('artifacts', artifacts.data)
            return artifacts
        }
    }

    return { data: [] }
}

/**
 * Scrape google docs published page to fetch data of all artifacts
 * @returns standard api response with artifacts data
 */
export async function findArtifacts(): Promise<APIResponse<Artifact>> {
    if (cache.peek('artifacts')) {
        return new Promise<APIResponse<Artifact>>((resolve) => resolve({
            data: cache.get('artifacts') as Artifact[]
        }))
    }

    const res = await myHttp.html(googleDocsArtifacts, {
        path: googleDocsArtifactsPath,
        headers: httpHeaders,
    })

    const $ = cheerio.load(res)

    const tbody = $('tbody')[7]
    const trs = $(tbody).find('tr')

    const fetchClosure = (artifactsMultipleSearchStrategy: SearchStrategy<Artifact>) => {
        const artifacts: Array<Artifact> = Array.from(trs).map((tr, idx) => {
            const name = $(tr).find(Decouple($(artifactsMultipleSearchStrategy.name))).first().text()
            // img sists on the next tr 🙄
            const img = (idx + 1) < trs.length ? $(trs[idx + 1]).find('img').attr('src') : ''

            const twoPieces = $(tr).find(Decouple($(artifactsMultipleSearchStrategy.twoPieces))).text()
            const fourPieces = $(tr).find(Decouple($(artifactsMultipleSearchStrategy.fourPieces))).text()

            if (name && twoPieces && fourPieces) {
                return {
                    name: name,
                    img: img,
                    twoPieces: twoPieces,
                    fourPieces: fourPieces,
                }
            }
            return undefined
        }).filter(Boolean) as Artifact[]

        return {
            data: artifacts
        }
    }

    for (let i = 0; i <= CLASS_BUMPS; i++) {
        const artifacts = fetchClosure(bumpClassBy<Artifact>(artifactsMultipleSearchStrategy, i))
        if (artifacts) {
            cache.set('artifacts', artifacts.data)
            return artifacts
        }
    }

    return { data: [] }
}