import { getPriceFromId } from "./price"

describe('price ranges', () => {
    const testCases = [{ tokenId:'5', price:5 }, { tokenId:'101', price: 10 }, { tokenId:'134', price: 10 }, { tokenId:'240', price: 15 }, {tokenId:'661', price:35}, {tokenId:'986', price:70}]
    testCases.forEach(testCase => {
        it('should return correct price', () => {
            const price = getPriceFromId(testCase.tokenId)
            expect(price).toEqual(testCase.price)
        })
    })
    
})