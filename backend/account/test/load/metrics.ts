import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

async function main () {
    const connection = new PgPromiseAdapter();
    while (true) {
        const count = await connection.query(`select count(*) from ccca.order`, []);
        console.log(count);
        const result = await connection.query(`SELECT FLOOR(EXTRACT(EPOCH FROM "timestamp"))::BIGINT AS time, COUNT(*) AS count FROM ccca.order GROUP BY time ORDER BY time desc limit 10`, []);
        console.log(result);
        await sleep(1000);
    }
    
}

main();
