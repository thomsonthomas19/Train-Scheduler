var scheduleTab = $("#schedule-tab");
var modifyTab = $("#modify-tab");
var scheduleTable = $("#schedule-table");
var inputRow = $("#info-row");
var trainName = $("#train-name-input");
var destination = $("#destination-input");
var firstTime = $("#initial-time-input");
var frequency = $("#frequency-input");
var submitBtn = $("#submit-input");
var tbody = $("#tbody");

$(document).ready(function () {
    inputRow.hide();
});

modifyTab.on("click", function () {
    scheduleTab.removeClass("is-active");
    modifyTab.attr("class", "is-active");
    scheduleTable.hide();
    inputRow.show();
});

scheduleTab.on("click", function () {
    modifyTab.removeClass("is-active");
    scheduleTab.attr("class", "is-active");
    inputRow.hide();
    scheduleTable.show();
});
// Steps to complete:

var now = moment().format("hh:mm");
console.log(` Now: ${now}`);

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCR5rc9dCzz4lny07zq4oMD9D_kEiSD10A",
    authDomain: "rutsom-hw.firebaseapp.com",
    databaseURL: "https://rutsom-hw.firebaseio.com",
    projectId: "rutsom-hw",
    storageBucket: "rutsom-hw.appspot.com",
    messagingSenderId: "642116325836"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
submitBtn.on("click", function (event) {
    event.preventDefault();
    console.log("submit working")

    // Grabs user input

    var tName = trainName.val().trim();
    var tDest = destination.val().trim();
    var tTime = firstTime.val().trim();
    var tFreq = frequency.val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: tName,
        dest: tDest,
        time: tTime,
        freq: tFreq
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.time);
    console.log(newTrain.freq);
    console.log("Choo choo, all aboard!");

    // Clears all of the text-boxes
    trainName.val("");
    destination.val("");
    firstTime.val("");
    frequency.val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trName = childSnapshot.val().name;
    var trDestination = childSnapshot.val().dest;
    var trTime = childSnapshot.val().time;
    var trFreq = childSnapshot.val().freq;

    console.log(trName);
    console.log(trDestination);
    console.log(trTime);
    console.log(trFreq);

    var firstTimeConverted = moment(trTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % trFreq;
    var tMinutesTillTrain = trFreq - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");




    // Create the new row
    var newRow = $("<tr class='has-text-centered'>").append(
        $("<td>").text(trName),
        $("<td>").text(trDestination),
        $("<td>").text(trTime),
        $("<td>").text(trFreq),
        $("<td>").text(nextTrain.format("HH:mm")),
        $("<td>").text(tMinutesTillTrain)
    );

    // Append the new row to the table
    tbody.append(newRow);
});



