angular.module('Module', ['ngMaterial'])
.controller('AppCtrl', function($scope, $http) {

	var vm = this;
/*
	$scope.clearValue = function() {
    $scope.myModel = undefined;
  };
  $scope.save = function() {
    alert('Form was valid!');
  };
*/
	$scope.noteData = [];

  	$scope.saveNote = function(){
  		console.log("saving as we speak!");
		//add a note to the list
		$scope.noteData.push({
			title: $scope.title,
			body: $scope.body
		});

		//after our computer has been added, clean the form
		//$scope.noteData = JSON.stringify($scope.noteData);
		$http.post('/module/savenote', $scope.noteData)
		/*$http({
			method: 'POST',
			url: '/module/savenote',
			data: $scope.noteData,
			headers: {'Content-Type': 'application/json'}
		})*/

		.success(function(data){
			alert("success" + data);
			return;

		})
		.error(function(){

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
      templateUrl: 'public/views/editNote.html',
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
      });
  		};
  	
	})

.controller('EditNoteCtrl', function($scope, $http) {
	$scope.noteBody = "";
	$http.get('/getNote',JSON).success(function(data) {
		$scope.noteBody = "hello";
	});
});

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


