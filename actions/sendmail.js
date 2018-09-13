"use strict";
let datafire = require('datafire');
let request = require("request");

let google_gmail = require('@datafire/google_gmail').actions;

var encodedErrorMessage = "";
var encodedMessage = "";
var encodedFailedMessage = "";
var actionContext = "";
var actionInput = "";

function sendError(encMsg, context, responseBody){
  (async () => {

    
    encodedFailedMessage = await google_gmail.buildMessage({
      to: "study@launchbottle.com",
      from: actionInput.email,
      subject: "New notification for LaunchBottle from " + actionInput.email,
      body: "RECAPTCHA FAILED Message: " + actionInput.message + " \nPhone number: " + input.phone
      + "\n\t recaptcha-response: " + captchaurl + "\n" + "Response Body: " + responseBody,
    }, actionContext);
    
   let message = await google_gmail.users.messages.send({
      			body: {
        			raw: encMsg,
      			},
    			}, context);
    
   })();
  
}

function sendMessage(encMsg, context) {
  (async () => {

   let message = await google_gmail.users.messages.send({
      			body: {
        			raw: encMsg,
      			},
    			}, context);
    
   })();
  
 			  
}

module.exports = new datafire.Action({
  inputs: [{
    type: "string",
    title: "name"
  }, {
    type: "string",
    title: "email"
  }, {
    type: "string",
    title: "phone",
    default: "No phone number entered"
  }, {
    type: "string",
    title: "message"
  }, {
    type: "string",
    title: "g-recaptcha-response"
  }],
  handler: async (input, context) => {
  
	 actionContext = context;    
	 actionInput = input;
	 
    let secret = "6LfqAGMUAAAAAMEU-_prKZC4xkf-MYlYKnOYv4Aa";
    let captchaurl = "https://www.google.com/recaptcha/api/siteverify?secret="
    + secret + "&response=" + input["g-recaptcha-response"];
    
    
    encodedMessage = await google_gmail.buildMessage({
      to: "study@launchbottle.com",
      from: input.email,
      subject: "New notification for LaunchBottle from " + input.email,
      body: "Message: " + input.message + " \nPhone number: " + input.phone
      + "\n\t recaptcha-response: " + captchaurl,
    }, actionContext);
    
	encodedErrorMessage = await google_gmail.buildMessage({
      to: "study@launchbottle.com",
      from: input.email,
      subject: "New notification for LaunchBottle from " + input.email,
      body: "Message: Error sending message",
    }, actionContext);
    
        
    
    encodedFailedMessage = await google_gmail.buildMessage({
      to: "study@launchbottle.com",
      from: input.email,
      subject: "New notification for LaunchBottle from " + input.email,
      body: "RECAPTCHA FAILED Message: " + input.message + " \nPhone number: " + input.phone
      + "\n\t recaptcha-response: " + captchaurl,
    }, actionContext);
    
    
	await request.get(captchaurl, function(err, response, body) {
      	if (err) {     
         
				sendError(encodedErrorMessage, actionContext,"Error");    
 
     		 }
			else{
      			if (response.statusCode == 200){
                  let result = JSON.parse(body);
                  if (result.success == 'true'){
                    sendMessage(encodedMessage, actionContext);
                
                  }
                  else{
                    
                	sendError(encodedFailedMessage, actionContext,body);    
				  }
                }
              	
     	 	}
    	}) ;
    
       
    return "Thanks for your note." ;
  },
});
