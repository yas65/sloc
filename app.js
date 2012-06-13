var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);
var sha246 = require('./sha-256');
app.set('view options',{layout:false});
var sub_channel_counter = {};
//var host = 'yas65.jit.su';
var host = 'localhost:8888';
app.get("/",function(request,response){
	var channel = sha246.convert((new Date).toString());
	io.of('/' + channel).on('connection',function(client){
		var sub_channel = 0
		if(sub_channel_counter[channel] != null){
			sub_channel = sub_channel_counter[channel] + 1;
		}
		sub_channel_counter[channel] = sub_channel
		client.set('sub_channel',sub_channel);
		console.log('Client connected...No:' + channel + "/" + sub_channel);
		client.on("join",function(data){
			client.broadcast.emit('join',data);
		});
		client.on("update_location",function(data){
			console.log(data);
			client.get('sub_channel',function(err,sub_channel){
				console.log(sub_channel)
				client.broadcast.emit('position_update',{lat:data.lat,lng:data.lng,sub_channel:sub_channel});
			});
		});
	});
	response.render(__dirname + '/views/index.ejs',{channel: channel,host: host});	
});

app.get("/:channel",function(request,response){
	var channel = request.params.channel;
	console.log(request.params.channel);
	io.of('/' + channel).on('connection',function(client){
		console.log('Client connected...No:' + channel);
	});
	response.render(__dirname + '/views/index.ejs',{channel: channel,host: host});
});


app.get("/public/*",function(request,response){
	response.sendfile(__dirname + '/public/' + request.params);
})

app.listen(8888);

