import { createSchema } from "morphism";
import { Farbe, Karte, Wert } from 'go-fish-core';
import Card from "../Card";
import Color from "../Color";
import Value from "../Value";

export default createSchema<Card, Karte>({
    color: (karte) => {
        const index = Object.keys(Farbe).indexOf(karte.farbe);
        const value = Object.keys(Color)[index];

        return (Color as any)[value];
    },
    value: (karte) => {
        const index = Object.keys(Wert).indexOf(karte.wert);
        const value = Object.keys(Value)[index];

        return (Value as any)[value];
    }
});