import Document from "./Document";
import Email from "./Email";
import Name from "./Name";
import Password from "./Password";

export default class Account {
    private _name: Name;
    private _email: Email;
    private _document: Document;
    private _password: Password;

    constructor (
        readonly accountId: string,
        name: string,
        email: string,
        document: string,
        password: string
    ) {
        this._name = new Name(name);
        this._email = new Email(email);
        this._document = new Document(document);
        this._password = new Password(password);
    }

    static create (
        name: string,
        email: string,
        document: string,
        password: string
    ) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, document, password);
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

}
