import { createClient } from "redis";

const client = createClient();

async function main() {
    await client.connect()
    console.log("Worker conmected to redis!")

    while (1) {
        const res = await client.brPop("submissions", 0)
        console.log(res)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log("Processed user submission")
    }
}

main().catch(err => console.error('Error:', err))