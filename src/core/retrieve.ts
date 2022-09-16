import { APIResponse, GenshinCharacter, GenshinCharacterBuild, GenshinElement } from '../types/global';
import { httpHeaders, googleSheetsApidomain, spreadsheetPath } from './constants'

import myHttp from './http';
import LRUCache from 'lru-cache';

let key: string;
let params: string;

const cache = new LRUCache<GenshinElement, APIResponse<GenshinCharacter>>({
    max: 10,
    ttl: 1000 * 60,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
})

/**
 * Make api key available at module level
 * @param apiKey Google console api key
 */
export const setApiKey = (apiKey: string) => {
    key = apiKey;
    params = `alt=json&key=${key}`
}

/**
 * Retrieve all characters build by element by parsing Google Spreadsheets JSON values.
 * @param element Genshin Impact element
 * @returns Standard api response
 */
export const getBuildsByElement = (element: GenshinElement): Promise<APIResponse<GenshinCharacter>> => {
    if (!key) throw Error("Must set Google API key")

    if (cache.peek(element)) {
        return new Promise<APIResponse<GenshinCharacter>>(resolve => resolve(cache.get(element)!))
    }

    const mapping: Record<GenshinElement, string> = {
        pyro: 'Pyro%20',
        hydro: 'Hydro%20',
        anemo: 'Anemo%20',
        electro: 'Electro%20',
        dendro: 'Dendro',
        cryo: 'Cryo%20',
        geo: 'Geo%20',
    };
    // retrieve the spreadsheet as a JSON provided by Google
    const rawJSON = myHttp.json(googleSheetsApidomain, {
        path: `${spreadsheetPath}${mapping[element]}?${params}`,
        headers: httpHeaders
    })
    // chain the first promise with the parsing one.
    return new Promise<APIResponse<GenshinCharacter>>((resolve, reject) => {
        rawJSON.then((res: any) => {
            // the response will be an array of characters' builds
            const response: GenshinCharacter[] = [];
            /* represent the offset between a build to another. This because the json
               response is highly inconsistent */
            const offsets: number[] = [];
            // the effective lenght of each section delimited between two offsets
            let length = 0;
            // Skip the first 4 line as they're table headers
            for (let i = 4; i < res.length; i++) {
                /* get the lenght of the sub stats array as it will vary from
                   character to character */
                if (res[i].length === 7) {
                    if (res[i][6] === 'SUBSTATS') {
                        offsets.push(i);
                    }
                }
                // calculate the offset between sections
                if (res[i].length === 9) {
                    if (res[i][2] === 'ROLE') {
                        offsets.push(i);
                    }
                }
            }
            /* build the response object; start iterate the sub arrays
               generated between sections */
            for (let i = 0; i < offsets.length; i++) {
                // calculate how many builds there are in a section
                let nBuilds = (offsets[i + 1] - offsets[i]) + 1
                /* we reached the end of the main array, so the last offset is
                   is calculated from the end of the main array */
                if (Number.isNaN(nBuilds)) {
                    nBuilds = (res.length - offsets[i]);
                }
                // generate the sub-array / silce
                const builds = res.slice(offsets[i] + 2, offsets[i] + nBuilds + 3);
                //const [notes] = res.slice(offsets[i] + 4, offsets[i] + nBuilds + 3);
                // buffer for the intermediate output
                const buildsBuff: GenshinCharacterBuild[] = [];
                // charachter name
                const name = String(res[offsets[i]][1]).toLowerCase().trim();
                // generate the build by role
                for (let i = 0; i < builds.length; i++) {
                    const role: string = builds[i][2];
                    const equipment: string = builds[i][3];
                    const artifacts: string = builds[i][4];
                    const artifactsMainStats: string = builds[i][5];
                    const artifactsSubStats: string = builds[i][6];
                    const talentPriority: string = builds[i][7];

                    let _artifactsMainStats = (artifactsMainStats ?? "")
                        .split("\n")
                        .map(x => x.split(' - '));

                    const _artifactsMainsStatsObj = {
                        sands: _artifactsMainStats ? _artifactsMainStats.at(0)?.at(1) : '',
                        goblet: _artifactsMainStats ? _artifactsMainStats.at(1)?.at(1) : '',
                        circlet: _artifactsMainStats ? _artifactsMainStats.at(2)?.at(1) : '',
                    }
                    // format the output
                    if (role && equipment && artifacts) {
                        buildsBuff.push({
                            role: role
                                .replace("✩", "")
                                .replace("\n", "")
                                .toLowerCase()
                                .trim(),
                            equipment: equipment
                                .replace(/(\d{1,2}\.)/gm, "")
                                .replace(/\([4-5]✩\)/gm, "")
                                .split("\n")
                                .filter(Boolean)
                                .map((a: any) => a.trim()),
                            artifacts: artifacts
                                .replace(/(\d{1,2}\.)/gm, "")
                                .replace(/\([4-5]✩\)/gm, "")
                                .split('\n')
                                .filter(Boolean)
                                .map((a: any) => a.trim()),
                            artifactsSubStats: artifactsSubStats
                                .replace(/(\d{1,2}\.)/gm, "")
                                .replace(/\([4-5]✩\)/gm, "")
                                .split('\n')
                                .filter(Boolean)
                                .map((a: any) => a.trim()),
                            artifactsMainStats: _artifactsMainsStatsObj,
                            talentPriority: talentPriority
                                .replace(/(\d{1,2}\.)/gm, "")
                                .replace(/\([4-5]✩\)/gm, "")
                                .split('\n')
                                .filter(Boolean)
                                .map((a: any) => a.trim()),
                            optimal: role.includes("✩"),
                            //notes: notes,
                        });
                    }
                }
                // each object is composed by name and the array of the relative builds
                response.push({
                    name: name,
                    builds: buildsBuff,
                });
            }

            // if there is output try to resolve the promise, alternatively reject it
            if (response.length > 0) {
                cache.set(element, { data: response })
                resolve({ data: response });
            } else {
                cache.clear()
                reject(response);
            }
        });
    });
}
