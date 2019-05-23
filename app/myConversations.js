
let core = getCore();

// todo - posibilitatea adaugarii detalii cont (intrare/iesire bani) la calendar
function Calendar(){
    let jsonCal=[];
    this.addEvent = function(err, value, offsetDays){
        console.log("info: " + value + "@" + Date());
        let todo = {};
        todo.name = value;
      //  todo.offset = offsetDays;

        let date = new Date();
        //date.setMonth(month);
        date.setDate(offsetDays+date.getDate());

        todo.data = date;
        jsonCal.push(todo);
    }

    this.listEvents = function(){
       // console.log(jsonCal);
        for(let i in jsonCal) {
            //console.log("[" + (1+i) + "]" + JSON.stringify(jsonCal[i]));
            core.say("[" + (1+i) + "]" + JSON.stringify(jsonCal[i]));
        }
    }

    this.removeEvent = function(err, value){
         let x = parseInt(value)-10;
         console.log("ev: " + JSON.stringify(jsonCal[x]) + "\n va fi sters!");
         delete jsonCal[x];
        }
}
let cal = new Calendar();

function Expenses(){
    let ron = 0;
    this.income = function(err, value){
         ron += parseInt(value);
         cal.addEvent(err,value,0);
    }
    this.outcome = function(err, value){
        ron -= parseInt(value);
        cal.addEvent(err,-value,0);
    }
    this.status = function(){
        console.log("Sold cont = " + ron);
        core.say("Sold cont = " + ron);
      }
}

let expense = new Expenses();



core.addConversation("myExpenses","Asistent de buget",{
    myExpenses: function(){
        //this.say("Adaugare conversatie cheltuieli!");
        this.options({
            "add": "Adaugă suma incasata",
            "substract": "Adauga suma cheltuita",
            "status": "Afiseaza status cont"
        });
    },
    add: function() {
        this.askNumber("Ce suma a intrat?", expense.income);
    },
    substract: function() {
        this.askNumber("Ce suma s-a cheltuit?", expense.outcome);
    },
    status: function(){
        expense.status();
    }
    });

core.addConversation("myCalendar","Organizator Activitati",{
    myCalendar: function(){
       // this.say("Adaugare conversatie calendar!");
        this.options({
            "add": "Adauga eveniment",
            "delete": "Sterge eveniment",
            "list":"Afiseaza evenimente"
        });
    },
    add: function() {
        this.options({
                    "today": "Today's Event",
                    "tomorrow": "Tomorrow's Event",
                    "tomorrowTestText": "TEST Text input",
                    "tomorrowTestNr": "TEST Number input",
                    "inOneWeek": "In one week event",
                    "altaData": "Alta data"
                });

    },
    today: function(){
        this.askDate("Descriere[Today]: ", function(err, text) {
            cal.addEvent(err, text, 0);
        });
   //     this.askNumber("Adauga cheltuiala:",expense.outcome);
    },
    tomorrow: function(){
        this.askDate("Descriere[Tomorrow]: ", function(err, text) {
            cal.addEvent(err, text, 1);
        });
    },
    tomorrowTestText: function(){
        this.askTest(textInput, function(err, text) {
            cal.addEvent(err, text, 1);
            console.log(text);
        });
    },
    tomorrowTestNr: function(){
        this.askTest(nrInput, function(err, nr) {
           // cal.addEvent(err, text, 1);
        });
    },
    inOneWeek: function() {
        this.askDate("Descriere[Peste 1 saptamana]: ", function (err, text) {
            cal.addEvent(err, text, 7);
        });
    },
    altaData: function(){
        this.say("Data custom");
        //this.askDate("Descriere [data custom]: ", )
    },
    delete: function(){
        this.say("Care eveniment doriti a fi sters?");
        cal.listEvents();
        this.askNumber("Alegeti evenimentul",cal.removeEvent);
    },
    list:function(){
        this.say("All events: ");
        cal.listEvents();
    },
    onCancel:function(cause){
        this.say("Ok, you canceled the Calendar conversation! "+cause);
    }
});

//require("../lib/cli");


core.addConversation("testConversation","Conversatie de test",{
    testConversation: function(){
        this.say('Adaugare conversatie de test');
        this.options({
            "out":"Hello!",
            "in" : "Tell me!"
        });
    },
    out: function(){
        this.say("Hello world!");
    },
    in: function(){
        this.ask('Say something:', function(err, text){
            console.log('text primit: ', text);
            core.say('Received: ' + text);
        })
    }

});