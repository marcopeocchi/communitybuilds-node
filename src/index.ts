import { getBuildsByElement, setApiKey, setConfig } from './core/retrieve'
import { findArtifacts, findWeapons } from './core/retrieveByScraping'
import {
    Artifact,
    Config,
    GenshinCharacter,
    GenshinElement,
    GenshinWeapons,
    Weapon
} from './types'

import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

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
    export const pyro = async () => pipe(
        await getBuildsByElement('pyro'),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )

    /**
     * @deprecated use getCharacterByElement
     */
    export const hydro = async () => pipe(
        await getBuildsByElement('hydro'),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )
    /**
     * @deprecated use getCharacterByElement
     */
    export const anemo = async () => pipe(
        await getBuildsByElement('anemo'),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )

    /**
     * @deprecated use getCharacterByElement
     */
    export const electro = async () => pipe(
        await getBuildsByElement('electro'),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )

    /**
     * @deprecated use getCharacterByElement
     */
    export const dendro = async () => pipe(
        await getBuildsByElement('dendro'),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )

    /**
     * @deprecated use getCharacterByElement
     */
    export const cryo = async () => pipe(
        await getBuildsByElement('cryo'),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )

    /**
     * @deprecated use getCharacterByElement
     */
    export const geo = async () => pipe(
        await getBuildsByElement('geo'),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )


    export const getCharactersByElement = async (element: GenshinElement) => pipe(
        await getBuildsByElement(element),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<GenshinCharacter>())
    )

    /**
     * Retrieves all weapons of a given type
     * @param type Weapon type
     */
    export const getWeaponsByType = async (type: GenshinWeapons) => pipe(
        await findWeapons(type),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<Weapon>())
    )

    /**
     * Retrieves all artifacts sets
     * @param type Weapon type
     */
    export const getArtifacts = async () => pipe(
        await findArtifacts(),
        O.map((e) => e.data),
        O.getOrElse(() => new Array<Artifact>())
    )
}