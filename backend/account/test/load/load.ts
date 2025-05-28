import axios from "axios";

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

async function main () {
    const marketId = `BTC/USD${Math.random()}`;
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    while (true) {
        const inputPlaceOrder1 = {
            marketId,
            accountId: outputSignup.accountId,
            side: (Math.random() > 0.5) ? "sell" : "buy",
            quantity: Math.round(Math.random() * 10) + 1,
            price: Math.round(94000 + ((Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1)))
        }
        await axios.post("http://localhost:3000/place_order", inputPlaceOrder1);
        await sleep(100);
    }
    
}

main();
