// SPDX-License-Identifier: Apache-2.0

'use strict';

var app = angular.module('application', []);

// Angular Controller
app.controller('appController', function ($scope, appFactory) {

	// Parsel page
	$("#all_parsels").hide();

	$("#error_query_all").hide();

	$("#parsel_history_header").hide();
	$("#error_parsel_history").hide();
	$("#parsel_history").hide();




	$("#all_users").hide();

	$("#error_add_group").hide();
	$("#success_add_group").hide();

	$("#error_add_user").hide();
	$("#success_add_user").hide();

	$("#success_generated").hide();
	$("#error_generated").hide();

	

	$("#error_query").hide();
	$("#error_sender").hide();
	$("#error_query_id").hide();
	$("#error_query_student").hide();
	$("#error_prepare_delivery").hide();
	$("#error_pass_exam").hide();
	$("#error_student_record").hide();
	$("#item_list").hide();
		

	$scope.queryAllParsels = function(){

		appFactory.queryAllParsels(function(data){

			$scope.query_all_parsels = data;

			if ($scope.query_all_parsels == "Error of query request"){
				console.log()
				$("#error_query_all").show();
				$("#all_parsels").hide();
				
			} else{
				$("#all_parsels").show();
				$("#error_query_all").hide();
			
			var array = [];
			for (var i = 0; i < data.length; i++){
				//parseInt(data[i].Key);
				data[i].Record.Key = data[i].Key;
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return a.senderTS.localeCompare(b.senderTS);
			});
			$scope.all_parsels = array;
		  }
		});

		$("#history_parsel").hide();
		$("#query_parsel").hide();
		$("#sender_parsels").hide();

		$("#all_parsels").show();
	}

	$scope.getParselHistory = function(parsel){
		
		var parselId = parsel.Key;

		appFactory.parselHistory(parselId, function(data){
			
			if (data  == "No history for parsel"){
				console.log()
				$("#error_parsel_history").show();
				$("#parsel_history").hide();
			} else{
				$("#error_parsel_history").hide();
				$("#parsel_history").show();
			
			var array = [];
			for (var i = 0; i < data.length; i++){
				
				data[i].Record.TxId = data[i].TxId;
				data[i].Record.TxTS = data[i].TxTS;
				data[i].Record.IsDelete = data[i].IsDelete;
			
				array.push(data[i].Record);
			}
			array.sort(function(a, b) {
			    return a.senderTS.localeCompare(b.senderTS);
			});
			$scope.parsel_history = array;
			$scope.selected_parsel = parsel;
	      }
		});

		$("#parsel_history_header").show();
		$("#parsel_history").show();
		$("#history_parsel_id").show();
	}
    

	$scope.queryAllUsers = function () {

		appFactory.queryAllUsers(function (data) {
			var array = [];
			for (var i = 0; i < data.length; i++) {
				data[i].Record.Key = data[i].Key;
				array.push(data[i].Record);
			}
			array.sort(function (a, b) {
				return a.groupName.localeCompare(b.groupName);
			});
			$scope.all_users = array;
			$("#all_users").show();
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

	factory.queryAllParsels = function (callback) {

		$http.get('/get_all_parsels/').success(function (output) {
			callback(output)
		});
	}

	factory.parselHistory = function(parselId, callback){
    	$http.get('/parsel_history/'+parselId).success(function(output){
			callback(output)
		});
	}

	return factory;
});
