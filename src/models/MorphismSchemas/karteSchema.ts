import { createSchema } from "morphism";
import { Farbe, Karte, Wert } from 'go-fish-core';
import Card from "../Card";
import Color from "../Color";
import Value from "../Value";

export default createSchema<Karte, Card>({
    farbe: (card) => {
        const index = Object.keys(Color).indexOf(card.color);
        const value = Object.keys(Farbe)[index];

        return (Farbe as any)[value];
    },
    wert: (card) => {
        const index = Object.keys(Value).indexOf(card.value);
        const value = Object.keys(Wert)[index];

        return (Wert as any)[value];
    }
});