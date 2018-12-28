// SPDX-License-Identifier: Apache-2.0

/*
  Sample Chaincode based on Demonstrated Scenario

 This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go
*/

package main

/* Imports
* 4 utility libraries for handling bytes, reading and writing JSON,
formatting, and string manipulation
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts
*/
import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define Parsel structure, with several properties.
Structure tags are used by encoding/json library
*/
type Client struct {
	Name           string `json:"name"`
	BranchId       string `json:"branchId"`
	Address        string `json:"address"`
	Phone          string `json:"phone"`
	Rate           int    `json:"rate"`
//	Receiver       string `json:"receiver"`
//	ReceiverTS     string `json:"receiverTS"`
//	ReceiverBranch string `json:"receiverBranch"`
}

/*
 *  The random Id generator 
*/
func randomId() string {

	// Call Seed, using current nanoseconds.
  rand.Seed(int64(time.Now().Nanosecond()))
  // Random int will be different each program execution.
  value := rand.Int63()

 return  fmt.Sprintf("%X", value) 
}

/*
  * The Init method *
  called when the Smart Contract "client-chaincode" is instantiated by the network
  * Best practice is to have any Ledger initialization in separate function
  -- see initLedger()
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
  * The Invoke method *
  called when an application requests to run the Smart Contract "posta-chaincode"
  The app also specifies the specific smart contract function to call with args
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "initClientLedger" {
		return s.initClientLedger(APIstub)
	} else if function == "queryAllClients" {
		return s.queryAllClients(APIstub)
	}  else if function == "queryClient" {
		return s.queryClient(APIstub, args)
	} else if function == "addClient" {
		return s.addClient(APIstub, args)
	} else if function == "updateClient" {
		return s.updateClient(APIstub, args)
	} else if function == "removeClient" {
		return s.removeClient(APIstub, args)
	} else if function == "historyClient" {
		return s.historyClient(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
  * The initLedger method *
   Will add test data (4 clients)to our network
*/
func (s *SmartContract) initClientLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	clients := []Client{
		Client{Name: "Alex", BranchId: "001", Address: "Address 1, City, ZIP", Phone: "67-50", Rate: -1},
		Client{Name: "Ben" , BranchId: "002", Address: "Address 1, City, ZIP", Phone: "89-99", Rate: 2},
		Client{Name: "John", BranchId: "003", Address: "Address 1, City, ZIP", Phone: "44-45", Rate: 3},
		Client{Name: "Nick", BranchId: "004", Address: "Address 1, City, ZIP", Phone: "01-22", Rate: 4},
	}

	i := 0
	for i < len(clients) {
		fmt.Println("i is ", i)
		clientAsBytes, _ := json.Marshal(clients[i])

		APIstub.PutState(randomId(), clientAsBytes)
		fmt.Println("Added", clients[i])
		i = i + 1
	}

	return shim.Success(nil)
}


/*
  * The queryAllClients method *
 allows for assessing all the records added to the ledger(all parsels in the delivery system)
 This method does not take any arguments. Returns JSON string containing results.
*/
func (s *SmartContract) queryAllClients(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "9999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllClients:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}


/*
  * The queryClient method *
  Used to view the records of one particular parsel
  It takes one argument -- the key for the parsel in question
*/
func (s *SmartContract) queryClient(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	parselAsBytes, err := APIstub.GetState(args[0])
	if err != nil {
		return shim.Error("Could not locate client")
	}

	fmt.Printf("- queryClient:\n%s\n", parselAsBytes)

	return shim.Success(parselAsBytes)
}

/*
  * The addClient method  
	This method takes in ).
*/

func (s *SmartContract) addClient(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 4 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 4")
	// }

	// var client = Parsel{Sender: args[0], SenderBranch: args[1], SenderTS: time.Now().Format(time.RFC3339), Receiver: args[2], ReceiverBranch: args[3], ReceiverTS: ""}

	// clientAsBytes, _ := json.Marshal(client)
	// err := APIstub.PutState(randomId(), clientAsBytes)

	// if err != nil {
	// 	return shim.Error(fmt.Sprintf("Failed to record new client: %s", args[0]))
	// }

	// fmt.Printf("- addClient:\n%s\n", clientlAsBytes)

	return shim.Success(nil)
}



/*
  * The updateClient method *
 allows for assessing all the records from selected sender

 Returns JSON string containing results.
*/
func (s *SmartContract) updateClient(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// startKey := "0"
	// endKey := "9999"

	// resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	// defer resultsIterator.Close()

	// // buffer is a JSON array containing QueryResults
	// var buffer bytes.Buffer

	// buffer.WriteString("[")

	// bArrayMemberAlreadyWritten := false

	// for resultsIterator.HasNext() {
	// 	queryResponse, err := resultsIterator.Next()
	// 	if err != nil {
	// 		return shim.Error(err.Error())
	// 	}

	// 	// Create an object
	// 	parsel := Parsel{}
	// 	// Unmarshal record to parsel
	// 	json.Unmarshal(queryResponse.Value, &parsel)

	// 	// Add only filtered ny sender records
	// 	if parsel.Sender == args[0] {

	// 		// Add comma before array members,suppress it for the first array member
	// 		if bArrayMemberAlreadyWritten == true {
	// 			buffer.WriteString(",")
	// 		}

	// 		buffer.WriteString("{\"Key\":")
	// 		buffer.WriteString("\"")
	// 		buffer.WriteString(queryResponse.Key)
	// 		buffer.WriteString("\"")

	// 		buffer.WriteString(", \"Record\":")
	// 		// Record is a JSON object, so we write as-is
	// 		buffer.WriteString(string(queryResponse.Value))
	// 		buffer.WriteString("}")
	// 		bArrayMemberAlreadyWritten = true
	// 	}
	// }
	// buffer.WriteString("]")

	// if bArrayMemberAlreadyWritten == false {
	// 	return shim.Error(err.Error())
	// }

	// fmt.Printf("- updateClient:\n%s\n", buffer.String())

	//return shim.Success(buffer.Bytes())

	return shim.Success(nil)
}

/*
  * The deleteClient method *
 The data in the world state can be updated with who has possession.
 This function takes in 2 arguments, parsel id and timestamp of delivery.
*/
func (s *SmartContract) removeClient(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 1 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 1")
	// }

	// parselAsBytes, _ := APIstub.GetState(args[0])
	// if parselAsBytes == nil {

    //     fmt.Printf("- deliveryParsel with id: %s Parsel not found \n", args[0])

	// 	return shim.Error("Parsel not found")
	// }
	// parsel := Parsel{}

	// json.Unmarshal(parselAsBytes, &parsel)
	// // Normally check that the specified argument is a valid holder of parsel
	// // we are skipping this check for this example
	
	// if parsel.ReceiverTS != "" {

	// 	fmt.Printf("- deliveryParsel with id: %s Already delivered \n", args[0])

	// 	return shim.Error("Already delivered")
	// }

	// parsel.ReceiverTS = time.Now().Format(time.RFC3339)

	// parselAsBytes, _ = json.Marshal(parsel)
	// err := APIstub.PutState(args[0], parselAsBytes)
	// if err != nil {
	// 	return shim.Error(fmt.Sprintf("Failed to change status of parsel: %s", args[0]))
	// }

	// fmt.Printf("- removeClient:\n%s\n", parselAsBytes)

	return shim.Success(nil)
}

/*
 * The getHistoryForKey method *
 */
func (s *SmartContract) historyClient(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	resultsIterator, err := APIstub.GetHistoryForKey(args[0])

	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {

		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}

		json.Marshal(queryResponse)

		// Some extra historical fields
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(string(queryResponse.TxId))
		buffer.WriteString("\"")
		buffer.WriteString(",\"TxTS\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(queryResponse.Timestamp.Seconds, 0).Format(time.RFC3339))
		buffer.WriteString("\"")
		buffer.WriteString(",\"IsDelete\":")
		buffer.WriteString(strconv.FormatBool(queryResponse.IsDelete))

		// Record the body of JSON object, so we write as-is
		buffer.WriteString(", \"Record\":")
		buffer.WriteString(string(queryResponse.Value))

		buffer.WriteString("}")

		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- historyClient:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
  * main function *
 calls the Start function
 The main function starts the chaincode in the container during instantiation.
*/
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
