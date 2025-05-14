import Password from "../../src/domain/Password";

test("Deve validar a senha", () => {
    const password = "asdQWE123";
    expect(new Password(password)).toBeDefined();
});

test.each([
    "asd",
    "asdqwezxc",
    "ASDQWEZXC",
    "asdqwe123",
    "12345678"
])("Não deve validar a senha", (password: string) => {
    expect(() => new Password(password)).toThrow(new Error("Invalid password"));
});