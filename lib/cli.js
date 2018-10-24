
var readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});



function interactiveConsoleConversation(){
    var cie = require("./cicore");
    var core = cie.getCore();


    var done = false;
    var corespondece = null;
	
    function makeOptionsString(prefix){
        var res = prefix;
        var postfix = "";
        var i = 0;
        var ops = core.getCurrentOptions();
        corespondece = {};
        for(var v in ops){
            if(v != "or"){
                corespondece[i] = v;
                res += "\t";
                res += i;
                res += " ";
                res += ops[v];
                res += "\n";
                i++;
            } else {
                postfix = "or: "+ ops[v];
            }
        }
        return res + postfix;
    }

    function getInput(){
        rl.question(makeOptionsString("Available options:\n") + "\n>>>> ", (answer) => {
            var pos = parseInt(answer);
           //console.log("test >>>> " + pos);

            core.isResponse(pos, function(result) {
                if (result) {
                  //  console.log("test >>>> " + answer);
                    core.enterResponse(answer);
                } else {
                    answer = corespondece[pos];
                    core.enterInput(answer);
                }
                getInput();
            });
        });
    }
    getInput();


}

new interactiveConsoleConversation();



