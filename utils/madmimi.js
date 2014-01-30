var https = require('https');
var http = require('http');
var querystring = require('querystring');
var xml2js = require('xml2js');

module.exports = function (options) {

    if (!options || !options.email || !options.api_key) {
        throw("need to specify username and api key");
    }

    if (options.debug) {
        logger = console.log;
    }  else {
        logger = function () {};
    }

    this.username = options.email;
    this.api_key = options.api_key;

    this.request = function(requestOptions, body, cb) {

        var httpClient = requestOptions.port === '443' ?  https : http;

        if (requestOptions.method == 'POST') {
            requestOptions.headers = {'content-type': 'application/x-www-form-urlencoded'};
        }

        if (!cb) {
            cb = function() {};
        }

        var httpBody;

        if (arguments.length > 2) {
            httpBody = body;
            logger("httpBody: " + httpBody);
        }


        var req = httpClient.request(requestOptions, function(res) {
            res.body = "";

            logger('STATUS: ' + res.statusCode);
            logger('HEADERS: ' + JSON.stringify(res.headers));

            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                logger('BODY: ' + chunk);
                res.body += chunk;
            });

            res.on('end', function () {
                logger('end');
                cb(res.body);
            });
        });

        if (httpBody) {
            req.write(optionsParameterized);
        }

        req.end();
    };


    function _sendMail(options, cb) {
        var optionsParameterized = querystring.stringify(options, "&", "=");

        var requestOptions = {
            host: 'api.madmimi.com',
            port: '443',
            path: '/mailer',
            method: 'POST'
        };

        this.request(requestOptions, optionsParameterized, cb);
    }

    this.sendMail = function (options, cb) {
        options.username = this.username;
        options.api_key = this.api_key;

        // if (options.jade) {
        //   jade.renderFile(options.jade, options.locals, function(err, html){
        //     if(err) throw err;

        //     delete options.jade;
        //     options.raw_html = html;
        //     _sendMail(options, cb);
        //   });
        // } else {
        _sendMail(options, cb);
        // }

    };

    this.mailStatus = function(id, cb) {
        var options = {
            username: this.username,
            api_key: this.api_key
        };

        var optionsParameterized = querystring.stringify(options, "&", "=");
        var transactionPath =  '/mailers/status/'+ id +'?' + optionsParameterized;

        var requestOptions = {
            host: 'madmimi.com',
            port: '443',
            path: transactionPath,
            method: 'GET',
        };

        this.request(requestOptions, optionsParameterized, cb);
    };

    this.promotions = function (cb) {
        var options = {
            username: this.username,
            api_key: this.api_key
        };

        var optionsParameterized = querystring.stringify(options, "&", "=");
        var transactionPath =  '/promotions.xml' +'?' + optionsParameterized;

        var requestOptions = {
            host: 'api.madmimi.com',
            port: '443',
            path: transactionPath,
            method: 'GET',
        };

        xml_parser_cb = function (data) {
            logger("promotions_xml: " + data);

            var parser = new xml2js.Parser();

            parser.addListener('end', function(result) {
                logger("result_js:");
                logger(result);
                var promotions = result.promotion;

                cb(promotions);
            });

            parser.parseString(data);
        };

        this.request(requestOptions, optionsParameterized, xml_parser_cb);
    };

    this.addToList = function(email, listName, cb) {
        var options = {
            username : this.username,
            api_key : this.api_key,
            email : email,
        };

        optionsParameterized = querystring.stringify(options, "&", "=");

        var requestOptions = {
            host: 'api.madmimi.com',
            port: '80',
            path: "/audience_lists/" + encodeURIComponent(listName)  +'/add',
            method: 'POST',
        };

        this.request(requestOptions, optionsParameterized, cb);
    };

    return this;
};
