import { APIResponse, GenshinElement } from "../types/global";

import https from 'https';
import LRUCache from "lru-cache";

let key: string;
let params: string;
const domain = 'sheets.googleapis.com'
const path = '/v4/spreadsheets/1gNxZ2xab1J6o1TuNVWMeLOZ7TPOqrsf3SshP5DLvKzI/values/';

const cache = new LRUCache<GenshinElement, APIResponse>({
    max: 50,
    ttl: 1000 * 60,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
})

export const setApiKey = (apiKey: string) => {
    key = apiKey;
    params = `alt=json&key=${key}`
}

export const getBuildsByElement = (element: GenshinElement): Promise<APIResponse> => {
    if (!key) throw Error("Must set Google API key")

    if (cache.get(element)) {
        console.log("cache hit!")
        return new Promise<APIResponse>((resolve) => resolve(cache.get(element)!))
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
    const partial = new Promise((resolve, reject) => {
        const options = {
            hostname: domain,
            path: `${path}${mapping[element]}?${params}`,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
            },
            method: 'GET',
            port: 443,
        };
        let chunks: any[] = [];
        https.get(options, (res) => {
            // push the http packets chunks into the buffer
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            // the connection has ended so build the body from the buffer
            // parse it as a JSON and get the tag_name
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                try {
                    const data = JSON.parse(buffer.toString());
                    if (!data.error) {
                        resolve(data.values);
                    }
                    reject(data.error);
                }
                catch (err) {
                    reject(err);
                }
            })
            res.on('error', (e) => {
                console.log(e)
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
    // chain the first promise with the parsing one.
    return new Promise<APIResponse>((resolve, reject) => {
        partial.then((res: any) => {
            // the response will be an array of characters' builds
            const response = [];
            /* represent the offset between a build to another. This because the json
               response is highly inconsistent */
            const offsets = [];
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
                const notes = res.slice(-1).filter((n: any) => n).filter((n: any) => n != '');
                // buffer for the intermediate output
                const buildsBuff = [];
                // generate the build by role
                for (let i = 0; i < builds.length; i++) {
                    const role = builds[i][2];
                    const equipment = builds[i][3];
                    const artifacts = builds[i][4];
                    const notes = builds[i][5];
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
                    notes: "",
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
