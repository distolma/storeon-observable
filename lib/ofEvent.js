var filter = require('rxjs/operators').filter

module.exports = function () {
  var events = [].slice.call(arguments)

  return function (source) {
    return source.pipe(filter(function (event) {
      return events.indexOf(event) !== -1
    }))
  }
}
