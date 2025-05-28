export default class Document {
    private value: string;
    private VALID_LENGTH = 11;

    constructor (document: string) {
        if (!this.validate(document)) throw new Error("Invalid document");
        this.value = document;
    }

    private validate (cpf: string) {
        if (!cpf) return false;
        cpf = this.clean(cpf);
        if (cpf.length !== this.VALID_LENGTH) return false;
        if (this.allDigitsEqual(cpf)) return false;
        const dg1 = this.calculateDigit(cpf, 10);
        const dg2 = this.calculateDigit(cpf, 11);
        return this.extractDigit(cpf) == `${dg1}${dg2}`;
    }

    private clean (cpf: string) {
        return cpf.replace(/\D/g, "");
    }

    private allDigitsEqual (cpf: string) {
        const [firstDigit] = cpf;
        return [...cpf].every(digit => digit === firstDigit);
    }

    private calculateDigit (cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const rest = total%11;
        return (rest < 2) ? 0 : 11 - rest;
    }

    private extractDigit (cpf: string) {
        return cpf.substring(cpf.length - 2, cpf.length);
    }

    getValue () {
        return this.value;
    }

}
