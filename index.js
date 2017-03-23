'use strict';

// Importing functions from func_utils.js
var _func_utils = require('./func_utils');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


/*****************
* User Input Data *
*******************/

var agile_url = "http://192.168.8.60:8080/api/";// Input Agile-IoT API url
var deviceId = "ble247189079500"; // Input deviceId
var bdb_url = "http://localhost:9984/api/v1/"; // Input bigchaindb API endpoint
var passcode = 'Thisisapassword'; // Input a text password for device here (minimum 8 characters)


// API URLs to be used
var url_device = agile_url+"device/"+deviceId+"/";
var url_bdb = bdb_url+"transactions/";
console.log(url_device, "\n" +url_bdb);



/*********************
* Generating Keypair *
**********************/

var agile_GW = new _func_utils.Ed25519Keypair(passcode);
console.log("\n" + "The public key for this device is: " + agile_GW.publicKey + "\n");
console.log(agile_GW.privateKey);


/*************************
* Generating Transaction *
**************************/

// Generate condition for "CREATE" transaction and the output object for the transaction data model
var agile_GW_Condition = new _func_utils.makeEd25519Condition(agile_GW.publicKey);
var agile_GW_Output = new _func_utils.makeOutput(agile_GW_Condition);


// Generate "CREATE" transaction
var reading = createAsset();
var metadata = null;
var createTx = (0, _func_utils.makeCreateTransaction)(reading, metadata, [agile_GW_Output], agile_GW.publicKey);

// signing transaction with privateKey
var signedCreateTx = (0, _func_utils.signTransaction)(createTx, agile_GW.privateKey);
console.log("The tx id is " + signedCreateTx.id);

// Send signed transaction to bigchaindb
sendTx();




/*************************
* Creating digital asset *
**************************/

function createAsset(){

  // Get reading from Agile http api
  var xhr0 = new XMLHttpRequest();
  xhr0.withCredentials = true;
  xhr0.open("GET", url_device, false);
  xhr0.setRequestHeader("cache-control", "no-cache");
  xhr0.send(null);
  var data = xhr0.responseText;

  console.log(data);
  console.log(data);

  return data;
}



/***************************************
* POST transaction to BDB API endpoint *
****************************************/

function sendTx(){
  // POST fulfilled "CREATE" transaction to the BigchainDB HTTP API endpoint
  var xhr = new XMLHttpRequest();
  var url = "http://localhost:9984/api/v1/transactions"; //figure out how to make this dynamic
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  var data = JSON.stringify(signedCreateTx);
  xhr.send(data);
}
