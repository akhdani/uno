define([
    'asset/lib/socket.io-client/socket.io'
], function(io){
    alt.module('btford.socket-io');
    alt.factory('$socket', function (socketFactory) {
        return socketFactory({
            ioSocket: io.connect(alt.serverUrl)
        });
    });

    return ['$scope', '$routeParams', '$log', '$socket', function($scope, $routeParams, $log, $socket){
        $scope.game = {
            player: {},
            players: [],
            turn_data: {},
            is_registered: false,
            is_joined: false,
            is_started: false
        };

        $scope.hoverIn = function(){
        };

        $scope.hoverOut = function(){
        };

        $scope.register = function(){
            var name = prompt('Input your name');
            $socket.emit('register', {name: name}, function(err, data){
                if(!err){
                    $scope.game.is_registered = true;
                    $scope.game.player = data;
                    $scope.$apply();
                }
            });
        };

        $scope.join = function(){
            $socket.emit('join', {}, function(err, data){
                $scope.game.is_joined = true;
                $scope.$apply();
                if(err) $log.error(err);
            });
        };

        $scope.leave = function(){
            $socket.emit('leave', {}, function(err, data){
                $scope.game.is_joined = false;
                $scope.$apply();
                if(err) $log.error(err);
            });
        };

        $scope.start = function(){
            $socket.emit('start', {}, function(err, data){
                if(err) $log.error(err);
            });
        };

        $scope.stop = function(){
            $socket.emit('stop', {}, function(err, data){
                if(err) $log.error(err);
            });
        };

        $scope.draw = function(){
            $socket.emit('draw', {}, function(err, data){
                if(err) $log.error(err);
            });
        };

        $scope.drop = function(card){

            var data = {
                card: card,
                action: {}
            };
            delete data.card.$$hashKey;

            if(card.color == 'wild'){
                data.action.color = prompt('Choose color (r, g, b, y)');
            }

            $socket.emit('drop', data, function(err, data){
                if(err) $log.error(err);
            });
        };

        $scope.uno = function(){
            $socket.emit('uno', {}, function(err, data){
                if(err) $log.error(err);
            });
        };

        // listening on any change from server
        $socket.on('game', function(data){
            $scope.game = alt.extend($scope.game, data);
        });
    }];
});