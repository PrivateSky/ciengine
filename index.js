


function showConversations(){
    let cli = new CLI();
    cli.showAllAnswers();

}


class CLI{
    constructor() {
        let currentConversationName = "";
        let inputValue = '';
        let core= getCore();
        console.log("CLI initiated!");
    }

    handleClick(optionKey, optionValue){
        //console.log(optionValue);


                this.inputValue = '';
                this.currentConversationName = optionValue;
                ///console.log('currentConvName:',this.currentConversationName);
                // console.log('optionKey: ',optionKey);
                // console.log('optionValue: ',optionValue);
                if(optionValue === 'value' ){
                    //console.log('isaN',optionKey);
                    core.enterResponse(this.state.inputValue);
                }
                else {

                    //console.log("NaN");
                    console.log('isNaN',optionKey);
                    core.enterInput(optionKey);
                }
                // this.state.currentConversationName +

        this.clrscr();
        this.showAllAnswers();


    }


    clrscr(){

        document.getElementById('menu').innerHTML = '';
        document.getElementById('form').innerHTML = '';
      //  document.getElementById('jsonform-hasrequired').innerHtml = '';

        console.log("clr");


    }




    showAllAnswers(){
        let views = [];
        let i = 0;
        let ops = core.getCurrentOptions();
        //console.log('ops:',ops);

        document.getElementById('menu').innerHTML += "Current options: </br>";


        for(let option in ops) {
            //console.log(option);
            views.push(
                this.showAnswer(i, option, ops[option])
            );
            i++;
        }


    }

    showAnswer(i, optionKey, optionValue) {
        // ?????
        var thisHere = this;
       // console.log("key: ", optionKey);
       //  console.log("value: ", optionValue);
        if(optionKey == "or") {
            var inp = document.createElement("input");
            inp.type = "text";
            inp.name = "value";
            inp.value = "0";
            inp.onfocus = function(){inp.value = ""};

            var lbl = document.createElement("label");
            lbl.setAttribute("for",optionValue);
            // lbl.innerText = "valll";
           lbl.innerText = optionValue;
           // document.body.appendChild(lbl);
           // document.body.appendChild(inp);

            document.getElementById("menu").appendChild(lbl);
            document.getElementById("menu").appendChild(inp);


      }
        else {
            var btn = document.createElement("BUTTON");        // Create a <button> element
            var t = document.createTextNode(i + " " + optionValue);       // Create a text node
            btn.appendChild(t);                                // Append the text to <button>
            //btn.addEventListener('click', this.handleClick(optionKey, optionValue));
            //btn.setAttribute('onclick',this.handleClick(optionKey, optionValue));
            btn.onclick = function () {
                thisHere.handleClick(optionKey, optionValue);
            }
           // document.body.appendChild(btn);
           // document.body.appendChild(document.createElement("br"));
            document.getElementById("menu").appendChild(btn);
            document.getElementById("menu").appendChild(document.createElement("br"));


        }
  }
}