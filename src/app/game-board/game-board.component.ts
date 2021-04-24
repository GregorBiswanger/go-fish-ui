import { concatMap, delay, map, tap, delayWhen } from 'rxjs/operators';
import { merge, of, interval, Subject } from 'rxjs';
import { GameService, ChangedPlayer, SamePlayerAgain, PlayerAskedForValue } from './../game.service';
import { Player } from './../../models/Player';
import { Component, OnInit } from '@angular/core';
import Card from 'src/models/Card';
import { Karte } from 'go-fish-core';
import SpielerHatKartenErhalten from 'go-fish-core/dist/domain-events/SpielerHatKartenErhalten';

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
  gameInfo = 'Du bist an der Reihe! Wähle eine Karte...';

  userClickedTopCardSubject = new Subject<unknown>();

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.updateGameState();

    merge(
      this.gameService.playerChanged.pipe(map(event => ({ data: event, type: 'playerChanged' }))),
      this.gameService.playerAskedForValue.pipe(
        map(event => ({ data: event, type: 'playerAskedForValue' }))
      ),
      this.gameService.playerGetCards.pipe(
        map(event => ({ data: event, type: 'playerGetCards' }))
      ),
      this.gameService.playerHaveGoFish.pipe(
        concatMap(event => of(
          { data: { playerId: (event as SpielerHatKartenErhalten).spielerId }, type: 'playerIsGoingToFish' },
          { data: event, type: 'playerHaveGoFish' }))
      ),
      this.gameService.samePlayerAgain.pipe(map(event => ({ data: event, type: 'samePlayerAgain' })))
    ).pipe(
      concatMap(x => of(x).pipe(delayWhen(event => {
        if (event.type === 'playerAskedForValue') {
          return interval((event.data as PlayerAskedForValue).playerId === this.computerPlayer.id ? 3500 : 0);
        }

        if (event.type == 'playerHaveGoFish') {
          return (event.data as SpielerHatKartenErhalten).spielerId === this.computerPlayer.id
            ? interval(0)
            : this.userClickedTopCardSubject;
        }

        return interval(3500);
      })))
    ).subscribe(event => {

      if (event.type === 'playerChanged') {
        const data = event.data as ChangedPlayer;
        this.isPlayerActive = this.player.id === data.playerId;
        if (data.playerId === this.player.id) {
          this.gameInfo = 'Du bist an der Reihe! Wähle eine Karte...';
        } else {
          this.gameInfo = 'Ano ist an der Reihe! Er überlegt...';
        }
      } else if (event.type === 'playerAskedForValue') {
        const data = event.data as PlayerAskedForValue;
        if (data.playerId === this.computerPlayer.id) {
          this.gameInfo = `Ano frägt nach dem Wert ${data.value}` // yay, ENGLISCH (Value, statt Wert)
        } else {
          this.gameInfo = `Du frägst nach dem Wert ${data.value}`;
        }
      } else if (event.type === 'playerGetCards') {
        const data = event.data as SpielerHatKartenErhalten;
        if (data.spielerId === this.computerPlayer.id) {
          this.gameInfo = `Ano hat die Karten erhalten mit dem Wert ${data.erhalteneKarten[0].wert}`
        } else {
          this.gameInfo = `Du hast die Karten erhalten mit dem Wert ${data.erhalteneKarten[0].wert}`
        }

        this.updateGameState();
      } else if (event.type === 'playerIsGoingToFish') {
        const data = event.data as { playerId: string };
        if (data.playerId === this.computerPlayer.id) {
          this.gameInfo = `Ano muss fischen gehen!`
        } else {
          this.gameInfo = `Du musst fischen gehen! Ziehe eine Karte vom Stapel!`;
        }
      } else if (event.type === 'playerHaveGoFish') {
        const data = event.data as SpielerHatKartenErhalten;
        if (data.spielerId === this.computerPlayer.id) {
          this.gameInfo = `Ano ist fischen gegangen!`
        } else {
          this.gameInfo = `Du bist fischen gegangen! Du hast die Karten erhalten mit dem Wert ${data.erhalteneKarten[0].wert}`
        }

        this.updateGameState();
      } else if (event.type === 'samePlayerAgain') {
        const data = event.data as SamePlayerAgain;
        if (data.playerId === this.player.id) {
          this.gameInfo = 'Du bist nochmal an der Reihe! Wähle eine Karte...';
        } else {
          this.gameInfo = 'Ano ist nochmal an der Reihe! Er überlegt...';
        }

        this.updateGameState();
      }
    });

    this.gameService.gameOver.subscribe(gameOver => {
      this.isGameOver = true;

      if (gameOver.winnerPlayerId === this.player.id) {
        this.gameOverTitle = 'Du hast Gewonnen!';
        this.gameOverState = `Du hattest ${gameOver.quartets}! ${this.computerPlayer.name} hatte ${this.computerPlayer.quartets.length / 4}.`;
      } else {
        this.gameOverTitle = 'Du hast Verloren!';
        this.gameOverState = `${this.computerPlayer.name} hatte ${gameOver.quartets}! Du hattest ${this.player.quartets.length / 4}.`;
      }
    });
  }

  clickOnCardInDeck(i: number) {
    if (i != this.cardDeck.length - 1 || !this.isPlayerActive) {
      return;
    }

    this.userClickedTopCardSubject.next();
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
