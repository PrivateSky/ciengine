function Conversation(ctor, core, config){
    let options = {};
    let self = this;

    this.options = function(optObj){
        if(optObj) {
            options = optObj;
        }
       // console.log("options1: ", options);

        return options;
    }

    this.enterInput = function(value){

        //console.log("Create conversation!");

       // console.log("Value:",value);

        let target = self[value]; //take a function

        //console.log('Target:',target);

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
    this.askTest = core.askTest.bind(core);

    this.endConversation = function(cause){
        if(self.onCancel){
            self.onCancel(cause)
        }
        core.endConversation();
    }

    for(let v in config){
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
    let self = this;
    let conversationTypes = {};
    let options = {};
    let viewText= '';

    this.currentConversation = null;
    //let previousConversation;
    //let previousOptions;

    this.addConversation = function(name, description, swarmConversationType){
        conversationTypes[name] = swarmConversationType;
        options[name]      = description;
     //   this.say("cdamian " + conversationTypes["MyProfile"]);
	//	console.log(JSON.stringify(conversationTypes["MyProfile"], null, 4));
    }

    this.getCurrentOptions = function(){
        let o = null;
        //console.log("Get options!");
        if(self.currentConversation  != null){
            o = Object.assign({}, self.currentConversation.options());
            //console.log("self.currentConversation: ", self.currentConversation);
           // console.log("options in getCurrentOtions: ", o);
            insertOption(o,"back","Back to previous menu");
            insertOption(o, "cancel", "Cancel this conversation");
           // console.log("Get options!A");
        } else {
            o = Object.assign({}, options);
           // console.log("Get options!B",o);

        }

        if(additionalText){

            if(typeof(additionalText) == 'string' )
                    insertOption(o, "or", additionalText);
            else {
                console.log('aaa',additionalText);


                //console.log('form');
                 //let form = document.createElement("form");
                 //document.body.appendChild(form);



                document.getElementById('form').innerHTML += "Data input: </br>";
                $('form').jsonForm(additionalText);


            }
        }
        return o;
    }

    this.enterInput = function(value){
        viewText= '';
            //console.log("enterInput!",self);
        console.log("Pas0", value);
            if(self.currentConversation){

                //console.log("Pas1");
                if(value === "cancel"){
                    self.currentConversation.endConversation("with Cancel");
                   // self.currentConversation = previousConversation;
                   // otions = previousOptions;
                    console.log("end conv!");

                }
                else if(value === "back"){
                            console.log("to previous menu");
                    self.currentConversation.endConversation("with Back");

                        }
                        else {
                            self.currentConversation.enterInput(value);
                }
            } else {
                let desc = conversationTypes[value];
                if(desc){

                   console.log("new conv!");
                    self.currentConversation  = new Conversation(value, self, desc);
                    self.currentConversation.ctor();
                    //console.log("cuurentConv:", self.currentConversation);


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
                let target = currentConversationCallback;
                currentConversationCallback = null;
                additionalText = null;
                target(null, value);
                //console.log('Received response: ',value);
            } else {
                self.currentConversation.enterInput(value);

            }

        } else {
            this.say("I have nothing to do with text ", value);
            // may be replace with a bot style conversation
        }
    }

    this.endConversation = function(){
       // self.currentConversation  = self.previousConversation;
        self.currentConversation  = null;
        currentConversationCallback = null;
        additionalText = null;
    }

    this.getText = function(){
        //console.log('viewText: ',viewText);
        return viewText;
    }

    this.say = function(text){
        //console.log("Assistant>>>", text);
        viewText += text + '\n';

    }

    let additionalText;
    let currentConversationCallback;


    this.ask = function(text, callback){
        additionalText = text;
        currentConversationCallback = callback;
    }
    this.askNumber = function(text, callback){
       let initialFunc = this.isResponse;
        //console.log("Assistant>>> Askkkk Number");
       this.isResponse = function(value, callback){
           if(isNaN(value)){
               console.log("NaN");

               callback(false);
           }else{
               console.log("Value", value, Object.keys(self.currentConversation.options()).length);
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
           //console.log("Asking Number returning", args);
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


    /*cdamian*/
    this.askTest = function(jsonForm, callback){
        additionalText = jsonForm;
        currentConversationCallback = callback;
    };

}

function getCore(){
    return new CICore();
}