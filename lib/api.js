var request = require("superagent"),
    _ = require("underscore"),
    config = require("./config").get(),
    logger = require("./logger");

var colors = [
  'white',
  'pink',
  'red',
  'red-orange',
  'orange',
  'yellow',
  'yellow-green',
  'aqua-green',
  'green',
  'green-blue',
  'sky-blue',
  'light-blue',
  'blue',
  'orchid',
  'violet',
  'brown',
  'black',
  'grey'
];


function reportError(err) {
  if(err.response.error.text){
      logger.fatalWithMessages('Beanstalk error : ', JSON.parse(err.response.error.text).errors);
  }

  logger.fatal('Beanstalk error  - '+  err);
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
  logger.log('Getting repo');

  api('repositories/' + repoName).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function createRepo(repoName, color, cb) {
  var repository = {
    type_id: "git",
    name: repoName,
    title: repoName
  };

  if(color){
      repository.color_label = 'label-' + color;
  }

  logger.spin('working');

  api('repositories', 'POST')
    .send({ repository: repository })
    .end(function(err, res){
      logger.stopSpinner();

      if(err){
        reportError(err);
      }

      cb(res.body.repository);
    });
}

function branches(repoName, cb) {
  logger.log('Getting repo branches');

  api('repositories/' + repoName + '/branches').end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function getEnvironments(repoName, cb) {
  logger.log('Getting server environment');

  api(repoName + '/server_environments').end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(
        _.indexBy(
            _.map(res.body, function(item){
              return item.server_environment;
            }),
            'name'
        )
      );
  });
}

function environment(repoName, serverEnvironmentId, cb) {
  logger.log('Getting server environments');

  api(repoName + '/server_enironments/' + serverEnvironmentId).end(function(err, res){
     if(err){
       reportError(err);
     }

     cb(res.body);
  });
}

function deploy(repoName, serverEnvironmentId, revision, comment, cb) {
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

function isValidColor(color) {
  return _.contains(colors, color);
}

function availableColors() {
  return colors;
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
exports.isValidColor = isValidColor;
exports.availableColors = availableColors;
exports.createRepo = createRepo;
