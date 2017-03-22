'use strict';

// Importing functions from func_utils.js
var _func_utils = require('./func_utils');

// Generating Keypair

var passcode = 'Thisisapassword'; //have to get password from user
var agile_GW = new _func_utils.Ed25519Keypair(passcode);
console.log(agile_GW.publicKey); // something like "DjPMHDD9JtgypDKY38mPz9f6owjAMAKhLuN1JfRAat8C"
console.log(agile_GW.privateKey); // something like "7Gf5YRch2hYTyeLxqNLgTY63D9K5QH2UQ7LYFeBGuKvo"


// Generate condition for "CREATE" transaction and the output object for the transaction data model
var agile_GW_Condition = new _func_utils.makeEd25519Condition(agile_GW.publicKey);
var agile_GW_Output = new _func_utils.makeOutput(agile_GW_Condition);


// Creating digital asset
var reading = {
    'name': 'dummy data',
    'other data': 'other data'
};

var metadata = null;

// Generate "CREATE" transaction
var createTx = (0, _func_utils.makeCreateTransaction)(reading, metadata, [agile_GW_Output], agile_GW.publicKey);
//console.log(createTx);

// Generate signed "CREATE" transaction
var signedCreateTx = (0, _func_utils.signTransaction)(createTx, agile_GW.privateKey);
console.log(signedCreateTx);
