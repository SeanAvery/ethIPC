
// not a module you need to install w/ npm;
var net = require('net'); 

// javascript api
var Web3 = require('web3');

// solidity compiler via nodejs
var solc = require('solc');

// get file path from geth help
var gethSocket = "/Users/seanapollock/Library/Ethereum/geth.ipc";

function gethIPC(payload, next){
	// if no payload given return 'no payload error'
	if(!payload){
		console.log('no payload');
		next('Error');
	};

	// define socket variable; 
	// net.connect returns a new net.Socket
	var socket = net.connect({path: gethSocket}, function(){
		//Json.stringify converts javascript into a JSON string
		//socket.end 'half' closes the socket
		socket.end(JSON.stringify(payload));
	});

	// add 
	socket.on('data', function(data){
		var r = "";
		r += data.toString(); // buffer or stream comes in, we need to concat the string +=...
		var response = JSON.parse(r);
		next(response);
	});


	socket.on('error', function(error){
		console.log(error);
	});

	//process is a global object; an instance of EventEmitter
	// process is the global for the current parent process, which should be the node process.
	process.on('SIGINT', function(){
		console.log("Caught interrupt signal");
		socket.end();
		process.exit() 
	});
};


var payload = {jsonrpc: '2.0', method : 'personal_listAccounts', params: [], id: 1};

gethIPC(payload, function(data){
	if(data.error){
		console.log('ERROR');
		console.log(data);
		return false;
	}
	console.log('success');
	console.log(data.result);

});

// Attempt to interact with javascript API 
//var web3 = new Web3();

//console.log(web3);

// set HTTP provider for RPC calls
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

//var coinbase = web3.eth.coinbase;
//var balance = web3.eth.getBalance(coinbase);

//console.log(balance);
