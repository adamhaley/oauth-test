//for XML parsing
var xml2js = require('xml2js');
var https = require('https');
//to process WS-Trust requests
var trustClient = require('wstrust-client');

exports.details = function(req, res){

    var userName = req.body.user;
    var userPassword = req.body.password;

    //call endpoint, and pass in values
    trustClient.requestSecurityToken({
        scope: 'http://trailerpark.dev',
        username: userName,
        password: userPassword,
        endpoint: 'https://[AD FS server IP address]/adfs/services/trust/13/UsernameMixed'
    }, function (rstr) {

        // Access the token
        var rawToken = rstr.token;
        console.log('raw: ' + rawToken);

        //convert to json
        var parser = new xml2js.Parser;
        parser.parseString(rawToken, function(err, result){
            //grab "user" object
            var user = result.Assertion.AttributeStatement[0].Attribute[0].AttributeValue[0];
            //get all "roles"
            var roles = result.Assertion.AttributeStatement[0].Attribute[1].AttributeValue;
            console.log(user);
            console.log(roles);

            //render the page and pass in the user and roles values
            res.render('profile', {title: 'User Profile', username: user, userroles: roles});
        });
    }, function (error) {

        // Error Callback
        console.log(error)
    });
};
