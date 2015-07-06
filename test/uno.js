jest.dontMock('../src/server/uno');
jest.dontMock('../src/server/uno/player');

var Uno = require('../src/server/uno'),
    Player = require('../src/server/uno/player');

describe('Uno', function(){
    var game, player1, player2;

    beforeEach(function(){
        player1 = new Player('player_1');
        player2 = new Player('player_2');

        game = new Uno({creator: player1});
    });

    it('should start a game', function(){
        expect(game.is_started).toBe(false);

        game.start();
        expect(game.is_started).toBe(true);
    });

    it('should allow player(s) to join if game is not started', function(){
        game.join(player2);

        game.start();
        expect(function(){ game.join(player2); }).toThrow();
    });
});