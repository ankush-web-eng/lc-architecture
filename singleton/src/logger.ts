import { GameManager } from "./store";

const gameManager = GameManager.getInstance()

export function startLogger() {
    setInterval(() => {
        console.log(gameManager.games);
    }, 4000)
}