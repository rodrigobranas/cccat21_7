import Document from "../../src/domain/Document";

test.each([
    "97456321558",
    "71428793860",
    "87748248800",
    "877.482.488-00",
    "877.482.48800",
    "877.48248800"
])("Deve validar o cpf %s", async (cpf: string) => {
    expect(new Document(cpf)).toBeDefined();
});


test.each([
    null,
    undefined,
    "111",
    "11111111111",
    "abc"
])("Não deve validar o cpf %s", async (cpf: any) => {
    expect(() => new Document(cpf)).toThrow(new Error("Invalid document"));
});
