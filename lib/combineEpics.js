var merge = require('rxjs').merge

module.exports = function (epics) {
  return function () {
    var args = [].slice.call(arguments)

    return merge.apply(null, epics.map(function (epic) {
      return epic.apply(null, args)
    }))
  }
}
