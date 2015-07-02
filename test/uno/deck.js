jest.dontMock('../../src/uno/deck');

var Deck = require('../../src/uno/deck');

describe('Deck', function(){
    it('should generate right number of card decks', function(){
        expect(Deck.generate().length).toBe(108);

        for(var i=1; i<=5; i++){
            expect(Deck.generate(i).length).toBe(i * 108);
        }
    });

    it('should shuffle deck randomly on each shuffle', function(){
        var cards = Deck.generate(),
            shuffle = cards.slice(),
            tmp;

        for(var i=0; i<10; i++){
            tmp = shuffle.slice();
            Deck.shuffle(shuffle);
            expect(shuffle).not.toBe(tmp);
        }
    });

    it('should pop a right card from a deck', function(){
        // pop top card
        var cards = Deck.shuffle(Deck.generate()),
            newcards = cards.slice(0, cards.length-1),
            topcard = cards[cards.length-1],
            card = Deck.pop(cards);

        expect(card).toBe(topcard);
        expect(cards).toEqual(newcards);

        // pop specific card
        cards = Deck.shuffle(Deck.generate());
        topcard = cards[4];
        newcards = cards.slice();
        newcards.splice(4, 1);
        card = Deck.pop(cards, topcard);

        expect(card).toBe(topcard);
        expect(cards).toEqual(newcards);
    });

    it('should push a card to the top of a deck', function(){
        var card = {color: 'r', number: '0'},
            cards = Deck.shuffle(Deck.generate());

        Deck.push(cards, card);
        expect(Deck.pop(cards)).toBe(card);
    });
});