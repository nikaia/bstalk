var request = require("superagent"),
    _ = require("underscore"),
    config = require("./config").get(),
    logger = require("./logger");


function reportError(err) {
  logger.log(err);
  logger.fatal('Beanstalk API  - '+  err.error);
  process.exit(1);
}

function api(endpoint, method) {
   var vmethod = typeof method === 'undefined' ? 'GET' : 'POST';
   var url = 'https://' + config.account + '.beanstalkapp.com/api/' + endpoint + '.json';
   var req = vmethod === 'GET' ? request.get(url) : request.post(url);

   return req
      .auth(config.username, config.token)
      .set('Content-Type', 'application/json')
      .set('User-Agent', 'nikaia-bstalk');
}

function getRepositories(cb) {
     api('repositories').end(function(err, res){
        if(err){
          reportError(err);
        }

        cb(res.body);
    });
}

function repo(repoName, cb) {
  logger.log('Getting repo...');

  api('repositories/' + repoName).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function branches(repoName, cb) {
  logger.log('Getting repo branches...');

  api('repositories/' + repoName + '/branches').end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function getEnvironments(repoName, cb) {
  logger.log('Getting server environment...');

  api(repoName + '/server_environments').end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(
        _.indexBy(
            _.map(res.body, function(item){
              return item.server_environment
            }),
            'name'
        )
      );
  });
}

function environment(repoName, serverEnvironmentId, cb) {
  logger.log('Getting server environments...');

  api(repoName + '/server_enironments/' + serverEnvironmentId).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function deploy(repoName, serverEnvironmentId, revision, comment, cb) {
  logger.log('Deploying ... revision: '+ revision);

  var release = {
      revision: revision
  };

  if(comment){
      release.comment = comment;
  }

  api(repoName + '/releases.json?environment_id='+serverEnvironmentId, 'POST')
    .send({ release: release })
    .end(function(err, res){
      if(err){
        reportError(err);
      }

      cb(res.body.release);
    });
}


function release(repoName, releaseId, cb) {
  api(repoName + '/releases/' + releaseId).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body.release);
  });
}



/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
exports.getRepositories = getRepositories;
exports.branches = branches;
exports.repo = repo;
exports.getEnvironments = getEnvironments;
exports.environment = environment;
exports.deploy = deploy;
exports.release = release;
