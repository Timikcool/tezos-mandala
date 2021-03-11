import { range } from "lodash";

export const priceRanges = range(1, 20).map(range => range * 5);
export const tokensRange = range(1, 20).map(range => range * 100);
export const getPriceFromId = (id) => {
    const number = parseInt(id);
    const closestEndIndex = tokensRange.findIndex(range => range >= number) || 0;
    const price = priceRanges[closestEndIndex];
    return price
}