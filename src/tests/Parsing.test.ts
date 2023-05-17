import * as cheerio from 'cheerio';
import { googleDocsArtifacts, googleDocsArtifactsPath, httpHeaders } from '../core/constants';
import myHttp from '../core/http';
import { findWeapons } from '../core/retrieveByScraping';
import { CommunityBuilds } from '../index';

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
    it("retrieve all 5 star claymores", async () => {
        const data = await CommunityBuilds.getWeaponsByType('claymores')
        expect(data.length).toBeGreaterThanOrEqual(5)
    })
    it("retrieve all 5 star bows", async () => {
        const data = await CommunityBuilds.getWeaponsByType('bows')
        expect(data.length).toBeGreaterThanOrEqual(6)
    })
    it("retrieve all 5 star polearms", async () => {
        const data = await CommunityBuilds.getWeaponsByType('polearms')
        expect(data.length).toBeGreaterThanOrEqual(6)
    })
    it("retrieve all 5 star catalysts", async () => {
        const data = await CommunityBuilds.getWeaponsByType('catalysts')
        expect(data.length).toBeGreaterThanOrEqual(5)
    })
    it("retrieve all 5 star swords", async () => {
        const data = await CommunityBuilds.getWeaponsByType('swords')
        expect(data.length).toBeGreaterThanOrEqual(7)
    })
})

