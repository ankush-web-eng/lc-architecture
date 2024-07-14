interface Game {
    id: string;
    whitePlayer: string;
    blackPlayer: string;
    moves: string[];
}

export class GameManager {
    games: Game[] = []
    private static instance : GameManager
    private constructor() {
        this.games = []
    }

    static getInstance() {
        if(!GameManager.instance) {
            GameManager.instance = new GameManager()
        }
        return GameManager.instance
    }

    addMove(gameId: string, move : string){
        console.log(`Adding move ${move} to game ${gameId}`)
        const game = this.games.find(game => game.id === gameId)
        game?.moves.push(move)
    }

    addGame(gameId : string) {
        const game = {
            id: gameId,
            whitePlayer: "white",
            blackPlayer: "black",
            moves: []
        }

        this.games.push(game)
    }
}
