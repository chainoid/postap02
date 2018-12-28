// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function ($scope, appFactory) {

	// Client's page
	$("#error_query_all").hide();
	$("#all_clients").hide();

	$("#success_add_client").hide();
	
	//$("#error_add_group").hide();
	//$("#success_add_group").hide();

	//$("#error_add_user").hide();
	//$("#success_add_user").hide();

	//$("#success_generated").hide();
	//$("#error_generated").hide();

	
	//$("#error_item_source").hide();

	//$("#error_query").hide();
	//$("#error_sender").hide();
	//$("#error_query_id").hide();
	//$("#error_query_student").hide();
	//$("#error_prepare_delivery").hide();
	//$("#error_pass_exam").hide();
	//$("#error_student_record").hide();
	//$("#item_list").hide();
			

	$("#take_form").hide();

	$scope.queryAllClients = function () {

		appFactory.queryAllClients(function (data) {

			if ($scope.query_all_clients == "Error of query request"){
				console.log()
				$("#error_query_all").show();
				$("#all_clients").hide();
				
			} else{
				$("#all_clients").show();
				$("#error_query_all").hide();

			var array = [];
			for (var i = 0; i < data.length; i++) {
				data[i].Record.Key = data[i].Key;
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return a.name.localeCompare(b.name);
			});
			$scope.all_clients = array;
		  }
		});
	}

    $scope.addClient = function () {

		appFactory.addClient($scope.client, function(data){
			$scope.accepted_client_id = data;
			$("#success_add_client").show();
		});
	}

	$scope.generateSetForGroup = function () {

		appFactory.generateSetForGroup($scope.generator, function (data) {
			$scope.generated_set_for_group = data;

			if ($scope.generated_set_for_group == "error_generated") {
				console.log()
				$("#error_generated").show();
			} else {
				$("#error_generated").hide();
				$("#success_generated").show();
			}

		});
	}

	$scope.getUserRecord = function () {
		
		var id = $scope.id;

		appFactory.getUserRecord(id, function(data){

			$scope.user_record = data;

			if ($scope.user_record == "User record not found"){
				console.log()
				$("#error_user_record").show();
				$("#user_record").hide();
				$("#user_record2").hide();
				
			} else{
				$("#error_user_record").hide();
				$("#user_record").show();
				$("#user_record2").show();
			}
		});
	}


	$scope.beforeDeliveryItem = function (item) {
		        
          if (item.rate != "") {
			$("#takeTheTestId").hide();	 
			$("#take_form").hide(); 
		  } else {
			$("#takeTheTestId").show();	
			$("#take_form").show();
			$("#success_delivery").hide();
		  }
		  $scope.delicase = item;
	}

	$scope.deliveryItem = function () {

		var delicase = $scope.delicase;

		appFactory.deliveryItem(delicase, function (data) {

			if (data == "Could not locate undelivered item") {
				$("#error_item_source").show();
				$("#success_delivery").hide();
			} else {	
				$("#error_item_source").hide();
				$("#success_delivery").show();
			}
			
			$scope.exam_result = data;
		});
	}

});


// Angular Factory
app.factory('appFactory', function ($http) {

	var factory = {};

	factory.queryAllClients = function (callback) {

		$http.get('/get_all_clients/').success(function (output) {
			callback(output)
		});
	}

	factory.addClient = function (data, callback) {

		var client = data.name + "-" + data.address + "-" + data.phone + "-" + data.branchId;

		$http.get('/add_client/' + client).success(function (output) {
			callback(output)
		});
	}

	
	factory.generateSetForGroup = function (generator, callback) {

		var generator = generator.groupName + "-" + generator.itemName + "-" + generator.deliveryMan;

		$http.get('/generate_set_for_group/' + generator).success(function (output) {
			callback(output)
		});
	}

	factory.getUserRecord = function (id, callback) {
		$http.get('/get_user_record/' + id).success(function (output) {
			callback(output)
		});
	}

	factory.deliveryItem = function (input, callback) {

		var params = input.userId + "-" + input.itemName + "-" + input.rate;

		$http.get('/delivery_item/' + params).success(function (output) {
			callback(output)
		});
	}

	return factory;
});
