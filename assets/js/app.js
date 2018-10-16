// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket"

var channel = socket.channel('room:lobby', {}); // connect to chat "room"

channel.on('shout', function (payload) { // listen to the 'shout' event
  
if (payload.type !== "game-result") {
    if (payload.type === "game-event") {
      if(payload.name == document.getElementById('name').value) {
        document.getElementById(payload.message).setAttribute("class", "btn btn-success full-width game-btn");
      } else {
        document.getElementById(payload.message).setAttribute("class", "btn btn-danger full-width game-btn");
      }
      check_winner();
    } else {
      var li = document.createElement("li"); // creaet new list item DOM element
      var name = payload.name || b();    // get name from payload or set default
      const styel01 = document.getElementById('name').value === name? "you-chat":"me-chat";
      li.innerHTML = '<div class= '+ styel01 +'><b>' + name + '</b>: ' + payload.message + '</div>'; // set li contents
      ul.appendChild(li);                    // append to list 
    }
  } else {
    alert('Winner is ' + payload.name)
    reset_board();
  }
  
});

channel.join() // join the channel.
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

var ul = document.getElementById('msg-list');        // list of messages.
var name = document.getElementById('name');          // name of message sender
var msg = document.getElementById('msg');            // message input field

let currentPlayerID = null;
if (localStorage.getItem("userID")) {
  currentPlayerID = localStorage.getItem("userID")
} else {
  localStorage.setItem("userID", b());
}
name.value = currentPlayerID;

// "listen" for the [Enter] keypress event to send a message:
msg.addEventListener('keypress', function (event) {
  if (event.keyCode == 13 && msg.value.length > 0) { // don't sent empty msg.
    channel.push('shout', { // send the message to the server on "shout" channel
      name: name.value,     // get value of "name" of person sending the message
      message: msg.value    // get message text (value) from msg input field.
    });
    msg.value = '';         // reset the message input field for next message.
  }
});

const allBtns = document.getElementsByClassName('game-btn');

Array.from(allBtns).forEach(function(element) {
    element.addEventListener('click', gameEvent, false);
});

function gameEvent(event) {
    channel.push('shout', { // send the message to the server on "shout" channel
      name: name.value,     // get value of "name" of person sending the message
      message: event.currentTarget.id,    // get message text (value) from msg input field.
      type: 'game-event'
    });
}

// to generate UUID
function b(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)}


// Reset all btns
function reset_board() {
  Array.from(allBtns).forEach(function(element) {
    element.setAttribute("class", "btn btn-info full-width game-btn");
  });
}


// Winning casses
const winning = [ ['00','01','02'],
                  ['10','11','12'],
                  ['20','21','22'],
                  ['00','10','20'],
                  ['10','11','21'],
                  ['20','21','22'],
                  ['00','11','22'],
                  ['20','11','02'],
                  ['01','11','21'],
                  ['02','12','22']
                   ]

// Check the winner
function check_winner() {
  let currentSuccess = [];
  let currentFail = [];
  Array.from(allBtns).forEach(function(element) {
    if (element.className.search('btn-success') > -1) {
      currentSuccess.push(element.id.substring(3));
    } else if (element.className.search('btn-danger') > -1) {
      currentFail.push(element.id.substring(3))
    } else {

    }
  });

  winning.forEach((validCase) => {
    compare(validCase, currentSuccess);
  });
}
                
function compare(arr1,arr2){
  const finalArray = [];
  
  arr1.forEach(
    (e1)=>arr2.forEach(
      (e2)=> {
        if(e1 === e2){
          finalArray.push(e1)
      }
    }));
  if (finalArray.length == 3) {
    channel.push('shout', { // send the message to the server on "shout" channel
      name: name.value,
      message: 'winner',
      type: 'game-result'
    });
    reset_board();
  }
}