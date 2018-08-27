


function Conversation(ctor, core, config){
    var options = {};
    var self = this;

    this.options = function(optObj){
        if(optObj) {
            options = optObj;
        }
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

    this.addConversation = function(name, description, swarmConversationType){
        conversationTypes[name] = swarmConversationType;
        options[name]      = description;
    }

    this.getCurrentOptions = function(){
        var o = null;
        if(self.currentConversation  != null){
            o = Object.assign({}, self.currentConversation .options());
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
                    self.currentConversation.endConversation();

                } else {
                    self.currentConversation.enterInput(value);
                }
            } else {
                var desc = conversationTypes[value];
                if(desc){
                self.currentConversation  = new Conversation(value, self, desc);
                    self.currentConversation.ctor();
                } else {
                    this.say("Unknown options " + value);
                }
            }
    }



    this.endConversation = function(){
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
}

var core = new CICore();

exports.getCore = function(){
    return core;
}

