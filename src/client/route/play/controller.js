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
        $scope.game = {};

        $scope.register = function(){
            $socket.emit('register', {name: 'test'}, function(e){
                $log.error(e);
            });
        };

        $scope.join = function(){
            $socket.emit('join', {}, function(e){
                $log.error(e);
            });
        };

        $scope.leave = function(){
            $socket.emit('leave', {}, function(e){
                $log.error(e);
            });
        };

        $scope.start = function(){
            $socket.emit('start', {}, function(e){
                $log.error(e);
            });
        };

        $scope.stop = function(){
            $socket.emit('stop', {}, function(e){
                $log.error(e);
            });
        };

        $scope.draw = function(){
            $socket.emit('draw', {}, function(e){
                $log.error(e);
            });
        };

        $scope.drop = function(){
            $socket.emit('drop', {}, function(e){
                $log.error(e);
            });
        };

        $scope.uno = function(){
            $socket.emit('uno', {}, function(e){
                $log.error(e);
            });
        };

        // listening on any change from server
        $socket.on('game', function(data){
            $scope.game = data;
            $log.debug($scope.game);
        });
    }];
});