var express = require('express');
var router = express.Router();
var sys = require('util')
var exec = require('child_process').exec;
var git = require('simple-git');
var bodyParser = require('body-parser');

function log(error, stdout, stderr) { 
	console.log(stdout);
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('API base route. Nothing here.');
});

router.get('/repos/register', function(req, res, next) {
	exec('find ./git -mindepth 2 -maxdepth 2', function(err, stdout, stderr){
		res.render('repo', {dir: stdout});
	});
});

router.post('/repos/register', function(req, res, next) {
	var repoUrl = req.body.repoUrl;
	var repoUrlParams = repoUrl.split('/');
	var repoOwner = repoUrlParams[repoUrlParams.length-2];
	var repoName = repoUrlParams[repoUrlParams.length-1];

	git().clone('https://github.com/'+repoOwner+'/'+repoName, 'git/'+repoOwner+'/'+repoName, [], function(err, data){
		if(!err){
			res.send('repo cloned, endpoint for '+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+' is now available; try <a href="'+req.protocol+'://'+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+'/?command=log --oneline">'+req.protocol+'://'+req.headers.host+'/api/repose/'+repoOwner+'/'+repoName+'/?command=log --oneline'+'</a>');
		} else if(err.indexOf('already exists') > 0){
			res.send('repo already cloned, skipped; endpoint for '+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+' is available; try <a href="'+req.protocol+'://'+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+'/?command=log --oneline">'+req.protocol+'://'+req.headers.host+'/api/repose/'+repoOwner+'/'+repoName+'/?command=log --oneline'+'</a>');
		}else{
			res.send('unknown error.');
		}
	});
});

router.get('/repos/:repoOwner/:repoName', function(req, res, next){
	var repoOwner = req.params.repoOwner;
	var repoName = req.params.repoName;
	var command = req.query.command.split(' ');
	console.log(command);

	git('git/'+repoOwner+'/'+repoName).raw(command, function(err, result){
		if(!err){
			res.send(result);
		}else{
			res.send(err);
		}
	});
});

module.exports = router;
