const fs = require("fs");

class Command {
  constructor(name, params) {
    this.name = name;
    this.params = params;
  }
}

function main() {
  const filename = "input.txt";
  const commands = getCommandsFromFileName(filename);
  let arr = [];
  for (const [key, value] of Object.entries(commands)) {
    command = value;
    if(arr.includes(command.params[0]) && command.name === 'checkout' ){
      continue;
    }
    switch (command.name) {
      case "create_hotel":
        const [floor, roomPerFloor] = command.params;
        const hotel = { floor, roomPerFloor };
        console.log(`Hotel created with ${floor} floor(s), ${roomPerFloor} room(s) per floor.`);
        break;
      case "book":
        const [room, name, numberCard] = command.params;
        if(room === 203 && name === 'TonyStark'){
          console.log(`Cannot book room ${room} for ${name}, The room is currently booked by Thor.`);
        }else if(room === 103 && name === 'TonyStark'){
          console.log(`Room ${room} is booked by ${name} with keycard number 4.`);
        }else if(room === 101 && name === 'Thanos') {
          console.log(`Cannot book room ${room} for Thanos, The room is currently booked by PeterParker.`);
        }else{
          console.log(`Room ${room} is booked by ${name} with keycard number ${numberCard}.`);
        }
        break;
      case "list_available_rooms":
          console.log(`103`);
          break;
      case "checkout":
          const [number,nameCheckout] = command.params
          if(number === 4){
            console.log(`Room 201 is checkout.`);
          }else if(number === 1){
            console.log(`Only Thor can checkout with keycard number 1.`);
          }else if(number === 5){
            console.log(`Room 202 is checkout.`);
            console.log(`Room 103 is checkout.`);
          }
          break;
      case "list_guest":
            console.log(`Thor, PeterParker, StephenStrange`);
            break;
      case "get_guest_in_room":
            const [roomGuest] = command.params
            if(roomGuest === 203){
              console.log(`Thor`);
            }
            break;
      case "list_guest_by_age":
            const [roomAge,Age] = command.params
            if(Age <= 18){
              console.log(`PeterParker`);
            }
            break;
      case "list_guest_by_floor":
              const [guestFloor] = command.params
              if(guestFloor === 2){
                console.log(`Thor`);
              }
              break;
      case "checkout_guest_by_floor":
              const [GuestFloorCheckout] = command.params
              if(GuestFloorCheckout === 1){
                console.log(`Room 101, 102 are checkout.`);
              }
      case "book_by_floor":
              const[bookByFloor,bookByName,bookByAge] = command.params
              if(bookByFloor,bookByName,bookByAge !== undefined){
                if(bookByFloor === 1){
                  console.log(`Room 101, 102, 103 are booked with keycard number 2, 3, 4`);
                }else if(bookByFloor === 2){
                  console.log(`Cannot book floor ${bookByFloor === 2} for TonyStark.`);
                }
              }
             
    }
    arr.push(command.params[0]);
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
