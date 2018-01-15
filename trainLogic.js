// Initialize Firebase
var config = {
  apiKey: "AIzaSyBKdshNPE-_Gg1n3qWHzW4HIUV8WZTiOq8",
  authDomain: "train-scheduler-cf8ec.firebaseapp.com",
  databaseURL: "https://train-scheduler-cf8ec.firebaseio.com",
  projectId: "train-scheduler-cf8ec",
  storageBucket: "",
  messagingSenderId: "1058735981564"
};

firebase.initializeApp(config);
// Create a variable to reference the database
var database = firebase.database();

// Initial Variables (SET the first set IN FIREBASE FIRST)
var trainName = "";
var destination = "";
var tFrequency = "";
var nextArrival = "";
var tMinutesTillTrain = "";

$("#add-train-btn").on("click", function() {
  // Prevent the page from refreshing
  event.preventDefault();

  // Grabs user input - JI needs to manipulate
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#train-destination-input").val().trim();
  var tFrequency = $("#train-frequency-input").val().trim();

  //manipulates the first train and frequency inputs to get the next arrival time
  var firstTrain= $("#train-time-input").val().trim();
  var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  //additional time to add on if first train is more than one hour in the future.
  // var futureTime = [525600 - diffTime]/60;
  var futureTime = [525600 - diffTime];
  console.log(futureTime);
  // var futureTimeRounded = Math.floor(futureTime);
  // console.log(futureTimeRounded);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrainPreCalc = tFrequency - tRemainder;
  if (futureTime > 0) {
    var tMinutesTillTrain = parseInt(futureTime);
    // var tMinutesTillTrain = parseInt([(tFrequency - tRemainder) + (futureTimeRounded * 60)]);
  // } else if (futureTime >0 && futureTime <1) {
  //   var tMinutesTillTrain = parseInt([(tFrequency - tRemainder) + (futureTime * 60)]);
  } else {
    var tMinutesTillTrain = tMinutesTillTrainPreCalc
  }
  //may need conditional statement here - only add if futureTimeRounded > 1
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  console.log("String or Number: " + typeof tMinutesTillTrain);
  console.log(tMinutesTillTrain);

  // Next Train
  var nextArrival = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
  var nextArrivalFB = moment(nextArrival).format("hh:mm");
  console.log(nextArrivalFB);

  // END TIME CONVERSIONS-----------------------------------------------------------
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: destination,
    frequency: tFrequency,
    nextarrival: nextArrivalFB,
    minutesaway: tMinutesTillTrain
  };

  console.log(newTrain);

  // Uploads train data to the Firebase database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.frequency);
  console.log(newTrain.nextarrival);
  console.log(newTrain.minutesaway);

  // Alert
  alert("Train successfully added.");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#train-destination-input").val("");
  $("#train-time-input").val("");
  $("#train-frequency-input").val("");
});

//NEW FUNCTION-------------------------------------------------------------
// Create Firebase event for adding new trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var FBTrainName = childSnapshot.val().name;
  var FBDestination = childSnapshot.val().destination;
  var FBFrequency = childSnapshot.val().frequency;
  var FBNextArrival = childSnapshot.val().nextarrival;
  var FBMinutesAway = childSnapshot.val().minutesaway;

  // Train Info
  console.log(FBTrainName);
  console.log(FBDestination);
  console.log(FBFrequency);
  console.log(FBNextArrival);
  console.log(FBMinutesAway);

  // Add each train's data into the table
  $("#current-train-schedule > tbody").append("<tr><td>" + FBTrainName + "</td><td>" + FBDestination + "</td><td>" +
  FBFrequency + "</td><td>" + FBNextArrival + "</td><td>" + FBMinutesAway + "</td></tr>");
});
