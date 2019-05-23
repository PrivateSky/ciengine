/*
class test{

    a = 5;
    print(){
        alert(a);
    }
}
*/

/*
class Customer{
    constructor {
    name = "Jhon";
}
    this.getName=function(){
        return this.name;
    };
}
*/

function Customer(){
    this.name="Jhooon";
    this.getName=function(){
        return this.name;
    }
}
function customer(){
    return new Customer();
}