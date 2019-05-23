function Conversation(ctor, core, config){
    var options = {};
    var self = this;

    this.options = function(optObj){
        if(optObj) {
            options = optObj;
        }
        // console.log("options1: ", options);

        return options;
    }

    this.enterInput = function(value){
        var target = self[value]; //take a function
        if(target){
            target();
        } else {
            target = self.default;
            if(!target){
                target = function(name){
                    self.say("This option not available!");
                }
            }
            target(value);
        }
    }

    this.say = core.say.bind(core);
    this.ask = core.ask.bind(core);
    this.askNumber = core.askNumber.bind(core);
    this.askDate = core.askDate.bind(core);

    this.endConversation = function(cause){
        if(self.onCancel){
            self.onCancel(cause)
        }
        core.endConversation();
    }

    for(var v in config){
        if(typeof config[v] == "function"){
            self[v] = config[v].bind(self);
        }
    }

    this.ctor = self[ctor];
}

function insertOption(optObj, id, description){
    optObj[id] = description;
}

function CICore(){
    var self = this;
    var conversationTypes = {};
    var options = {};

    this.currentConversation = null;
    var previousConversation;
    var previousOptions;

    this.addConversation = function(name, description, swarmConversationType){
        conversationTypes[name] = swarmConversationType;
        options[name]      = description;
        //   this.say("cdamian " + conversationTypes["MyProfile"]);
        //	console.log(JSON.stringify(conversationTypes["MyProfile"], null, 4));
    }

    this.getCurrentOptions = function(){
        var o = null;
        if(self.currentConversation  != null){
            o = Object.assign({}, self.currentConversation.options());
            // console.log("self.currentConversation: ", self.currentConversation);
            //console.log("options in getCurrentOtions: ", o);
            insertOption(o,"back","Back to previous menu");
            insertOption(o, "cancel", "Cancel this conversation");
        } else {
            o = Object.assign({}, options);
        }

        if(additionalText){
            insertOption(o, "or", additionalText);
        }
        return o;
    }

    this.enterInput = function(value){
        if(self.currentConversation){
            if(value == "cancel"){
                self.currentConversation.endConversation("with Cancel");
                // self.currentConversation = previousConversation;
                // otions = previousOptions;
                console.log("end conv!");

            }
            else if(value == "back"){
                console.log("to previous menu");
                self.currentConversation.endConversation("with Back");

            }
            else {
                self.currentConversation.enterInput(value);
            }
        } else {
            var desc = conversationTypes[value];
            if(desc){

                console.log("new conv!");
                self.currentConversation  = new Conversation(value, self, desc);
                self.currentConversation.ctor();


                // previousConversation = self.currentConversation;
                //  previousOptions = options;

            } else {
                this.say("Unknown options " + value);
            }
        }
    }

    this.enterResponse = function(value){
        if(self.currentConversation){
            /* if(value == "cancel"){
                self.currentConversation  = null;

            }*/

            if(currentConversationCallback){
                var target = currentConversationCallback;
                currentConversationCallback = null;
                additionalText = null;
                target(null, value);
            } else {
                self.currentConversation.enterInput(value);
            }

        } else {
            this.say("I have nothing to do with text ", value); // may be replace with a bot style conversation
        }
    }

    this.endConversation = function(){
        // self.currentConversation  = self.previousConversation;
        self.currentConversation  = null;
        currentConversationCallback = null;
        additionalText = null;
    }

    this.say = function(text){
        console.log("Assistant>>>", text)
    }

    var additionalText;
    var currentConversationCallback;


    this.ask = function(text, callback){
        additionalText = text;
        currentConversationCallback = callback;
    }
    this.askNumber = function(text, callback){
        var initialFunc = this.isResponse;
        this.isResponse = function(value, callback){
            if(isNaN(value)){
                console.log("NaN");
                callback(false);
            }else{
                //console.log("Value", value, Object.keys(self.currentConversation.options()).length);
                if(self.currentConversation != null) {
                    if (value >= 0 && value <= Object.keys(self.currentConversation.options()).length) {
                        //is option for now
                        console.log("Super option");
                        callback(false);
                    } else {
                        //is value
                        console.log("Entered value: ", value);
                        callback(true);
                    }
                }
            }
            //console.log("Temporary replacement", self.currentConversation000.options());
            return true;
        }

        this.ask(text, (...args) => {
            // console.log("Asking Number returning", args);
            this.isResponse = initialFunc;
            callback(args[0], args[1]);
        });
    }

    this.isResponse = function(value, callback){
        // console.log("isResponse>>", value);
        callback(isNaN (value));
    };

    /*cdamian*/
    this.askDate = function(text,  callback){
        additionalText = text;
        currentConversationCallback = callback;
    };

}

var core = new CICore();

exports.getCore = function(){
    return core;
}
