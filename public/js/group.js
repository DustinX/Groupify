//no protect
$( document ).ready(function() {
  console.log('group.js connected');
function createGroups(array) {

  // console.log(array);

  var groups = Math.ceil(array.length / 4);

  //make the array the size of group
  var answer = [];

  var leftover = [];

  for (i = 0; i < groups; i++) {
    answer.push({
      L: "",
      S: "",
      C: "",
      W: ""
    });
  }

  //returns an array of id's of the specialists
  //these people should be placed first in the outer function
  var specialists = findSpecialists(array);
  array = specialists[1];
  specialists = specialists[0];
  // console.log(array);
  /// console.log(specialists);
  leftover = addToGroup(specialists, answer);

  //add the mixed

  //add generalists last to fill in the empty slots
  var generalists = findGeneralists(array);
  array = generalists[1];
  generalists = generalists[0];

  //console.log(generalists);
  //console.log(leftover);

  // console.log(generalists);
  generalists.push(...leftover);
  //console.log(generalists);

  //just add the rest of the people in any open slots
  addRest(generalists, answer);




  //console.log(answer);

  displayGroups(answer);

  return answer;

}


function findSpecialists(array) {

  let dood = [];

  //console.log(array);

  //go through each element in array and if there is a person with 3 scores 3 or less and one score 5 or more, save the index of that person to array of specialists.

  array.forEach(function(person, index) {
    //console.log(person.L);

    let lessThan = 0;
    let greaterThan = 0;
    let skill = "";
    //less than is count of skills 3 or less
    //greater than is count of skills 5 or greater

    //if lessThan is equal to 3 and greaterThan is equal to 1, that person is a specialist

    //console.log(person.id);

    if (person.L <= 30)
      lessThan++;
    if (person.S <= 30)
      lessThan++;
    if (person.C <= 30)
      lessThan++;
    if (person.W <= 30)
      lessThan++;

    if (person.L >= 50) {
      greaterThan++;
      skill = "L";
    }

    if (person.S >= 50) {
      greaterThan++;
      skill = "S";
    }
    if (person.C >= 50) {
      greaterThan++;
      skill = "C";
    }
    if (person.W >= 50) {
      greaterThan++;
      skill = "W";
    }

    if (lessThan === 3 && greaterThan === 1) {
      //add to return array
      dood.push({
        id: person.id,
        specialty: skill
      });

      //remove from pool
      array[index] = null;
    }
  });

  //get rid of elements that are now null

  array = array.filter((val) => val !== null);

  //  console.log(array);

  //console.log(dood);

  //janky AF
  return [dood, array];


}

function findGeneralists(array) {

  //changing this for demo purposes to include everyone else
  //normally the mixed group would have its own function

  //noprotect

  var dood = [];

  //find median
  //if no skill is outside 15 of median, they are generalist.  Add to return array

  array.forEach(function(object, index) {


    let values = [];

    //get the scores from the object
    for (let property in object) {
      //if not the person's name
      if (property !== "id") {
        values.push(object[property]);
      }
    }

    //find median
    values.sort((a, b) => a - b);
    let lowMiddle = Math.floor((values.length - 1) / 2);
    let highMiddle = Math.ceil((values.length - 1) / 2);
    let median = (values[lowMiddle] + values[highMiddle]) / 2;


    //if none of the values are more than 15 away from the median
    if (!values.some((val) => Math.abs(val - median) > 115)) {

      //add to return array
      dood.push({
        id: object.id,
        specialty: ""
      });

      //remove from pool
      array[index] = null;
    }



  });

  //console.log(dood);

  array = array.filter((val) => val !== null);


  return [dood, array];

}

//mixed is everything else


//[{id: "name", skill: "L"}]

//addToGroup can return an array of one or many
//if many, just go through it an add each one
function addToGroup(arrayAdd, answer) {

  //for each person in the array, find a team with that skill empty and add person
  var index = 0;
  var leftover = [];

  //  console.log(arrayAdd);

  arrayAdd.forEach(function(object, curr) {
    //go through answer array and find first team with an empty slot for the skill of that person.  Add them to that slot.
    index = answer.findIndex((answerObject) => answerObject[object.specialty] === "");

    if (index < 0) {
      leftover.push(arrayAdd[curr]);
    } else {

      answer[index][object.specialty] = object.id;
    }
  });

  //if there is no space for the rest of the specialists, return what is left of the area and add these people to generalists


  //handle cases where group size is not multiple of 4

  return leftover;

}


function addRest(arrayAdd, answer) {

  debugger;

  // console.log(arrayAdd);
  //for each person in the array, find a team with that skill empty and add person
  var index = 0;
  var specialty = "";

  //  console.log(arrayAdd);

  arrayAdd.forEach(function(object, curr) {
    //go through answer array and find first team with an empty slot for the skill of that person.  Add them to that slot.
    index = answer.findIndex(function(answerObject) {
      for (let foo in answerObject) {
        if (answerObject[foo] === "") {
          specialty = foo;
          return true;
        }
      }


    });

    if (index < 0) {
      //
    } else {

      answer[index][specialty] = object.id;
    }
  });


}

function displayGroups(answer){
  /*
    loop through answer array
      create div for each group
    loop through object
      add each name to div
  */


  var holder = document.createElement("div");
  // holder.className = "class_to_add";
  holder.className = "row";

  answer.forEach(function(object, index){
    let group = document.createElement("div");
    // group.className = "group col-md-6";
    group.className = "col s6";
    group.innerText = "Group " + (index + 1) + "\n";
    for(let skill in object){
      group.innerText += skill + ": " + object[skill] + "\n";
    }
    group.innerText += "\n";
    holder.appendChild(group);


  })

  document.body.appendChild(holder);


}




//console.log(
  createGroups(
    [{
        id: "Dan",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Joe",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Dustin",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Steve",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "David",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      },


      {
        id: "Jean",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Neil",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Jack",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Stephanie",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "David",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Matt",
        L: 20,
        S: 20,
        C: 80,
        W: 20
      },

      {
        id: "Ken",
        L: 80,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Tom",
        L: 50,
        S: 20,
        C: 80,
        W: 20
      }, {
        id: "Jane",
        L: 20,
        S: 60,
        C: 80,
        W: 20
      }, {
        id: "Mary",
        L: 20,
        S: 40,
        C: 80,
        W: 20
      },



      {
        id: "Mark",
        L: 30,
        S: 20,
        C: 30,
        W: 20
      }
    ]
  )
});
