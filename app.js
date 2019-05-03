(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
        .directive('foundItems', FoundItems);

    function FoundItems() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onEmpty: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'menuCtrl',
            bindToController: true
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var menuCtrl = this;
        menuCtrl.shortName = '';

        menuCtrl.matchedMenuItems = function(searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

            promise.then(function(items) {
                if (items && items.length > 0) {
                    menuCtrl.message = '';
                    menuCtrl.found = items;
                } else {
                    menuCtrl.message = 'Nothing found!';
                    menuCtrl.found = [];
                }
            });
        };

        menuCtrl.removeMenuItem = function(itemIndex) {
            menuCtrl.found.splice(itemIndex, 1);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function(response) {
                var foundItems = [];

                for (var i = 0; i < response.data['menu_items'].length; i++) {
                    if (searchTerm.length > 0 && response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(response.data['menu_items'][i]);
                    }
                }

                return foundItems;
            });
        };
    }
})();