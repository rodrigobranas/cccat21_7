import Asset from "./Asset";
import Document from "./Document";
import Email from "./Email";
import Name from "./Name";
import Password from "./Password";

// Aggregate Account onde o AR = Account
export default class Account {
    private _name: Name;
    private _email: Email;
    private _document: Document;
    private _password: Password;
    // Asset é uma outra entity
    private assets: Asset[];

    constructor (
        readonly accountId: string,
        name: string,
        email: string,
        document: string,
        password: string,
        assets: Asset[]
    ) {
        this._name = new Name(name);
        this._email = new Email(email);
        this._document = new Document(document);
        this._password = new Password(password);
        this.assets = assets;
    }

    static create (
        name: string,
        email: string,
        document: string,
        password: string
    ) {
        const accountId = crypto.randomUUID();
        const assets: Asset[] = [];
        return new Account(accountId, name, email, document, password, assets);
    }

    get name() {
        return this._name.getValue();
    }

    get email() {
        return this._email.getValue();
    }

    get document() {
        return this._document.getValue();
    }

    get password () {
        return this._password.getValue();
    }

    deposit (assetId: string, quantity: number) {
        if (quantity < 0) throw new Error("Invalid quantity");
        const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
        if (asset) {
            asset.quantity += quantity;
        } else {
            this.assets.push(new Asset(this.accountId, assetId, quantity));
        }
    }

    withdraw (assetId: string, quantity: number) {
        if (quantity < 0) throw new Error("Invalid quantity");
        const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
        if (!asset || asset.quantity < quantity) throw new Error("Insufficient funds");
        asset.quantity -= quantity;
    }

    getBalance (assetId: string) {
        const asset = this.assets.find((asset: Asset) => asset.assetId === assetId);
        if (!asset) return 0;
        return asset.quantity;
    }

    getAssets () {
        return this.assets;
    }

}
