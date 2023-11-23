const fs = require("fs");


class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

// Class that holds a collection of players and properties and functions for the group
class Persons {
  constructor() {
    this.Persons = []
  }
  // create a new player and save it in the collection
  newPerson(name, age) {
    let p = new Person(name, age)
    this.Persons.push(p)
    return p
  }
  get allPersons() {
    return this.allPersons
  }
  // this could include summary stats like average score, etc. For simplicy, just the count for now
  get numberOfPlayers() {
    return this.allPersons.length
  }
}

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {

  var books = [];
  var keyCards = [];
  let KeyNo = 1;

  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let arr = [];
  for (const [key, value] of Object.entries(commands)) {
    command = value;
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        const hotel = { floor, roomPerFloor };
        for (let f = 1; f <= floor; f++) {
          for (let r = 1; r <= roomPerFloor; r++) {
            var book = { floor: f, room: f * 100 + r, name: '', age: '', keyNo: '', status: '' };
            books.push(book);
            var keyCard = { keyNo: KeyNo++, room: '' }
            keyCards.push(keyCard);
          }
        }
        console.log(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`);
        break;

      case "book":
        const [room, name, age] = command.params;
        for (let b = 0; b < books.length; b++) {
          var keyNoUse = keyCards.filter(e => e.room === "").sort(function (a, b) { return a.keyNo - b.keyNo; });
          if (books[b].room === room) {
            if (books[b].keyNo === '') {
              books[b].name = name;
              books[b].age = age;
              books[b].keyNo = keyNoUse[0].keyNo;

              for (let k = 0; k < keyCards.length; k++) {
                if (keyCards[k].keyNo === books[b].keyNo) {
                  keyCards[k].room = books[b].room;
                  console.log(`Room ${books[b].room} is booked by ${books[b].name} with keycard number ${books[b].keyNo}.`);
                }
              }
            }
            else {
              console.log(`Cannot book room ${room} for ${name}, The room is currently booked by ${books[b].name}.`);
            }
          }
        }
        break;

      case "list_available_rooms":
        var bookAvailable = books.filter(e => e.keyNo === "").sort(function (a, b) { return a.room - b.room; });
        console.log(bookAvailable.map(e => e.room));
        break;

      case "checkout":
        const [keyNo, nameInfo] = command.params;

        for (let b = 0; b < books.length; b++) {
          if (books[b].keyNo === keyNo) {
            if (books[b].name.trim() === nameInfo.trim()) {
              for (let k = 0; k < keyCards.length; k++) {
                if (keyCards[k].keyNo === keyNo) {
                  console.log(`Room ${keyCards[k].room} is checkout.`);

                  books[b].name = '';
                  books[b].age = '';
                  books[b].keyNo = '';
                  keyCards[k].room = '';
                }
              }
            }
            else {
              console.log(`Only ${books[b].name} can checkout with keycard number ${books[b].keyNo}.`);
            }
          }
        }

        break;

      case "list_guest":
        var bookInfos = books.filter(e => e.KeyNo !== "" && e.name !== '').sort(function (a, b) { return a.keyNo - b.keyNo; });
        console.log(bookInfos.map(e => e.name));
        break;

      case "get_guest_in_room":
        const [roomNo] = command.params;
        console.log(books.filter(e => e.room === roomNo).map(e => e.name));
        break;

      case "list_guest_by_age":
        const [compare, ageRange] = command.params;
        if (compare === '=') {
          console.log(books.filter(e => e.age === ageRange && e.name !== '').map(e => e.name));
        }
        else if (compare === '>') {
          console.log(books.filter(e => e.age > ageRange && e.name !== '').map(e => e.name));
        }
        else if (compare === '<') {
          console.log(books.filter(e => e.age < ageRange && e.name !== '').map(e => e.name));
        }
        break;

      case "list_guest_by_floor":
        const [floorNo] = command.params;
        console.log(books.filter(e => e.floor === floorNo && e.name !== '').map(e => e.name));
        break;

      case "checkout_guest_by_floor":
        const [floorCO] = command.params;
        console.log(`Room ${books.filter(e => e.floor === floorCO && e.keyNo !== '').map(e => e.room)} are checkout.`);

        for (let b = 0; b < books.length; b++) {
          if (books[b].floor === floorCO) {
            if (books[b].keyNo !== '') {
              for (let k = 0; k < keyCards.length; k++) {
                if (keyCards[k].keyNo !== '' && keyCards[k].keyNo === books[b].keyNo) {
                  books[b].name = '';
                  books[b].age = '';
                  books[b].keyNo = '';
                  keyCards[k].room = '';
                }
              }
            }
          }
        }

        break;

      case "book_by_floor":

        const [floorRef, nameData, ageInfo] = command.params;
        var data = books.filter(e => e.floor === floorRef && e.keyNo !== '');
        if (data.length > 0) {
          console.log(`Cannot book floor  ${floorRef}  for  ${nameData} `);
        }
        else {
          var roomRefs = [];
          var keyRefs = [];

          for (let b = 0; b < books.length; b++) {
            if (books[b].floor === floorRef) {
              var keyNoUse = keyCards.filter(e => e.room === "").sort(function (a, b) { return a.keyNo - b.keyNo; });

              if (books[b].keyNo === '') {
                books[b].name = nameData;
                books[b].age = ageInfo;
                books[b].keyNo = keyNoUse[0].keyNo;

                for (let k = 0; k < keyCards.length; k++) {

                  if (keyCards[k].keyNo === books[b].keyNo) {
                    keyCards[k].room = books[b].room;

                    var roomRef = { room: books[b].room };
                    var keyRef = { keyNo: books[b].keyNo };

                    roomRefs.push(roomRef);
                    keyRefs.push(keyRef);

                    canbook = true;
                  }
                }
              }
            }
          }
          console.log(`Room ${roomRefs.map(e => e.room)} are booked with keycard number ${keyRefs.map(e => e.keyNo)}`);
        }
        break;
    }
  }
}
function getCommandsFromFileName(fileName) {
  const file = fs.readFileSync(fileName, "utf-8");

  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map(
      ([commandName, ...params]) =>
        new Command(
          commandName,
          params.map((param) => {
            const parsedParam = parseInt(param, 10);

            return Number.isNaN(parsedParam) ? param : parsedParam;
          })
        )
    );
}

main();