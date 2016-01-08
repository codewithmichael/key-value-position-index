/**
 * @license Key Value Position Index
 * (c) 2016 Michael Spencer
 * License: MIT
 * Version: 0.1.1
 */
;(function() {
  "use strict";

  // Required Imports
  var ValuePositionIndex;

  function KeyValuePositionIndex() {
    this._index = {};

    this.add = add;
    this.find = find;
    this.remove = remove;

    //-[ Public Methods ]-------------------------------------------------------

    function add(key, value, position) {
      if (!isValidKey(key)) {
        return false;
      }
      var _index = this._index,
          keyIndex;
      if (_index.hasOwnProperty(key)) {
        keyIndex = _index[key];
      } else {
        keyIndex = _index[key] = new ValuePositionIndex();
      }
      return keyIndex.add(value, position);
    }

    function find(key, value) {
      if (arguments.length < 2 || !isValidKey(key)) {
        return [];
      }
      var _index = this._index;
      if (_index.hasOwnProperty(key)) {
        return _index[key].find(value);
      }
      return [];
    }

    function remove(position) {
      var _index = this._index,
          found = false,
          keyIndex,
          k
      for (k in _index) {
        keyIndex = _index[k];
        if (keyIndex.remove(position)) {
          found = true;
        }
      }
      return found;
    }

    //-[ Utility ]--------------------------------------------------------------

    function isValidKey(key) {
      if (typeof key !== 'string') {
        return false;
      }
      return true;
    }
  }

  //=[ Imports/Exports ]========================================================

  if (exports && module && module.exports) {
    // CommonJS
    ValuePositionIndex = require('value-position-index');
    module.exports = KeyValuePositionIndex;
  } else {
    // Browser
    ValuePositionIndex = this.ValuePositionIndex;
    this.KeyValuePositionIndex = KeyValuePositionIndex;
  }
}());
