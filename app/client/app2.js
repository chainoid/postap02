// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function ($scope, appFactory) {

	// Client's page
	$("#error_query_all").hide();
	$("#all_clients").hide();

	$("#success_add_client").hide();

	$("#client_sent_parsels").hide();
	$("#error_no_sent_data_found").hide();

	$("#client_rec_parsels").hide();
	$("#error_no_rec_data_found").hide();

	$("#error_client_history").hide();
	$("#client_history_header").hide();
	$("#client_history").hide();

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
	
    $scope.getClientSentParsels = function (client) {

		var name = client.name;

		appFactory.clientSentParsels(name, function (data) {
	
			if (data  == "Error: No data found"){
				$("#error_no_sent_data_found").show();
				$("#client_sent_parsels").hide();
				$("#client_rec_parsels").hide();
				$("#error_no_rec_data_found").hide();
				
			} else{
				$("#client_sent_parsels").show();
				$("#client_rec_parsels").hide();
				$("#error_no_sent_data_found").hide();

			var array = [];
			for (var i = 0; i < data.length; i++) {
				data[i].Record.Key = data[i].Key;
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return a.senderTS.localeCompare(b.senderTS);
			});
			$scope.client_sent_parsels = array;
		  }
		});
	}

	 $scope.getClientReceivedParsels = function (client) {

		var name = client.name;

	 	appFactory.clientReceivedParsels(name, function (data) {

			if (data  == "Error: No data found"){
				$("#error_no_rec_data_found").show();
				$("#error_no_sent_data_found").hide();
				$("#client_sent_parsels").hide();
				$("#client_rec_parsels").hide();
				
			} else{
				$("#error_no_rec_data_found").hide();
				$("#error_no_sent_data_found").hide();
				$("#client_sent_parsels").hide();
				$("#client_rec_parsels").show();
			
			  var array = [];
			  for (var i = 0; i < data.length; i++) {
				data[i].Record.Key = data[i].Key;
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return a.senderTS.localeCompare(b.senderTS);
			});
			$scope.client_rec_parsels = array;
			} 
		});
	}


	$scope.getClientHistory = function (client) {

		var clientKey = client.Key;

	 	appFactory.clientHistory(clientKey, function (data) {

			if (data  == "Error: No data found"){
				$("#error_no_sent_data_found").hide();
				$("#client_sent_parsels").hide();
				$("#client_rec_parsels").hide();
				$("#error_client_history").show();
				$("#client_history_header").hide();
				$("#client_history").hide();
				
				
			} else{
				$("#error_no_rec_data_found").hide();
				$("#error_no_sent_data_found").hide();
				$("#client_sent_parsels").hide();
				$("#client_rec_parsels").hide();
				$("#client_rec_parsels").hide();
				$("#error_client_history").hide();
				$("#client_history_header").show();
				$("#client_history").show();
			
			  var array = [];
			  for (var i = 0; i < data.length; i++) {

				// History fields added to record 
				data[i].Record.TxId = data[i].TxId;
				data[i].Record.TxTS = data[i].TxTS;
				data[i].Record.IsDelete = data[i].IsDelete;

				data[i].Record.Key = data[i].Key;
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return a.TxTS.localeCompare(b.TxTS);
			});
			$scope.client_history = array;
			$scope.selected_client = client;
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

	factory.clientSentParsels = function (name, callback) {
		
		$http.get('/get_sent_parsels/' + name).success(function (output) {
			callback(output)
		});
	}

	factory.clientReceivedParsels = function (name, callback) {

	 	$http.get('/get_received_parsels/' + name).success(function (output) {
	 		callback(output)
	 	});
	}

	factory.clientHistory = function (clientKey, callback) {

		$http.get('/client_history/' + clientKey).success(function (output) {
			callback(output)
		});
    }

	factory.getUserRecord = function (id, callback) {
		$http.get('/get_user_record/' + id).success(function (output) {
			callback(output)
		});
	}

	return factory;
});
