import * as cheerio from 'cheerio';
import { googleDocsArtifacts, googleDocsArtifactsPath, httpHeaders } from '../core/constants';
import myHttp from '../core/http';
import { Weapon } from '../types/global';
import { findWeapons } from '../core/retrieveScraping'
import { CommunityBuilds } from '../index'

describe("scrape google docs page", () => {
    it("returns valid html", async () => {
        const res = await myHttp.html(googleDocsArtifacts, {
            path: googleDocsArtifactsPath,
            headers: httpHeaders,
        })
        const $ = cheerio.load(res)
        const data = $.html()
        expect(data).toBeDefined()
    })
    it("finds tbodys", async () => {
        const res = await myHttp.html(googleDocsArtifacts, {
            path: googleDocsArtifactsPath,
            headers: httpHeaders,
        })
        const $ = cheerio.load(res)
        const tbodys = $('tbody')
        expect(tbodys).toHaveLength(9)
    })
    it("finds valid src for each weapons tbody", async () => {
        const res = await myHttp.html(googleDocsArtifacts, {
            path: googleDocsArtifactsPath,
            headers: httpHeaders,
        })

        const $ = cheerio.load(res)
        const tbodysWeapons = $('tbody').slice(2, 7)

        for (const tbody of tbodysWeapons) {
            const imgs5stars = $(tbody).find($('tr>td.s30>div>img'))
            for (const img of imgs5stars) {
                const [src] = img.attributes.filter(attr => attr.name === 'src')
                expect(src).toBeDefined
            }
            const imgs4stars = $(tbody).find($('tr>td.s42>div>img'))
            for (const img of imgs4stars) {
                const [src] = img.attributes.filter(attr => attr.name === 'src')
                expect(src).toBeDefined
            }
            const imgs3stars = $(tbody).find($('tr>td.s51>div>img'))
            for (const img of imgs3stars) {
                const [src] = img.attributes.filter(attr => attr.name === 'src')
                expect(src).toBeDefined
            }
        }
    })
    it("finds valid src for artifact tbody", async () => {
        const res = await myHttp.html(googleDocsArtifacts, {
            path: googleDocsArtifactsPath,
            headers: httpHeaders,
        })

        const $ = cheerio.load(res)
        const tbody = $('tbody')[7]

        const imgs5stars = $(tbody).find($('tr>td.s92>div>img'))
        for (const img of imgs5stars) {
            const [src] = img.attributes.filter(attr => attr.name === 'src')
            expect(src).toBeDefined
        }
        const imgs4stars = $(tbody).find($('tr>td.s83>div>img'))
        for (const img of imgs4stars) {
            const [src] = img.attributes.filter(attr => attr.name === 'src')
            expect(src).toBeDefined
        }
        const imgs3stars = $(tbody).find($('tr>td.s69>div>img'))
        for (const img of imgs3stars) {
            const [src] = img.attributes.filter(attr => attr.name === 'src')
            expect(src).toBeDefined
        }
    })
    it("can provide data to build a Weapon object", async () => {
        const res = await myHttp.html(googleDocsArtifacts, {
            path: googleDocsArtifactsPath,
            headers: httpHeaders,
        })

        const $ = cheerio.load(res)
        const polearms = $('tbody')[5]

        const name = $(polearms).find($('tr>td.s31')).first().text()
        const [img] = $(polearms).find($('tr>td.s30>div>img')).toArray()
        const [mainStats, subStats] = $(polearms).find($('tr>td.s28'))
        const passives = $(polearms).find($('tr>td.s29')).first().text()

        const [baseATKlv1, baseATKlv90] = $(mainStats).text().replace('Base ATK:', '').split("/")
        const [subStatType, numValues] = $(subStats).text().split(':')
        const [subStatLv1, subStatLv90] = numValues.split('/')

        const weapon: Weapon = {
            name: name,
            img: img.attributes.filter(attr => attr.name === 'src').at(0)?.value!,
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

        expect(weapon.name).toBe('Vortex Vanquisher')
    })
    it("retrieve all 5 star claymores", async () => {
        const { data } = await findWeapons('claymores')
        expect(data.length).toBeGreaterThanOrEqual(5)
    })
    it("retrieve all 5 star bows", async () => {
        const { data } = await findWeapons('bows')
        expect(data.length).toBeGreaterThanOrEqual(6)
    })
    it("retrieve all 5 star polearms", async () => {
        const { data } = await findWeapons('polearms')
        expect(data.length).toBeGreaterThanOrEqual(6)
    })
    it("retrieve all 5 star catalysts", async () => {
        const { data } = await findWeapons('catalysts')
        expect(data.length).toBeGreaterThanOrEqual(5)
    })
    it("retrieve all 5 star swords", async () => {
        const { data } = await findWeapons('swords')
        expect(data.length).toBeGreaterThanOrEqual(7)
    })
    it("retrieve all 5 star catalysts from utility", async () => {
        const { data } = await CommunityBuilds.catalysts()
        expect(data.length).toBeGreaterThanOrEqual(5)
    })
    it("retrieve artifacts from utility", async () => {
        const { data } = await CommunityBuilds.artifacts()
        expect(data.length).toBeGreaterThanOrEqual(5)
    })
})