export default class Password {
    private value: string;

    constructor (password: string) {
        if (!this.validate(password)) throw new Error("Invalid password");
        this.value = password;
    }

    private validate (password: string) {
        if (password.length < 8) return false;
        if (!password.match(/\d+/)) return false;
        if (!password.match(/[a-z]+/)) return false;
        if (!password.match(/[A-Z]+/)) return false;
        return true;
    }

    getValue () {
        return this.value;
    }

}
