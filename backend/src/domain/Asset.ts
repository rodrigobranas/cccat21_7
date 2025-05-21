export default class Asset {

    constructor (readonly accountId: string, readonly assetId: string, public quantity: number) {
    }
}
