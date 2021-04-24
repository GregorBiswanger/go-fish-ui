import { Wert } from 'go-fish-core';
import Value from '../Value';

export function mapWertToValue(wert: Wert): Value {
    const index = Object.keys(Wert).indexOf(wert);
    const value = Object.keys(Value)[index];
    return (Value as any)[value];
}