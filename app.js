var express     = require('express');
var R           = require('ramda');
var simpleProxy = require('simple-http-proxy');
var compression = require('compression');
var config      = require('./config');
var url         = require('url')

var env         = process.env.NODE_ENV ? process.env.NODE_ENV: "localdev";
var app         = express();
var proxyTo     = R.merge(config.defaults,config[env].proxyTo);
var delim       = proxyTo.delim;
var target      = proxyTo.target;
var httpProxy   = simpleProxy(target, {
	timeout: 60000
});

var superAdminProxy  = simpleProxy(target, {
	timeout: 60000,
	xforward: true
});

app.use(compression());
app.use(express.static(__dirname + "/public/build"));

app.use('/super-admin', express.static(__dirname + "/public/build/super-admin"));

app.use('/application/*', express.static(__dirname + "/public/build"));

app.get(["/application/*", "/user/*"], function(req, res, next) {	
	res.redirect('/#' + req.path);
});

app.use(delim, function(req, res, next) {
	req.headers['web_ui_api_key'] = proxyTo.web_ui_api_key;
	if (!isPermittedIP(req.host))
		if (isAdminPath(req.path)) return superAdminProxy(req, res, next);
	return httpProxy(req, res, next);
});

function isPermittedIP(host) {
	if(config.IP.whiteList.indexOf(host) != -1)
		return true;
	else
		return false
}

function isAdminPath(path) {
	return (path.indexOf('/admin') != -1);
}

module.exports = app;