import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";

async function main () {
    const connection = new PgPromiseAdapter();
    const data = await connection.query("select * from ccca.depth", []);
    console.log(data);
    await connection.close();
}

main();
