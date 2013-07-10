var yaSearch = angular.module('yaSearch', []);

yaSearch.controller('Video', function ($scope, $http) {

    'use strict';

    var player = document.getElementById('player');

    $scope.search = function (request) {

        $scope.request = request;

        // YouTube
        $http
            .jsonp('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=48&q=' + request + '&type=video&key=AIzaSyDZ04ZOZBWfENOzs9cTS9XolD-0tEhxzZo' + '&callback=JSON_CALLBACK')
            .success(function (data) {
                $scope.youtube = data.items;
            });

        // Vimeo
        $http({
            method: "GET",
            url: "vimeoapi/ajax.php",
            params: {
                q: request
            }
        })
            .success(function (data) {
                $scope.vimeo = data;
            })
            .error(function (xhr, type) {
                console.log('Error ' + type);
            });

        // VK
        $http
            .jsonp('https://api.vk.com/method/video.search?q=' + request + '&count=48&access_token=a14f088380a358402bceb8d107a3abbe6bc6c8685173bfb1af2f8899158fde320493c7a0541640cbfdfa5&callback=JSON_CALLBACK')
            .success(function (data) {
                $scope.vk = data.response;
            });

        $scope.currentPage = 0;

    };

    $scope.search('Yandex');

    $scope.insertYouTube = function (url) {
        player.innerHTML =
            '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + url + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';
    };

    $scope.insertVimeo = function (id) {
        var vimeoId = id.substr(17, id.length);
        player.innerHTML = '<iframe src="http://player.vimeo.com/video/' + vimeoId + '?autoplay=1"width="560" height="315" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen autoplay></iframe>';
    };

    $scope.insertVK = function (id) {
        player.innerHTML = '<iframe src="' + id + '&autoplay=1?iphone" width="560" height="315" frameborder="0"></iframe>';
    };

});

yaSearch.controller('nextPage', function ($scope) {

    'use strict';

    $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.pages = [];
    $scope.numPages = function () {
        return Math.ceil($scope.youtube.length / $scope.pageSize);
    };

});

yaSearch.filter('startFrom', function () {

    'use strict';

    return function (input, start) {
        start = +start;
        return input.slice(start);
    };

});