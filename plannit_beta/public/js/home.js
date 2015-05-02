var home = angular.module("Home", ['ngMaterial']);

home.controller("TopHeader", function($scope) {
	
});

home.controller("PlannerListCtrl", function($scope,$http,$route) {
	$scope.planners = {};
	$http.get('/users/homedata', {"mode": "list"}).success(function(data){
		if (data.plannerList !== undefined) {
			$scope.planners = data.plannerList;
		}
	});

	$scope.removePlanner = function(planner) {
		$http.post('/users/removeHomeModule', {"planner": planner})
		.success(function(data) {
			if (data.code === 200) {
				$route.reload();
			}
		});
	};
});