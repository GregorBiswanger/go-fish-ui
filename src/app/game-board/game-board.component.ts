import { GameService } from './../game.service';
import { Player } from './../../models/Player';
import { Component, OnInit } from '@angular/core';
import Card from 'src/models/Card';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  player!: Player;
  computerPlayer!: Player;
  cardDeck: Card[] = [];
  isPlayerActive = true;
  selectedCard!: Card;
  isGameOver = false;
  gameOverTitle = '';
  gameOverState = '';

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.updateGameState();

    this.gameService.playerChanged.subscribe(playerChanged => {
      this.isPlayerActive = this.player.id === playerChanged.playerId;
    });

    this.gameService.playerGetCards.subscribe(() => this.updateGameState());
    this.gameService.playerHaveGoFish.subscribe(() => this.updateGameState());
    this.gameService.samePlayerAgain.subscribe(() => {
      console.log('Gleicher spieler nochmal');
    });

    this.gameService.gameOver.subscribe(gameOver => {
      this.isGameOver = true;

      if(gameOver.winnerPlayerId === this.player.id) {
        this.gameOverTitle = 'Du hast Gewonnen!';
        this.gameOverState = `Du hattest ${gameOver.quartets}! ${this.computerPlayer.name} hatte ${this.computerPlayer.quartets.length / 4}.`;
      } else {
        this.gameOverTitle = 'Du hast Verloren!';
        this.gameOverState = `${this.computerPlayer.name} hatte ${gameOver.quartets}! Du hattest ${this.player.quartets.length / 4}.`;
      }
    });
  }

  updateGameState() {
    this.gameService.players.forEach(player => {
      if (player.isComputer) {
        this.computerPlayer = player;
      } else {
        this.player = player;
      }
    });

    this.cardDeck = this.gameService.cards;
  }

  selectCard(card: Card) {
    if (this.isPlayerActive) {
      this.selectedCard = card;
    }
  }

  askForValue() {
    this.gameService.askPlayerForValue(this.computerPlayer.id, this.selectedCard);
  }

  selectedCardStyle(card: Card) {
    return {
      'player-card--selected': card === this.selectedCard
    }
  }
}
