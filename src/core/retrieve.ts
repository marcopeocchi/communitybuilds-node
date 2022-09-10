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

export const setApiKey = (apiKey: string) => {
    key = apiKey;
    params = `alt=json&key=${key}`
}

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
                        length++;
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
                let nBuilds = (offsets[i + 1] - offsets[i]) - 3
                /* we reached the end of the main array, so the last offset is
                   is calculated from the end of the main array */
                if (Number.isNaN(nBuilds)) {
                    nBuilds = (res.length - offsets[i]) - 3;
                }
                // generate the sub-array / silce
                const builds = res.slice(offsets[i] + 2, offsets[i] + 2 + nBuilds);
                // const notes = res.slice(-1).filter((n: any) => n).filter((n: any) => n != '');
                // buffer for the intermediate output
                const buildsBuff: GenshinCharacterBuild[] = [];
                // generate the build by role
                for (let i = 0; i < builds.length; i++) {
                    const role: string = builds[i][2];
                    const equipment: string = builds[i][3];
                    const artifacts: string = builds[i][4];
                    // const notes = builds[i][5];
                    // prettify the output
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
                                .filter((e: any) => e)
                                .map((a: any) => a.trim()),
                            artifacts: artifacts
                                .replace(/(\d{1,2}\.)/gm, "")
                                .replace(/\([4-5]✩\)/gm, "")
                                .split('\n')
                                .filter((a: any) => a)
                                .map((a: any) => a.trim()),
                            optimal: role.includes("✩")
                        });
                    }
                }
                // each object is composed by name and the array of the relative builds
                response.push({
                    name: String(res[offsets[i]][1]).toLowerCase().trim(),
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
