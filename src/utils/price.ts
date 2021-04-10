import { find, range } from "lodash";

export const priceRanges = range(1, 20).map(range => range * 5);
export const tokensRange = range(1, 20).map(range => range * 100);
export const newStagesTestCases = [{stage:7, amount:70, price:35}, {stage:8, amount: 65,	price:40}]
export let newStages = [{stage:7, amount: 70, price:35}];
const newRanges = range(8, 21);
let startPrice = 35;
newRanges.reduce((prev, stage) => {
    const nextStage = {stage, amount:prev.amount - 5, price: prev.price + 5};
    newStages.push(nextStage);
    return nextStage;
}, {stage:7, amount: 70, price:35})

export const getPriceFromStage = stage => find(newStages, (obj) => obj.stage === stage)?.price
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
    
    const closestEndIndex = tokensRange.findIndex(range => range >= number) || 0;
    const price = priceRanges[closestEndIndex];
    return price
    
}