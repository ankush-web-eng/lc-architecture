import { GameManager } from "./store";
import { startLogger } from "./logger";

const gameManager = GameManager.getInstance()

startLogger();

setInterval(() => {
    gameManager.addGame("game1")
}, 5000)
