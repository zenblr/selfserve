var express = require('express');
var querystring = require('querystring');
var request = require('request');
var mongojs = require("mongojs");
var mongohost = process.env.MONGO_HOST ?  process.env.MONGO_HOST : "localhost";
var db = mongojs(mongohost+":27017/Ui", ["tenants"]);

// For debugging the request to Auth with API
// request.debug = true;
// require('request-debug')(request);

var router = express.Router();

router.post('/', function(req, res1, next) {

  /*var domain = process.env.TIMELI_API_DOMAIN || "midsbx.timeli.io", //https://midsbx.timeli-staging.com/login
   port = 443,
   client = process.env.TIMELI_API_CLIENT || "8684cf07-00c4-42f1-8b26-86517a97cce6", //"f5195bd0-6b31-4212-8f82-9cc1ff7edc66",
   secret = process.env.TIMELI_API_SECRET || "mateoriley", //mateoriley //"Secret for Mateo",
   username = req.body.username,
   password = req.body.password;*/

  var domain = req.body.domain,
      port = 443,
      client = req.body.client,
      secret = req.body.secret,
      username = req.body.username,
      password = req.body.password;

  if (domain == '') {
      res1.json({error: "No tenant specified"});
      return;
  }

  if (client != '') {
      db.tenants.update({domain:domain},{domain:domain, client:client, secret:secret},{upsert:true});
      doLogin(domain, port, client, secret, username, password, function (resp) {
        res1.json(resp);
      });
  }
  else {
      db.tenants.findOne({domain:domain}, function(err, tenant){
        if (!err && tenant) {
          doLogin(domain, port, tenant.client, tenant.secret, username, password, function (resp) {
            res1.json(resp);
          });
        }
        else {
          res1.json({error: "Tenant not found"});
        }
      });
  }
});

function doLogin(domain,port,client,secret,username,password, cb) {

    var post_data = querystring.stringify({
      grant_type: "password",
      client_id: client,
      client_secret: secret,
      username: username,
      password: password,
      scope: "asset_admin", //Asset_Admin //asset_admin //Administer
      redirect_uri: "http://fiddle.jshell.net"
    });

    //Replace enconding to conform to x-www-url-application encoding.
    post_data = post_data.replace(/%20/g, '+');
    request.post({
        url: "https://" + domain + ":" + port + "/api/auth/token",
        headers: {
          'Accept': "application/json; charset=utf-8",
          'X-Timeli-Version': '3',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: post_data
    }, function(err, res, body) {
      var payload3 = body || {};
      if (err) {
        cb({error: 'Authentication failed'});
      } else {
        var obj = JSON.parse(payload3);
        if (!obj.hasOwnProperty('access_token')) {
          cb({error: 'Authentication failed'});
        }
        else {
          var response = {
            username: username, token: obj.access_token, domain: domain
          }
          cb(response);
        }
      }
    });
};

module.exports = router;
