import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";

async function main () {
    const connection = new PgPromiseAdapter();
    await connection.query("delete from ccca.depth", []);
    await connection.close();
}

main();
