import { range } from "lodash";

export const priceRanges = range(1, 20).map(range => range * 5);
export const tokensRange = range(1, 20).map(range => range * 100);
export const getPriceFromId = (id) => {
    const number = parseInt(id);
    if (number >= 1120) return 100;
    if (number >= 1110) return 95;
    if (number >= 1095) return 90;
    if (number >= 1075) return 85;
    if (number >= 1050) return 80;
    if (number >= 1020) return 75;
    if (number >= 985) return 70;
    if (number >= 945) return 65;
    if (number >= 900) return 60;
    if (number >= 850) return 55;
    if (number >= 795) return 50;
    if (number >= 735) return 45;
    if (number >= 670) return 40;
    if (number >= 600) return 35;
    return 30;
    
}