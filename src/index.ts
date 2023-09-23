import { getBuildsByElementTask, setApiKey, setConfig } from './core/retrieve'
import { findArtifacts, findWeapons } from './core/retrieveByScraping'
import {
    APIResponse,
    Artifact,
    Config,
    ElementResponse,
    GenshinCharacter,
    GenshinElement,
    GenshinWeapons,
    Weapon
} from './types'

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

    /**
     * @deprecated use getCharacterByElement
     */
    export const pyro = () => pipe(
        'pyro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
        )
    )()

    export const hydro = () => pipe(
        'hydro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
        )
    )()

    export const anemo = () => pipe(
        'anemo',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
        )
    )()

    export const electro = () => pipe(
        'electro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
        )
    )

    export const dendro = () => pipe(
        'dendro',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
        )
    )()

    export const cryo = () => pipe(
        'cryo',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
        )
    )()

    export const geo = () => pipe(
        'geo',
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
        )
    )()


    export const getCharactersByElement = async (element: GenshinElement) => pipe(
        element,
        getBuildsByElementTask,
        TE.match<string, ElementResponse, APIResponse<GenshinCharacter>>(
            (l) => ({ data: [], error: l }),
            (r) => ({ data: r.data })
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