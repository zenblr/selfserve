import Immutable from 'immutable'

// Finds the first object in an array with id equal to id param.
// Returns undefined if not found.
export function findById(source, id) {
  return source.find(object => object.id === id)
}

/*
 * Finds the value of the first object in an array with keyName passed in the same as key.
 * Returns undefined if not found.
 */
export function findKeyValueFromArray(source, keyName, key) {
  const object = source.find(object => object[keyName] === key)
  return (object !== undefined) ? object.value : object
}

// fromJS but with OrderedMap.
export function fromJSOrdered(js) {
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ? 
      Immutable.Seq(js).map(fromJSOrdered).toList() :
      Immutable.Seq(js).map(fromJSOrdered).toOrderedMap();
}
