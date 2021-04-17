import Card from "./Card";

export interface Player {
    id: string;
    name: string;
    isComputer: boolean;
    cards: Card[];
    quartets: Card[];
}