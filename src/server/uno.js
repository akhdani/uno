var Deck = require('./uno/deck'),
    Player = require('./uno/player');

// array random helper
Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
};

var Uno = function(config){
    config = config || {};
    var self = this;

    // set game configuration
    self.config = {
        name: config.name || '',
        password: config.password || null,
        num_of_decks: config.num_of_decks || 1,
        initial_player_cards: config.initial_player_cards || 7,
        creator: config.creator,
        first_player: null
    };

    // set game creator
    if(self.config.creator) self.config.creator.game = self;

    // all actions happened in the game
    self.history = [];
    self.record = function(player, action, data){
        self.history.push({
            player: player,
            action: action,
            data: data
        });
    };

    // cards on deck
    self.decks = [];

    // cards already discarded on piles
    self.piles = [];

    // set creator as join
    self.players = self.config.creator ? [self.config.creator] : [];

    // player join into the game
    self.join = function(player, password){
        password = password || null;

        if(self.config.password && self.config.password != password) throw new Error('Password not same');
        if(self.is_started) throw new Error('Game already started');
        if(!(player instanceof Player)) throw new Error('Player not allowed');
        
        // set additional info
        player.game = self;

        // set game creator
        if(self.config.creator == null) self.config.creator = player;

        self.players.push(player);
    };

    // called by player who draw a card
    self.draw = function(player){
        // pop a card from deck
        var card = Deck.pop(self.decks);
        Deck.push(player.cards, card);

        // check if decks is empty, reshuffle
        if(self.decks.length == 0){
            self.decks = self.piles.slice(0, self.piles.length-2);
            self.piles.splice(0, self.piles.length-2);
            Deck.shuffle(self.decks);
        }

        // record action to game
        self.record(player, 'draw', card);
    };

    // called by player who drop a card
    self.drop = function(player, card, action){
        // check if is droppable;
        if(!Deck.isdroppable(self.turn_data, card)) throw new Error('Card is not allowed to drop');

        if(player) Deck.pop(player.cards, card);
        Deck.push(self.piles, card);
        self.turn_data = Deck.wildcard(self.turn_data, card, action);

        // record action to game
        self.record(player, 'drop', {
            card: card,
            action: action
        });
    };

    // called by player who yell uno
    self.uno = function(player){
        // yell uno for player self
        if(player.cards.length == 1) player.is_uno = true;

        // check other players, not yelled uno when only have 1 card left
        var is_other_uno = false;
        for(var i=0; i<self.players.length; i++) if(self.players[i] != player){
            var other_player = self.players[i];
            if(other_player.cards.length == 1 && !other_player.is_uno){
                other_player.draw(1);
                is_other_uno = true;
            }
        }

        if(!is_other_uno) player.draw(1);

        // record action
        self.record(player, 'uno');
    };

    // player in turn
    self.player_turn = null;

    // when next player turn, must fulfilled the turn data criteria
    self.turn_data = {
        // last card color
        color: '',

        // last card number
        number: '',

        // direction, true = clockwise, false = counter clockwise
        direction: true,

        // is skipped
        skip: 0,

        // is draw
        draw: 0
    };

    // call on every turn based action finish
    self.turn = function(){
        if(!self.is_started) throw new Error('Game has not started yet');

        var found = false;
        while(!found){
            var index = self.players.indexOf(self.player_turn),
                next_index = self.turn_data.direction ? index + 1 : index - 1;

            if(next_index > self.players.length-1){
                next_index = 0;
            }else if(next_index < 0){
                next_index = self.players.length-1;
            }

            self.player_turn = self.players[next_index];
            found = self.player_turn.cards.length > 0;
        }

        if(self.turn_data.skip > 0){
            self.turn_data.skip--;
            self.turn();
        }
    };

    // flag is game started
    self.is_started = false;

    // start the game
    self.start = function(player){
        if(self.is_started) throw new Error('Game already started');

        // generate cards in deck
        self.decks = Deck.shuffle(Deck.generate(self.config.num_of_decks));

        // draw card(s) to each player
        for(var i=0; i<self.config.initial_player_cards; i++){
            for(var j=0; j<self.players.length; j++){
                self.players[j].draw(1);
            }
        }

        // draw card and drop to pile for init card
        var card = Deck.pop(self.decks);
        self.drop(null, card, {color: ['r', 'g', 'b', 'y'].random()});

        // set turn data
        self.turn_data.color = card.color;
        self.turn_data.number = card.number;

        // set player turn
        self.player_turn = self.config.first_player ? self.config.first_player : self.players[0];

        // mark game as started
        self.is_started = true;
    };

    // called when player leave game
    self.leave = function(player){
        var index = self.players.indexOf(player);

        // return all player card(s) to decks
        while(player.cards.length > 0){
            var card = Deck.pop(player.cards);
            Deck.push(self.decks, card);
        }

        // delete player from list
        self.players.splice(index, 1);

        // shuffle decks
        Deck.shuffle(self.decks);

        if(self.creator == player) self.stop(player);
    };

    // called when player stop the game
    self.stop = function(player){
        self.is_started = false;
        self.players = [];
        self.decks = [];
        self.piles = [];
    };

    // send all data needed by player in client
    self.data = function(player){
        var data = {},
            players = [];

        for(var i=0; i<self.players.length; i++){
            var pl = {
                id: self.players[i].id,
                name: self.players[i].name,
                cards_length: self.players[i].cards.length,
                is_uno: self.players[i].is_uno,
                turn: self.player_turn ? self.player_turn == self.players[i] : false
            };

            if(player.id == self.players[i].id) pl.cards = self.players[i].cards;
            players.push(pl);
        }

        data.name = self.name;
        data.is_started = self.is_started;
        data.creator = self.config.creator ? self.config.creator.name : '';
        data.players = players;
        data.player_turn = self.player_turn ? self.player_turn.name : '';
        data.turn_data = self.turn_data;
        data.decks_length = self.decks.length;
        data.piles_length = self.piles.length;

        return data;
    };
};

Uno.prototype.Deck = Deck;
Uno.prototype.Player = Player;

module.exports = Uno;