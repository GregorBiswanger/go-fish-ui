import { Player } from './../models/Player';
import { Injectable } from '@angular/core';
import { Spiel, Spieler, SpielerTyp, SpielkartenFactory, Karte, Wert } from 'go-fish-core';
import { Subject } from 'rxjs';
import playerSchema from 'src/models/MorphismSchemas/playerSchema';
import { mapWertToValue } from 'src/models/Mapper/mapWertToValue';
import morphism from 'morphism';
import Card from 'src/models/Card';
import cardSchema from 'src/models/MorphismSchemas/cardSchema';
import { tap, map } from 'rxjs/operators';
import karteSchema from 'src/models/MorphismSchemas/karteSchema';
import SpielEnde from 'go-fish-core/dist/domain-events/SpielEnde';
import SpielerFragteNachWert from 'go-fish-core/dist/domain-events/SpielerFragteNachWert';
import Value from 'src/models/Value';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private _spiel = new Spiel();
  players: Player[] = [];
  cards: Card[] = [];

  get started() {
    return this.startedSubject.asObservable();
  }
  private startedSubject = new Subject();

  get playerChanged() {
    return this.playerChangedSubject.asObservable();
  }
  private playerChangedSubject = new Subject<ChangedPlayer>();

  get samePlayerAgain() {
    return this._spiel.gleicherSpielerNochmal.pipe(
      map<unknown, SamePlayerAgain>(() => ({ playerId: this._spiel.aktuellerSpielerId }))
    );
  }

  get playerAskedForValue() {
    return this._spiel.spielerFragteNachWert.pipe(
      map<SpielerFragteNachWert, PlayerAskedForValue>(ereignis => ({
        playerId: ereignis.spielerId,
        value: mapWertToValue(ereignis.wert)
      }))
    );
  }

  get playerGetCards() {
    return this._spiel.spielerHatKartenErhalten.pipe(tap(() => {
      console.log('Spieler hat karten erhalten - ' + this._spiel.aktuellerSpielerId);
      this.updateGameState();
    }));
  }

  get playerHaveGoFish() {
    return this._spiel.spielerIstFischenGegangen.pipe(tap(() => {
      console.log('Spieler geht fischen - ' + this._spiel.aktuellerSpielerId);
      this.updateGameState();
    }));
  }

  get gameOver() {
    return this._spiel.spielEnde.pipe(
      map<SpielEnde, GameOver>(spielEnde => {
        return {
          quartets: spielEnde.anzahlSaetze,
          winnerPlayerId: spielEnde.gewinnerSpielerId
        }
      }));
  }

  constructor() {
    this._spiel.gestartet.subscribe(() => {
      this.updateGameState();

      this.startedSubject.next();
    });

    this._spiel.spielerGewechselt.subscribe(spielerGewechselt => {
      console.log('Spieler gewechselt - ' + spielerGewechselt.neuerSpielerId);
      this.playerChangedSubject.next({ playerId: spielerGewechselt.neuerSpielerId });
    });
  }

  private updateGameState() {
    this.players = morphism(playerSchema, [...this._spiel.spieler]);
    this.cards = morphism(cardSchema, [...this._spiel.deck]);
  }

  startGame(playername: string) {
    const spielkartenFactory = new SpielkartenFactory();
    const karten = spielkartenFactory.erzeugen();

    const spieler = new Spieler(playername, SpielerTyp.Mensch);
    const computerSpieler = new Spieler('Ano', SpielerTyp.Computer);

    this._spiel.starten(karten, [spieler, computerSpieler]);
  }

  askPlayerForValue(playerId: string, card: Card) {
    const karte: Karte = morphism(karteSchema, card);
    this._spiel.spielerFragtNachKarten(playerId, karte.wert);
  }
}

export interface ChangedPlayer {
  playerId: string;
}

export interface SamePlayerAgain {
  playerId: string;
}

export interface PlayerAskedForValue {
  playerId: string;
  value: Value;
}

export interface GameOver {
  quartets: number;
  winnerPlayerId: string;
}