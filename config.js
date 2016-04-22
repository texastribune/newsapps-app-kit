// This is where all the configuration for the project should happen. The ideal
// arrangement would keep you out of the gulpfile entirely.

var config = {};

config.deploy = {
  bucket: 'moose.texastribune.org',
  key: 'antlers',
  profile: 'newsapps'
};

config.dataFolder = './data';
config.templateFolder = './app/templates';

config.data = {
  docs: [
    {
      fileid: '1iSsqopd2QLhlQDx0gVX9rYoUp-akX1tdZMF6910BhaU',
      name: 'story_one'
    },
    {
      fileid: '1iSsqopd2QLhlQDx0gVX9rYoUp-akX1tdZMF6910BhaU',
      name: 'story_two'
    },
    {
      fileid: '1iSsqopd2QLhlQDx0gVX9rYoUp-akX1tdZMF6910BhaU',
      name: 'story_three'
    }
  ],
  sheets: [
    {
      fileid: '1EAS1heGSlxEuq6Wf4y5VjaGLIp0LMH1xwnN0j8TVJIY',
      name: 'meta',
      copytext: {
        basetype: 'keyvalue'
      }
    }
  ]
};

module.exports = config;
