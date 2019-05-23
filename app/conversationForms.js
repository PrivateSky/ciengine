var textInput = {
    "schema": {
        "name": {
            "type": 'string',
            'title': 'Text',
            "required": true,

        },
        "date": {
            "type": 'number',
            "title": 'Date'
        }
    },
    onSubmit: function (errors, values) {

        console.log(values);
        console.log("err:", errors);

        if (errors) {
            $('#res').html('<p>I beg your pardon?</p>');
        } else {


            $('#res').html('<p>Text: ' + values.name + '.' +
                (values.date ? '<br/>You are ' + values.date + '.' : '') +
                '</p>');
        }
    }
};

var nrInput = {
    "schema": {
        "number": {
            "type": 'number',
            "title": 'Number'
        }
    },
    onSubmit: function (errors, values) {

        console.log(values);
        console.log("err:", errors);

        if (errors) {
            $('#res').html('<p>I beg your pardon?</p>');
        } else {


            $('#res').html('<p>NumberȘ' + values.number + '.' +

                '</p>');
        }
    }
};
