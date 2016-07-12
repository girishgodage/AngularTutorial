var TodoApp = angular.module('TodoApp', ['ngRoute','ngResource']);



TodoApp.config(function ($routeProvider) {
    $routeProvider.
        when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
        when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
        when('/edit/:itemId', { controller: EditCtrl, templateUrl: 'details.html' }).
        otherwise({ redirectTo:'/'});
    });


TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/todoitems/:id', { id: '@id' }, { update: { method: 'PUT' } });
});


var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = "Add";
    $scope.save = function () {
        Todo.save($scope.item, function () {
            $location.path('/');
        });
    };

};

var EditCtrl = function ($scope, $routeParams, $location, Todo) {
    $scope.action = "Update";
    $scope.item = Todo.get({ id: $routeParams.itemId });

    $scope.save = function () {
        Todo.update({ id: $scope.item.TodoItemId }, $scope.item, function () {
            $location.path('/');
        });
    };
};

var ListCtrl = function ($scope, $location, Todo) {

    $scope.sort_order = 'Priority';
    $scope.desc = false;

    $scope.sort_by = function (ord) {
        if ($scope.sort_order == ord) { $scope.sort_desc = !$scope.sort_desc; }
        else { $scope.sort_desc = false; }
        $scope.sort_order = ord;
        $scope.reset();
    };

    $scope.do_show = function (asc, col) {
        return (asc != $scope.sort_desc) && ($scope.sort_order == col);
    };

    $scope.search = function () {
        Todo.query({ sort: $scope.sort_order, desc: $scope.sort_desc, q: $scope.query, limit: $scope.limit, offset: $scope.offset },
            function (items) {
                var cnt = items.length;
                $scope.no_more = cnt < 20;
                $scope.items = $scope.items.concat(items);
            }
        );
    };



    $scope.reset = function () {
        $scope.offset = 0;
        $scope.items = [];
        $scope.search();
    };

    $scope.show_more = function () { return !$scope.no_more; };

    $scope.limit = 20;

    $scope.reset();

    $scope.delete = function () {
        var itemId = this.item.TodoItemId;
        Todo.delete({ id: itemId }, function () {
            $("#item_" + itemId).fadeOut();
        });
    };
};