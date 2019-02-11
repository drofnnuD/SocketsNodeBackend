
const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);

var barcode = {barcode:'123456', tickeName:"advanced ticket", string:'test', redeemed: false};
var barcodeTwo = {barcode:'12345678', tickeName:"advanced ticket 2", string:'test 2', redeemed: false};
var barcodeThree = {barcode:'123456789', tickeName:"advanced ticket 3", string:'test 3', redeemed: false};

var masterBarcode = [barcode, barcodeTwo, barcodeThree];


app.get('/', (req, res) => {
	// res.send('Chat Server is running on port 3000')
	var theBigBarcode = masterBarcode[0];

	masterBarcode[0].barcode = 'test update';

	// var test = JSON.stringify(masterBarcode);
	// res.send(test);
	res.send(theBigBarcode.barcode);
});


server.listen(3000,()=>{
	console.log('Node app is running on port 3000');
});

io.on('connection', (socket) => {

	console.log('user connected')

	socket.on('join', function(userNickname) {

			// socket.broadcast.emit('custom', "HEY THIS WORKED");

	        console.log(userNickname +" : has joined the chat "  );

	        // socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
	  		var response = JSON.stringify(masterBarcode);
	  		socket.broadcast.emit('userjoinedthechat', response);
	    });

	socket.on('custom', function() {
		console.log('emitter worked')
		socket.broadcast.emit('hey emitting something here')
	});

	socket.on('redeem', function(barcodeId) {
		var correctBarcodeItem;
		for(var i = 0; i < masterBarcode.length; i++){
			if(masterBarcode[i].barcode == barcodeId){
				masterBarcode[i].redeemed = true;
				correctBarcodeItem = masterBarcode[i];
			}
		}
		socket.broadcast.emit('ticketUpdated', JSON.stringify(correctBarcodeItem));
	});

	socket.on('unredeem', function(barcodeId) {
		var correctBarcodeItem;
		for(var i = 0; i < masterBarcode.length; i++){
			if(masterBarcode[i].barcode == barcodeId){
				masterBarcode[i].redeemed = false;
				correctBarcodeItem = masterBarcode[i];
			}
		}
		socket.broadcast.emit('ticketUnredeemed', JSON.stringify(correctBarcodeItem));
	});

});









