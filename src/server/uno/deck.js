var Deck = {
    // registered color and number variation
    color: ['r', 'g', 'b', 'y', 'wild'],
    number: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', '+4', 'wild', 'skip', 'reverse'],

    // generate deck as many as needed (parameter supplied)
    generate: function (num) {
        // how many deck generated
        num = num || 1;

        // array of deck
        var deck = [];

        // generate deck
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < Deck.color.length; j++) {
                for (var k = 0; k < Deck.number.length; k++) {
                    var color = Deck.color[j],
                        number = Deck.number[k],
                        counter = 1;

                    switch (number) {
                        case 'wild':
                            counter = color == 'wild' ? 4 : 0;
                            break;
                        case '+4':
                            counter = color == 'wild' ? 4 : 0;
                            break;
                        case '0':
                            counter = color != 'wild' ? 1 : 0;
                            break;
                        default:
                            counter = color != 'wild' ? 2 : 0;
                            break;
                    }

                    for (var l = 0; l < counter; l++) {
                        deck.push({
                            color: color,
                            number: number
                        });
                    }
                }
            }
        }

        return deck;
    },

    // do shuffling
    shuffle: function(deck){
        for(var j, x, i = deck.length; i; j = Math.floor(Math.random() * i), x = deck[--i], deck[i] = deck[j], deck[j] = x);
        return deck;
    },

    // pop a card from a deck
    pop: function(deck, card){
        card = card || null;

        if(card){
            var index = -1;
            for(var i=0; i<deck.length; i++){
                if(card.color == deck[i].color && card.number == deck[i].number){
                    index = i;
                    break;
                }
            }

            deck.splice(index, 1);
        }else{
            card = deck[deck.length-1];
            deck.splice(deck.length-1, 1);
        }

        return card;
    },

    // push a card to the last
    push: function(deck, card){
        deck.push(card);
        return deck;
    },

    // wild card action returning data for next turn
    wildcard: function(turn_data, card, action){
        var data = turn_data;

        data.color = card.color;
        data.number = card.number;

        if(card.color == 'wild'){
            data.color = action.color;
        }

        if(card.number == 'skip'){
            data.skip = data.draw > 0 ? 0 : 1;
        }else if(card.number == 'reverse') {
            data.direction = !data.direction;
        }else if(card.number == '+2'){
            data.draw += 2;
        }else if(card.number == '+4'){
            data.draw += 4;
        }

        return data;
    },

    // check is allow to drop card in pile, based on turn data
    isdroppable: function(data, card){
        if(data.color == '' && data.number == '') return true;

        // normal case, no draw in turn data
        if(data.draw == 0){
            return card.color == 'wild' || card.number == 'wild' || data.color == card.color || data.number == card.number;
        }else{
            return card.number == '+4' || (card.color == data.color && ['+2', 'skip', 'reverse'].indexOf(card.number) != -1) || (card.number == data.number && ['+2', 'skip', 'reverse'].indexOf(card.number) != -1);
        }
    }
};

module.exports = Deck;