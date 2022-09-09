import { getBuildsByElement, setApiKey } from "./core/retrieve";
import { APIResponse, GenshinElement } from "./types/global";

export namespace CommunityBuilds {
    export function init(key: string) {
        setApiKey(key)
    }
    export async function pyro(): Promise<APIResponse> {
        return getBuildsByElement("pyro")
    }
    export async function hydro(): Promise<APIResponse> {
        return getBuildsByElement("hydro")
    }
    export async function anemo(): Promise<APIResponse> {
        return getBuildsByElement("anemo")
    }
    export async function electro(): Promise<APIResponse> {
        return getBuildsByElement("electro")
    }
    export async function dendro(): Promise<APIResponse> {
        return getBuildsByElement("dendro")
    }
    export async function cryo(): Promise<APIResponse> {
        return getBuildsByElement("cryo")
    }
    export async function geo(): Promise<APIResponse> {
        return getBuildsByElement("geo")
    }
    export async function all(): Promise<APIResponse[]> {
        const elements: GenshinElement[] = ["pyro", "hydro", "anemo", "electro", "dendro", "cryo", "geo"]
        const response = elements.map((element) => getBuildsByElement(element))
        return Promise.all(response)
    }
}