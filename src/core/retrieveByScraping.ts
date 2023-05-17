import * as cheerio from 'cheerio'
import {
  googleDocsArtifacts,
  googleDocsArtifactsPath,
  httpHeaders
} from './constants'
import myHttp from './http'

import LRUCache from 'lru-cache'
import {
  APIResponse,
  Artifact,
  GenshinWeapons,
  SearchStrategy,
  Weapon
} from '../types'
import {
  artifactsMultipleSearchStrategy,
  weaponsMultipleSearchStrategy,
} from './strategies'
import { bumpClassBy, decouple } from './utils'
import * as O from 'fp-ts/Option'

const CLASS_BUMPS = 100

const cache = new LRUCache<string, Weapon[] | Artifact[]>({
  max: 50,
  ttl: 1000 * 60 * 60,
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
})

const typeMapping: Record<GenshinWeapons, number> = {
  claymores: 2,
  swords: 3,
  catalysts: 4,
  polearms: 5,
  bows: 6,
}

/**
 * Scrape google docs published page to fetch data of all weapons
 * @param type genshin weapon type/kind to fetch
 * @returns standard api response with weapons data
 */
export async function findWeapons(type: GenshinWeapons): Promise<O.Option<APIResponse<Weapon>>> {
  if (cache.peek(type)) {
    return O.some({
      data: cache.get(type)!
    })
  }

  const res = await myHttp.html(googleDocsArtifacts, {
    path: googleDocsArtifactsPath,
    headers: httpHeaders,
  })

  const $ = cheerio.load(res)

  const tbody = $('tbody')[typeMapping[type]]
  const trs = $(tbody).find('tr')

  const fetchClosure = (weaponsMultipleSearchStrategy: SearchStrategy<Weapon>) => {
    const weapons: Array<Weapon> = Array.from(trs).map((tr, idx) => {
      const name = $(tr).find(decouple($(weaponsMultipleSearchStrategy.name))).first().text()
      // img sists on the next tr 🙄
      const img = (idx + 1) < trs.length ? $(trs[idx + 1]).find('img').attr('src') : ''

      const [mainStats, subStats] = $(tr).find(decouple($(weaponsMultipleSearchStrategy.mainStat)))
      const passives = $(tr).find(decouple($(weaponsMultipleSearchStrategy.passiveEffect))).first().text()

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
    if (artifacts && artifacts.data && artifacts.data.length > 0) {
      cache.set('artifacts', artifacts.data)
      return O.some(artifacts)
    }
  }

  return O.none
}

/**
 * Scrape google docs published page to fetch data of all artifacts
 * @returns standard api response with artifacts data
 */
export async function findArtifacts(): Promise<O.Option<APIResponse<Artifact>>> {
  if (cache.peek('artifacts')) {
    return O.some({
      data: cache.get('artifacts')!
    })
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
      const name = $(tr).find(decouple($(artifactsMultipleSearchStrategy.name))).first().text()
      // img sists on the next tr 🙄
      const img = (idx + 1) < trs.length ? $(trs[idx + 1]).find('img').attr('src') : ''

      const twoPieces = $(tr).find(decouple($(artifactsMultipleSearchStrategy.twoPieces))).text()
      const fourPieces = $(tr).find(decouple($(artifactsMultipleSearchStrategy.fourPieces))).text()

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
    if (artifacts && artifacts.data && artifacts.data.length > 0) {
      cache.set('artifacts', artifacts.data)
      return O.some(artifacts)
    }
  }

  return O.none
}