var ofEvent = require('./lib/ofEvent')
var combineEpics = require('./lib/combineEpics')
var createEpicMiddleware = require('./lib/createEpicMiddleware')

module.exports = {
  ofEvent: ofEvent,
  combineEpics: combineEpics,
  createEpicMiddleware: createEpicMiddleware
}
