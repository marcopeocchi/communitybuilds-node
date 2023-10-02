import { getBuildsByElementTask, setApiKey, setConfig } from './core/retrieve.js'
import { findArtifacts, findWeapons } from './core/retrieveByScraping.js'
import {
    APIResponse,
    Artifact,
    Config,
    ElementResponse,
    GenshinCharacter,
    GenshinElement,
    GenshinWeapons,
    Weapon
} from './types/index.js'

import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'

export namespace CommunityBuilds {
    /**
     * Inits the package
     * @param key Google spreadsheet API key
     * @param config Caching config
     */
    export function init(
        key: string,
        config: Config = { eludeCaching: false, cacheTTLms: 60 * 1000 }
    ) {
        setApiKey(key)
        setConfig(config)
    }

    export const pyro = () => pipe(
        'pyro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element: 'pyro' })
        )
    )()

    export const hydro = () => pipe(
        'hydro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element: 'hydro' })
        )
    )()

    export const anemo = () => pipe(
        'anemo',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element: 'anemo' })
        )
    )()

    export const electro = () => pipe(
        'electro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element: 'electro' })
        )
    )

    export const dendro = () => pipe(
        'dendro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element: 'dendro' })
        )
    )()

    export const cryo = () => pipe(
        'cryo',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element: 'cryo' })
        )
    )()

    export const geo = () => pipe(
        'geo',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element: 'geo' })
        )
    )()


    export const getCharactersByElement = async (element: GenshinElement) => pipe(
        element,
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data, element })
        )
    )()

    /**
     * Retrieves all weapons of a given type
     * @deprecated Will be removed next release
     * @param type Weapon type
     */
    export const getWeaponsByType = async (type: GenshinWeapons) => pipe(
        await findWeapons(type),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<Weapon>())
    )

    /**
     * Retrieves all artifacts sets
     * @deprecated Will be removed next release
     * @param type Weapon type
     */
    export const getArtifacts = async () => pipe(
        await findArtifacts(),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<Artifact>())
    )
}