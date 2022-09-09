import { CommunityBuilds } from ".."
require('dotenv').config()

test("API inits", () => {
    const testKey = process.env.API_KEY
    CommunityBuilds.init(testKey!)
})

describe("Retrieve specific element", () => {
    it("should retrieve pyros", async () => {
        const testKey = process.env.API_KEY!
        CommunityBuilds.init(testKey)
        const { data } = await CommunityBuilds.pyro()
        expect(data.length).toBeGreaterThan(0)
        expect(data.filter(character => character.name.toLowerCase() === "xiangling")).toHaveLength(1)
    })
    it("should retrieve hydros", async () => {
        const { data } = await CommunityBuilds.hydro()
        expect(data.length).toBeGreaterThan(0)
        expect(data.filter(character => character.name.toLowerCase() === "yelan")).toHaveLength(1)
    })
    it("should retrieve anemos", async () => {
        const { data } = await CommunityBuilds.anemo()
        expect(data.length).toBeGreaterThan(0)
        expect(data.filter(character => character.name.toLowerCase() === "venti")).toHaveLength(1)
    })
    it("should retrieve electros", async () => {
        const { data } = await CommunityBuilds.electro()
        expect(data.length).toBeGreaterThan(0)
        expect(data.filter(character => character.name.toLowerCase() === "beidou")).toHaveLength(1)
    })
    it("should retrieve dendros", async () => {
        const { data } = await CommunityBuilds.dendro()
        expect(data.length).toBeGreaterThan(0)
        expect(data.filter(character => character.name.toLowerCase() === "tighnari")).toHaveLength(1)
    })
    it("should retrieve cryos", async () => {
        const { data } = await CommunityBuilds.cryo()
        expect(data.length).toBeGreaterThan(0)
        expect(data.filter(character => character.name.toLowerCase() === "shenhe")).toHaveLength(1)
    })
    it("should retrieve geos", async () => {
        const { data } = await CommunityBuilds.geo()
        expect(data.length).toBeGreaterThan(0)
        expect(data.filter(character => character.name.toLowerCase() === "zhongli")).toHaveLength(1)
    })
})

describe("Batch", () => {
    it("should retrieve all elements", async () => {
        const testKey = process.env.API_KEY!
        CommunityBuilds.init(testKey)
        const data = await CommunityBuilds.all()
        expect(data).toHaveLength(7)
    })
})

describe("Caching strategy", () => {
    it("should retrieve element", async () => {
        const testKey = process.env.API_KEY!
        CommunityBuilds.init(testKey)

        const cryo1 = await CommunityBuilds.cryo()
        expect(cryo1.data.length).toBeGreaterThan(0)

        const cryo2 = await CommunityBuilds.cryo()
        expect(cryo2.data.length).toBeGreaterThan(0)
    })
})