import { Karte, Spieler, SpielerTyp } from 'go-fish-core';
import { createSchema, morphism } from 'morphism';
import { Player } from '../Player';
import cardSchema from './cardSchema';

export default createSchema<Player, Spieler>({
    id: 'id',
    name: 'name',
    cards: spieler => convertToCards(spieler.karten),
    quartets: spieler => convertToCards(spieler.saetze),
    isComputer: (spieler) => {
        return spieler.spielerTyp === SpielerTyp.Computer;
    }
});

function convertToCards(karten: ReadonlyArray<Karte>) {
    return morphism(cardSchema, [...karten]);
}