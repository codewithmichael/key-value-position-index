/**
 * @license Key Value Position Index
 * (c) 2016 Michael Spencer
 * License: MIT
 */
;(function() {
  "use strict";

  var assert = require('assert');
  var T = require('..');

  // Test Constants
  var VALID_KEY = 'valid key';
  var INVALID_KEY = false;
  var VALID_VALUE = 'valid value';
  var VALID_POSITION = 0;
  var FIRST_POSITION = 1;
  var LAST_POSITION = 99;

  var FIRST_KEY = 'first key';
  var FIRST_KEY_VALUE = 'value for first key';
  var SECOND_KEY = 'second key';
  var LAST_KEY = 'last key';
  var KEY_WITH_ONE_VALUE = 'key with a single value';
  var KEY_WITH_MULTIPLE_VALUES = 'key with multiple values';

  //-[ Exports ]----------------------------------------------------------------

  assert(typeof T === 'function',
    "It exports a function");

  //-[ Constructor ]------------------------------------------------------------

  assert(new T().constructor.name === 'KeyValuePositionIndex',
    "Instances have a constructor named KeyValuePositionIndex");

  assert((new T()).hasOwnProperty('_index'),
    "Instances have an _index property");

  //-[ Methods ]----------------------------------------------------------------

  //-[ add ]-*

  assert(new T().add(VALID_KEY, VALID_VALUE, VALID_POSITION) === true,
    "Calling add() with a valid name, value, and position returns true");

  assert(new T().add(INVALID_KEY, VALID_VALUE, VALID_POSITION) === false,
    "Calling add() with an invalid name returns false");

  //-[ find ]-*

  assert(Array.isArray(new T().find(VALID_KEY, VALID_VALUE, VALID_POSITION)),
    "Calling find() will return an array");

  assert(new T().find(INVALID_KEY, VALID_VALUE, VALID_POSITION).length === 0,
    "Calling find() with an invalid name returns an empty array");

  assert(new T().find(VALID_KEY, VALID_VALUE, VALID_POSITION).length === 0,
    "Calling find() when no values are stored will return an empty array");

  assert(populated_t().find(FIRST_KEY, FIRST_KEY_VALUE).length > 0,
    "Calling find() with a stored key and value will return a populated array");

  //-[ remove ]-*

  assert(new T().remove(VALID_POSITION) === false,
    "Calling remove() with a position that has not been stored will return false");

  assert(populated_t().remove(FIRST_POSITION) === true,
    "Calling remove() with a position that has been stored will return true");

  //-[ Sample Usage ]-----------------------------------------------------------

  (function(){
    var people, peopleIndex;

    // List to be indexed
    people = [
      { first_name: 'bob',  last_name: 'smith',    friend: true },
      { first_name: 'amy',  last_name: 'smith',    friend: true },
      { first_name: 'tom',  last_name: 'renolds',  friend: false },
      { first_name: 'mary', last_name: 'everhart', friend: false },
      { first_name: 'alex', last_name: 'roberts',  friend: true },
      { first_name: 'amy',  last_name: 'jones',    friend: false },
      { first_name: 'sue',  last_name: 'stanford', friend: false }
    ];

    // Index for list information
    peopleIndex = new T();

    //---------------
    // Helper methods
    //---------------

    // Indexing rules
    function addPersonToIndex(person, position) {
      // Index friends by first name
      if (person.friend === true) {
        peopleIndex.add('friend_first_name', person.first_name, position);
      }
      // Index everyone by their first initial
      peopleIndex.add('first_initial', person.first_name.substr(0,1), position);
      // Index all object properties
      Object.keys(person).forEach(function(key) {
        peopleIndex.add(key, person[key], position)
      });
    }

    // Removal helper
    function removePerson(position) {
      people.splice(position, 1);   // remove from array
      peopleIndex.remove(position); // remove from index
    }

    //-------------------
    // Populate the index
    //-------------------

    people.forEach(addPersonToIndex);

    //--------------------------------
    // Count objects by property value
    //--------------------------------

    // How many friends do you have?
    var friendCount = peopleIndex.find('friend', true).length;
    //: friendCount = 3
    assert.strictEqual(friendCount, 3);

    //------------------------------
    // Locate objects by field value
    //------------------------------

    // Who is "amy"?
    var findAmy = peopleIndex.find('first_name', 'amy');
    var amyInfo = findAmy.map(function(v) { return people[v]; });
    //: findAmy = [1, 5];
    //: amyInfo = [{ first_name: 'amy', last_name: 'smith', friend: true },
    //             { first_name: 'amy', last_name: 'jones', friend: false }]
    assert.deepStrictEqual(findAmy, [1, 5]);
    assert.deepStrictEqual(amyInfo, [{ first_name: 'amy', last_name: 'smith', friend: true },
                                     { first_name: 'amy', last_name: 'jones', friend: false }]);

    //------------------------------------
    // Group object info by a custom index
    //------------------------------------

    // Do you know "bob"?
    var isBobFriend = !!peopleIndex.find('friend_first_name', 'bob').length;
    //: isBobFriend = true;
    assert.strictEqual(isBobFriend, true);

    // What are the last names of everyone whose first name begins with "a"?
    var lastNamesForA = peopleIndex
                        .find('first_initial', 'a')
                        .map(function(v) { return people[v].last_name; });
    //: lastNamesForA = ['smith', 'roberts', 'jones']
    assert.deepStrictEqual(lastNamesForA, ['smith', 'roberts', 'jones']);

    //--------------------------------
    // Track objects through deletions
    //--------------------------------

    var findSue;

    // Where is "sue"?
    findSue = peopleIndex.find('first_name', 'sue');
    //: findSue = [6]
    assert.deepStrictEqual(findSue, [6]);

    // Remove all "amy" entries.
    // This is done in reverse-sort order to safely stack array splice() calls.
    peopleIndex.find('first_name', 'amy')
               .slice().sort().reverse()   // copy, sort, and reverse the position order
               .forEach(removePerson);
    //: findSue = [4]
    assert.deepStrictEqual(findSue, [4]);

  }());

  //=[ Utility ]================================================================

  function populated_t() {
    var t = new T();

    t.add(FIRST_KEY, FIRST_KEY_VALUE, FIRST_POSITION);
    t.add(SECOND_KEY, 'first value for second key', 3);
    t.add(SECOND_KEY, 'second value for second key', 6);

    t.add(KEY_WITH_ONE_VALUE, 'the only value', 10);

    t.add(KEY_WITH_MULTIPLE_VALUES, 'first value', 20);
    t.add(KEY_WITH_MULTIPLE_VALUES, 'second value', 21);
    t.add(KEY_WITH_MULTIPLE_VALUES, 'third value', 22);

    t.add(LAST_KEY, 'value for last key', LAST_POSITION);

    return t;
  }
}());
