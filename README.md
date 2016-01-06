# key-value-position-index

[![Build Status](https://travis-ci.org/codewithmichael/key-value-position-index.svg)](https://travis-ci.org/codewithmichael/key-value-position-index)

JavaScript library, based on value-position-index, to store multiple indices under named keys.

## Example
```js
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
peopleIndex = new KeyValuePositionIndex();

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

//------------------------------
// Locate objects by field value
//------------------------------

// Who is "amy"?
var findAmy = peopleIndex.find('first_name', 'amy');
var amyInfo = findAmy.map(function(v) { return people[v]; });
//: findAmy = [1, 5];
//: amyInfo = [{ first_name: 'amy', last_name: 'smith', friend: true },
//             { first_name: 'amy', last_name: 'jones', friend: false }]

//------------------------------------
// Group object info by a custom index
//------------------------------------

// Do you know "bob"?
var isBobFriend = !!peopleIndex.find('friend_first_name', 'bob').length;
//: isBobFriend = true;

// What are the last names of everyone whose first name begins with "a"?
var lastNamesForA = peopleIndex
                    .find('first_initial', 'a')
                    .map(function(v) { return people[v].last_name; });
//: lastNamesForA = ['smith', 'roberts', 'jones']

//--------------------------------
// Track objects through deletions
//--------------------------------

var findSue;

// Where is "sue"?
findSue = peopleIndex.find('first_name', 'sue');
//: findSue = [6]

// Remove all "amy" entries.
// This is done in reverse-sort order to safely stack array splice() calls.
peopleIndex.find('first_name', 'amy')
           .slice().sort().reverse()   // copy, sort, and reverse the position order
           .forEach(removePerson);
//: findSue = [4]
```
