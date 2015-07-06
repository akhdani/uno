var Deck = require('./deck'),
    id = 0;

module.exports = function(name){
    var self = this;

    self.id = id++;
    self.name = name;
    self.game = null;
    self.cards = [];
    self.is_uno = false;

    // draw a card(s) from deck
    self.draw = function(num){
        if(self.game == null) throw new Error('Player ' + self.name + ' is not in game');
        if(self.game.is_started && self.game.player_turn !== self) throw new Error('Player ' + self.name + ' is not in turn');

        num = num || self.game.turn_data.draw || 1;
        for(var i=0; i<num; i++){
            self.game.draw(self);
        }
        self.game.turn_data.draw = 0;

        // do next turn
        if(self.game.is_started) self.game.turn();
    };

    // drop a card to pile
    self.drop = function(card, action){
        if(self.game == null) throw new Error('Player ' + self.name + ' is not in game');
        if(self.game.player_turn !== self) throw new Error('Player ' + self.name + ' is not in turn');

        var index = -1;
        for(var i=0; i<self.cards.length; i++){
            if(card.color == self.cards[i].color && card.number == self.cards[i].number){
                index = i;
                break;
            }
        }
        if(index === -1) throw new Error('Player ' + self.name + ' do not have card');

        self.game.drop(self, card, action);

        // do next turn
        if(self.game.is_started) self.game.turn();
    };

    // yell uno
    self.uno = function(){
        if(self.game == null) throw new Error('Player ' + self.name + ' is not in game');

        self.game.uno(self);
    };

    // start game
    self.start = function(){
        if(self.game == null) throw new Error('Player ' + self.name + ' is not in game');
        if(self.game.creator != self) throw new Error('Player is not the game creator');

        self.game.start(self);
    };

    // stop game
    self.stop = function(){
        if(self.game == null) throw new Error('Player ' + self.name + ' is not in game');
        if(self.game.creator != self) throw new Error('Player is not the game creator');
        if(!self.game.is_started) throw new Error('Game is not started');

        self.game.stop(self);
    };

    // join game
    self.join = function(game){
        if(self.game != null) throw new Error('Player ' + self.name + ' is already in game');

        game.join(self, game.config.password);
    };

    // leave game
    self.leave = function(){
        if(self.game == null) throw new Error('Player ' + self.name + ' is not in game');

        self.game.leave(self);
    };
};