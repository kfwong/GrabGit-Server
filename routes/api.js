var express = require('express');
var router = express.Router();
var sys = require('util')
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
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
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Content-Type', 'application/json');
			res.send(JSON.stringify({'message': 'ok', 'repoOwner': repoOwner, 'repoName': repoName}));
		}else if(err.indexOf('already exists') > 0){
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Content-Type', 'application/json');
			res.send(JSON.stringify({'message': 'already exists', 'repoOwner': repoOwner, 'repoName': repoName}));
		}else{
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Content-Type', 'application/json');
			res.send(JSON.stringify({'message': 'error', 'repoOwner': repoOwner, 'repoName': repoName}));
		}
		/*
		if(!err){
			res.send('repo cloned, endpoint for '+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+' is now available; try <a href="'+req.protocol+'://'+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+'/?command=log --oneline">'+req.protocol+'://'+req.headers.host+'/api/repose/'+repoOwner+'/'+repoName+'/?command=log --oneline'+'</a>');
		} else if(err.indexOf('already exists') > 0){
			res.send('repo already cloned, skipped; endpoint for '+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+' is available; try <a href="'+req.protocol+'://'+req.headers.host+'/api/repos/'+repoOwner+'/'+repoName+'/?command=log --oneline">'+req.protocol+'://'+req.headers.host+'/api/repose/'+repoOwner+'/'+repoName+'/?command=log --oneline'+'</a>');
		}else{
			res.send('unknown error.');
		}
		*/
	});
});
/*
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
*/

router.get('/repos/:repoOwner/:repoName/files', function(req, res, next){
	var repoOwner = req.params.repoOwner;
	var repoName = req.params.repoName;

	git('git/'+repoOwner+'/'+repoName).raw(['ls-files'], function(err, result){
		if(!err){
			res.header('Access-Control-Allow-Origin', '*');
			res.send(result);
		}else{
			res.send(err);
		}
	});

});

router.get('/repos/:repoOwner/:repoName/1d', function(req, res, next){
	var repoOwner = req.params.repoOwner;
	var repoName = req.params.repoName;
	var file = req.query.file;

	git('git/'+repoOwner+'/'+repoName).raw(['blame', '-w', '-M' ,'--line-porcelain', file], function(err, result){
		if(!err){
			res.header('Access-Control-Allow-Origin', '*');
			res.send(result);
		}else{
			res.header('Access-Control-Allow-Origin', '*');
			res.send(err);
		}
	});
});

router.get('/repos/:repoOwner/:repoName/:fromYear/:toYear/1bc', function(req, res, next){
	var repoOwner = req.params.repoOwner;
	var repoName = req.params.repoName;
	var fromYear = req.params.fromYear;
	var toYear = req.params.toYear;
	exec('./1bc.sh '+repoOwner+'/'+repoName+' '+fromYear+' '+toYear+'; python2.7 1bc.py > /tmp/1bc.json', function(err, stdout, stderr){
		res.header('Access-Control-Allow-Origin', '*');
		res.sendFile('/tmp/1bc.json');
	});
});

router.get('/repos/:repoOwner/:repoName/1bc', function(req, res, next){
	var repoOwner = req.params.repoOwner;
	var repoName = req.params.repoName;
	exec('./1bc_all.sh '+repoOwner+'/'+repoName+'; python2.7 1bc.py > /tmp/1bc.json', function(err, stdout, stderr){
		res.header('Access-Control-Allow-Origin', '*');
		res.sendFile('/tmp/1bc.json');
	});
});

router.get('/repos/:repoOwner/:repoName/1e', function(req, res, next){
	var repoOwner = req.params.repoOwner;
	var repoName = req.params.repoName;
	exec('./1e.sh '+repoOwner+'/'+repoName+' > /tmp/1e.csv', function(err, stdout, stderr){
		res.header('Access-Control-Allow-Origin', '*');
		res.sendFile('/tmp/1e.csv');
	});
});

router.get('/repos/:repoOwner/:repoName/1a', function(req, res, next){
	var repoOwner = req.params.repoOwner;
	var repoName = req.params.repoName;
	exec('./1a.sh '+repoOwner+'/'+repoName+' > /tmp/1a.csv', function(err, stdout, stderr){
		res.header('Access-Control-Allow-Origin', '*');
		res.sendFile('/tmp/1a.csv');
	});
});

module.exports = router;
