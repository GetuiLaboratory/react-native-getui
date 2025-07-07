/**
 * Compare arrays
 *
 * @param  {Array} arr1
 * @param  {Array} arr2
 * @return {Boolean} - Arrays are equals
 */
module.exports = function equal(arr1, arr2) {
  var length = arr1.length
  if (arr1 === arr2) return true
  if (length !== arr2.length) return false
  for (var i = 0; i < length; i++)
    if (arr1[i] !== arr2[i])
      return false
  return true
}
