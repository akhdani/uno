jest.dontMock('../../src/server/uno/deck');

var Deck = require('../../src/server/uno/deck');

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

    it('should generate right turn data', function(){
        var card = {};
        var turn_data = {};

        // normal card
        for(var i=0; i<Deck.color.length; i++) if(Deck.color[i] != 'wild'){
            for(var j=0; j<10; j++){
                card.number = j;
                card.color = Deck.color[i];
                turn_data = {};
                turn_data = Deck.wildcard({}, card, {});
                expect(turn_data.number).toBe(card.number);
                expect(turn_data.color).toBe(card.color);
            }
        }

        // card (*, *), choosing color
        card = {number: 'wild', color: 'wild'};
        for(var i=0; i<Deck.color.length; i++) if(Deck.color[i] != 'wild'){
            turn_data = {};
            turn_data = Deck.wildcard({}, card, {color: Deck.color[i]});
            expect(turn_data.number).toBe(card.number);
            expect(turn_data.color).toBe(Deck.color[i]);
        }

        // card skip
        card = {number: 'skip'};
        for(var i=0; i<Deck.color.length; i++) if(Deck.color[i] != 'wild'){
            card.color = Deck.color[i];

            // without draw in turn_data
            turn_data = {};
            turn_data = Deck.wildcard({}, card, {});
            expect(turn_data.number).toBe(card.number);
            expect(turn_data.color).toBe(Deck.color[i]);
            expect(turn_data.skip).toBe(1);

            // with draw in turn_data
            turn_data = {};
            turn_data = Deck.wildcard({draw: 2}, card, {});
            expect(turn_data.number).toBe(card.number);
            expect(turn_data.color).toBe(Deck.color[i]);
            expect(turn_data.skip).toBe(0);
        }

        // card reverse
        card = {number: 'reverse'};
        for(var i=0; i<Deck.color.length; i++) if(Deck.color[i] != 'wild'){
            card.color = Deck.color[i];
            turn_data = {};
            turn_data = Deck.wildcard({direction: true}, card, {});
            expect(turn_data.number).toBe(card.number);
            expect(turn_data.color).toBe(Deck.color[i]);
            expect(turn_data.direction).toBe(false);
        }

        // +2 card
        card = {number: '+2'};
        for(var i=0; i<Deck.color.length; i++) if(Deck.color[i] != 'wild'){
            card.color = Deck.color[i];
            turn_data = {};
            turn_data = Deck.wildcard({draw: i}, card, {});
            expect(turn_data.number).toBe(card.number);
            expect(turn_data.color).toBe(Deck.color[i]);
            expect(turn_data.draw).toBe(i + 2);
        }

        // +4 card
        card = {number: '+4', color: 'wild'};
        for(var i=0; i<Deck.color.length; i++) if(Deck.color[i] != 'wild'){
            turn_data = {};
            turn_data = Deck.wildcard({draw: i}, card, {color: Deck.color[i]});
            expect(turn_data.number).toBe(card.number);
            expect(turn_data.color).toBe(Deck.color[i]);
            expect(turn_data.draw).toBe(i + 4);
        }
    });

    it('should check isdroppable right', function(){
        var card = {},
            turn_data = {};

        for(var i=0; i<Deck.color.length; i++){
            for (var j = 0; j < Deck.number.length; j++) {
                card = {number: Deck.number[j], color: Deck.color[i]};
                card.number = card.color == 'wild' ? 'wild' : card.number;
                card.color = card.number == 'wild' || card.number == '+4' ? 'wild' : card.color;


                // empty turn data, any card is allow to drop
                turn_data = {color: '', number: ''};
                expect(Deck.isdroppable(turn_data, card)).toBe(true);

                // card are allowed as long as the color is same
                for(var k=0; k<Deck.color.length; k++) if(Deck.color[k] != 'wild'){
                    // no draw in turn data
                    turn_data = {color: Deck.color[k], number: '', draw: 0};
                    expect(Deck.isdroppable(turn_data, card)).toBe(card.color == turn_data.color || card.color == 'wild');
                }

                // card are allowed as long as the number is same
                for(var k=0; k<Deck.number.length; k++) if(Deck.number[k] != 'wild'){
                    turn_data = {color: '', number: Deck.number[k], draw: 0};
                    expect(Deck.isdroppable(turn_data, card)).toBe(card.number == turn_data.number || card.color == 'wild' || card.number == 'wild' || card.number == '+4');
                }
            }
        }
    });
});