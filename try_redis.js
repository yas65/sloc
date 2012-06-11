var redis = require('redis');
var client = redis.createClient();

client.set("message1","hello this is dog,");
client.get("message1",function(err,data){
 console.log(data);	
});