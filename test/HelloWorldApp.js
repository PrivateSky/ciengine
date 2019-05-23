
var cie = require("../_unused/lib/cicore");


var core = cie.getCore();


core.addConversation("MyProfile","Update your profile", {
    MyProfile:function(){
        this.ask("Give me your name?", this.onName);
    },
    onName:function(err, name){
        this.say("Hello " + name);
        this.ask("Give me your email", this.onEmail);
    },
    onEmail:function(err, name){
        this.say("Nice Profile! Thank you!");
        this.endConversation();
    },
    onCancel:function(){
        this.say("Ok, you canceled this conversation. Your profile WILL not be updated!");
    }
})


core.addConversation("about","About this application", {
    about:function(){
        this.say("Just the Hello world application, the conversational way" );
        this.endConversation();
    }
})

core.addConversation("joke","Do you need a joke?", {
    joke:function(){
        this.options({
            "traditional":"Traditional joke",
            "light":"Light bulb joke",
            "knock":"Knock knock jokes",
            "nonsense":"Non Sequitur"
        })
    },
    traditional:function(){
        this.say("I do not have any traditional joke");
    },
    light:function(){
        this.say("I do not have any light joke");
    },
    knock:function(){
        this.say("I do not have any knock joke");
    },
    default:function(value){
        this.say(" Trying to generate a joke about " + value);
    }
});


core.addConversation("Houses","Search houses", {
    Houses:function(){
        this.options({
            "apartments":"Search an apartment",
            "houses":"Search a house",
            "rentA":"Rent an apartment",
            "rentH":"Rent a house"
        });
    },
    apartments:function(err, name){
        //this.say("Hello " + name);
        //this.ask("Give me your email", this.onEmail);
    },
    houses:function(err, name){
        //this.say("Nice Profile! Thank you!");
        //this.endConversation();
    },
    onCancel:function(){
        this.say("Ok, you canceled this conversation. Thank you for using our app");
    }
})


require("../_unused/lib/cli");