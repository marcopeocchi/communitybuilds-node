import { getBuildsByElement, setApiKey } from "./core/retrieve";
import { findArtifacts, findWeapons } from "./core/retrieveScraping";
import { APIResponse, Artifact, GenshinCharacter, GenshinElement, Weapon } from "./types/global";

export namespace CommunityBuilds {
    export function init(key: string) {
        setApiKey(key)
    }
    export async function pyro(): Promise<APIResponse<GenshinCharacter>> {
        return getBuildsByElement("pyro")
    }
    export async function hydro(): Promise<APIResponse<GenshinCharacter>> {
        return getBuildsByElement("hydro")
    }
    export async function anemo(): Promise<APIResponse<GenshinCharacter>> {
        return getBuildsByElement("anemo")
    }
    export async function electro(): Promise<APIResponse<GenshinCharacter>> {
        return getBuildsByElement("electro")
    }
    export async function dendro(): Promise<APIResponse<GenshinCharacter>> {
        return getBuildsByElement("dendro")
    }
    export async function cryo(): Promise<APIResponse<GenshinCharacter>> {
        return getBuildsByElement("cryo")
    }
    export async function geo(): Promise<APIResponse<GenshinCharacter>> {
        return getBuildsByElement("geo")
    }
    export async function all(): Promise<APIResponse<GenshinCharacter>[]> {
        const elements: GenshinElement[] = ["pyro", "hydro", "anemo", "electro", "dendro", "cryo", "geo"]
        const response = elements.map((element) => getBuildsByElement(element))
        return Promise.all(response)
    }
    export async function claymores(): Promise<APIResponse<Weapon>> {
        return findWeapons("claymores");
    }
    export async function swords(): Promise<APIResponse<Weapon>> {
        return findWeapons("swords");
    }
    export async function catalysts(): Promise<APIResponse<Weapon>> {
        return findWeapons("catalysts");
    }
    export async function polearms(): Promise<APIResponse<Weapon>> {
        return findWeapons("polearms");
    }
    export async function bows(): Promise<APIResponse<Weapon>> {
        return findWeapons("bows");
    }
    export async function artifacts(): Promise<APIResponse<Artifact>> {
        return findArtifacts();
    }
}