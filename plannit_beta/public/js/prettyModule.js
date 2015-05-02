angular.module('Module', ['ngMaterial'])
/*
.factory('ModuleData', function($scope, $http){
	var module = [[]];
	$http.get('/route', {JSON}).success(function(data){
		module = data;
	});

	Module.note = module[0][0].text;
	Module.budget = module[3][0].text;
	Module.usefulLinks = [];
	for(var i = 0; i < module[2].length; i++) {
		Module.usefulLinks[i] = module[2][i].link;
	}
	Module.upcomingEvents = [];
	for(var j = 0; j < module[1].length; j++) {
		Module.upcomingEvents[j].month = module[1].[j].month;
		Module.upcomingEvents[j].day = module[1].[j].day;
		Module.upcomingEvents[j].year = module[1].[j].year;
		Module.upcomingEvents[j].time = module[1].[j].time;
		Module.upcomingEvents[j].info = module[1].[j].info;
	}	
})
*/
.controller('AppCtrl', function($scope, $http) {

	$scope.noteData = [];

  	$scope.saveNote = function(){
  		console.log("saving as we speak!");
		//add a note to the list
		$scope.noteData.push({
			body: $scope.body
		});

		$http.post('/module/savenote', $scope.noteData)
		.success(function(data){
			alert("success" + data);
			$scope.hiddenNewNote = true;
			return;

		})
		.error(function(){
			$scope.hiddenNewNote = true;
			$scope.noteCardHide = false;
		});


	};

	$scope.processForm = function(){
		
	};

})

//controller to edit notes


.controller('EditNoteCtrl', function($scope, $http, $mdDialog) {

	 $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/editNote.html',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
      });
  		};
  	
	})

.controller('NoteCardCtrl', function($scope, $http, $mdDialog) {
	//$scope.noteCardHide = true;
	$http.get('/users/currentHomeModuleData', {"a":"1"}).success(function(data){
		$scope.noteBody = data.note;
	});
})

.controller('EditCurrentNoteCtrl', function($scope, $http) {
	$scope.noteCardHide = false;
	$http.get('/users/currentHomeModuleData', {"a":"1"}).success(function(data){
		console.log(data.note);
		$scope.editNoteBody = data.note;
	});
})
/*
.controller('LinkCntrl', function($scope, $http){

	$scope.listOfLinks = [];

  	$scope.saveLink = function(){
  		console.log("saving as we speak!");
		//add a note to the list
		$scope.listOfLinks.push({
			body: $scope.body
		});

		//after our computer has been added, clean the form
		//$scope.noteData = JSON.stringify($scope.noteData);
		$http.post('/module/saveLink', $scope.listOfLinks)
		/*$http({
			method: 'POST',
			url: '/module/savenote',
			data: $scope.noteData,
			headers: {'Content-Type': 'application/json'}
		})*/
/*
		.success(function(data){
			alert("success" + data);
			return;

		})
		.error(function(){

		});


	};

}) */;

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}


