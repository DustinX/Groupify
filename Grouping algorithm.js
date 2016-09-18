
	/*
  You can run this again to produce a new random set of skill values for each person, 
    which will be reflected in the grouping
    
  The traitify type scores are displayed on the left, the condensed types/skills in the middle,
    and the final groups on the right
    
  
  The Traitify Core Assessment types are condensed from 7 to 4.
  
  The conversion is:
  Leader = Adventurous + Charismatic
	Social = Thoughtful + Social
	Creative = Rational + Mellow
	Work Ethic = Reliable
  
  (I refer to the types as "skills" below)
  
  People with strongest leadership skill are assigned first.
  This is to assure each group has the strongest leader possible, since it is an important role.
  It is also to break up the leaders so they don't fight for control within the same group
  
	The rest are assigned by looking for the skill that 
  has the fewest people that are strong in a skill (i.e. the skill with a "shortage").
  
	I determine which skill is most short of strong candidates by counting the number of people below a threshold in each skill, and then compare that to how many open slots there still are for that skill.  I raise the threshold each pass until I find the first skill with more people below the threshold than there are "extra" people that wouldn't have to be that skill.


	Example:
	Number of people needed for each skill:
	L: 0  (leaders were assigned first)
	S: 3
	C: 1
	W: 2

	Number of ungrouped people:
	6

	Number of people that *wouldn't* have to be each skill ("extra" people):
	L: 6
	S: 3
	C: 5
	W: 4

	Number of people below the current skill threshold:
	L: 3
	S: 4
	C: 5
	W: 2




	We would place a person with a strong "S" skill in this pass since more ungrouped people have low S skills than there would be extra people (4 vs 3).
	
  We don't want to run out of people with
	 relatively strong S skills by placing them somewhere else first.

	After a person is placed these numbers are evaluated again.

	It is okay that 5 people are blow the threshold for C because there are still
	 5 people that wouldn't need to cover a C slot.
   
   Limitations:
   Currently it does not handle cases where the total number of people is not a multiple of 4.  This could be handled by determing which personality types are least damaging to go without or most beneficial to duplicate and creating groups of 3 or 5.
	*/

window.onload = createScores();


//I've listed this grouping function first since it is the most interesting, though it is not the first function called.

function assignRest(ungrouped, answer, groups) {

  //Begin code
  
	//the number of people that wouldn't have to fill that role
	var excess = {
		L: 0,
		S: 0,
		C: 0,
		W: 0
	};

	//the number of empty spots in answer array for that role
	var needed = {
		L: 0,
		S: groups,
		C: groups,
		W: groups
	};

	//the number of people with the skill below the threshold
	//these are in reverse order of priority so that the highest priority ones overwrite and win out
	var lowSkill = {
		S: 0,
		C: 0,
		W: 0,
		L: 0
	};

	//how many people are below the threshold in that pass???
	var deficit = {
		L: 0,
		S: 0,
		C: 0,
		W: 0
	};

	while (ungrouped.length) {

		excess = {
			L: 0,
			S: 0,
			C: 0,
			W: 0
		};

		//to calculate excess = number of people remaining - needed for that skill
		for (let skill in excess) {
			excess[skill] = ungrouped.length - needed[skill];
		}

		var threshold = 10;
		var deficitSkills = 0;
		var deficitSkill = "";
		var greatestShort = 0;

		//find skill with fewest strong representitives
		while (deficitSkills === 0) {

			//these are in reverse order of priority so that the highest priority ones overwrite and win out
			//the number of people with the skill below the threshold
			lowSkill = {
				S: 0,
				C: 0,
				W: 0,
				L: 0
			};

			//how many people are below the threshold in that pass
			deficit = {
				L: 0,
				S: 0,
				C: 0,
				W: 0
			};

			//find the number of people below the threshold
			ungrouped.forEach(function(person) {
				for (let skill in person) {
					if (person[skill] < threshold && needed[skill] > 0) {
						lowSkill[skill]++;
					}
				}
			});

			//check each skill for a deficit at current threshold
			for (let skill in lowSkill) {

				//if deficit
				if (lowSkill[skill] >= excess[skill]) {

					//record how many short we are, to break ties if two skills below deficit
					deficit[skill] = lowSkill[skill] - excess[skill];

					//determine skill with greatest deficit
					if (deficit[skill] >= greatestShort) {
						greatestShort = deficit[skill];
						deficitSkill = skill;
					}

					deficitSkills++;
				}
			}

			//if deficitSkills is still 0, then run the loop again

			//increase the threshold so will find more lowskill in next loop, if needed
			threshold += 10;
		}

		//selct the person with the highest skill in the deficit and prepare their data and then send it to the assign function

		let strongestPerson = NaN;
		let strongestValue = 0;

		ungrouped.forEach(function(person, index) {
			if (person[deficitSkill] > strongestValue) {
				strongestValue = person[deficitSkill];
				strongestPerson = index;
			}
		});

		//decrement needed object for the skill we just placed someone for
		needed[deficitSkill]--;

		//prepare the data for the seleted person and call the assign function
		var addThem = [];

		//[{id: "name", skill: "L"}]
		addThem.push({
			id: ungrouped[strongestPerson].id,
			specialty: deficitSkill
		});

		//remove them from the candidate array
		ungrouped.splice(strongestPerson, 1);

		//add to group
		addToGroup(addThem, answer);
	}
}


function createGroups(ungrouped) {

	//the number of groups we will make
	var groups = Math.ceil(ungrouped.length / 4);

	//this will be the created groups we produce
	var answer = [];

	//make the array the size of group
	for (let i = 0; i < groups; i++) {
		answer.push({
			L: "",
			S: "",
			C: "",
			W: ""
		});
	}

	//assign leaders
	assignLeaders(ungrouped, answer, groups);

	//assign everyone else
	assignRest(ungrouped, answer, groups);

	//display groups on webpage
	displayGroups(answer);

	return;
}


function assignLeaders(ungrouped, answer, groups) {

	/*
    find the people with the highest leader traits
    assign each of them to their own group

    this is to make sure each group has a leader, and to
		avoid having two strong leaders in a group that might argue over direction and control

    Algorithm:
		while there are still answer groups with no leader
    find the person with the highest leader trait
    send them to assign person
		*/

	ungrouped.sort((a, b) => b.L - a.L);

	var addThese = [];

	//find a leader for each group
	for (var i = 0; i < groups; i++) {

		//take the first person off the sorted array
		let temp = ungrouped.shift();
		addThese.push({
			id: temp.id,
			specialty: "L"
		});
	}

	addToGroup(addThese, answer);

	return;
}



//addToGroup can accept an array of one or many
//if many, just go through it an add each one
function addToGroup(ungroupedAdd, answer) {

	//for each person in the array, find a team with that skill empty and add person
	var index = 0;

	ungroupedAdd.forEach(function(person, curr) {

		//find first team with an empty slot for the skill of that person, then add them there
		index = answer.findIndex((answerObject) => answerObject[person.specialty] === "");
		answer[index][person.specialty] = person.id;
	});

	return;
}


function displayGroups(answer) {
	/*
	  loop through answer array
	    create div for each group
	  loop through object
	    add each name to div
	*/


	var holderAnswer = document.createElement("div");

	answer.forEach(function(object, index) {
		let group = document.createElement("div");
		group.innerText = "group " + (index + 1) + "\n";
		for (let skill in object) {
			group.innerText += skill + ": " + object[skill] + "\n";
		}
		group.innerText += "\n";
		holderAnswer.appendChild(group);
		holderAnswer.id = "answer";
	});

	document.body.appendChild(holderAnswer);

	return;
}


function createScores() {
	//for each person randomly create all 7 scores

	//creating array manually here so that names are consistent.

	var raw = [{
		id: "Dan",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Joe",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Dustin",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Steve",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "David",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Jean",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Neil",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Jack",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Stephanie",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Kenny",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Matt",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}, {
		id: "Ken",
		adventurous: NaN,
		charismatic: NaN,
		mellow: NaN,
		rational: NaN,
		reliable: NaN,
		social: NaN,
		thoughtful: NaN
	}];


	var ungrouped = [{
		id: "Dan",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Joe",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Dustin",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Steve",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "David",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Jean",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Neil",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Jack",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Stephanie",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Kenny",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Matt",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}, {
		id: "Ken",
		L: NaN,
		S: NaN,
		C: NaN,
		W: NaN
	}];

	//alphabetize lists
	raw.sort((a, b) => a.id.localeCompare(b.id));
	ungrouped.sort((a, b) => a.id.localeCompare(b.id));

	//condense native 7 Traitify traits to our 4 traits
	raw.forEach(function(person, index) {
		for (let skill in person) {
			if (skill !== "id") {
				person[skill] = Math.floor(Math.random() * 100);
			}
		}

		ungrouped[index].L = Math.floor((person.adventurous + person.charismatic) / 2);
		ungrouped[index].S = Math.floor((person.thoughtful + person.social) / 2);
		ungrouped[index].C = Math.floor((person.rational + person.mellow) / 2);
		ungrouped[index].W = person.reliable;
	});

	//display the raw data in a table

	var rawTable = document.getElementById("rawTable");

	raw.forEach(function(object) {
		let row = document.createElement("tr");
		for (let skill in object) {
			let item = document.createElement("td");
			item.innerText += object[skill];
			row.appendChild(item);
		}
		rawTable.appendChild(row);
	});


	//display combined data in a table

	var ungroupedTable = document.getElementById("ungroupedTable");

	ungrouped.forEach(function(object) {

		let row = document.createElement("tr");
		for (let skill in object) {
			let item = document.createElement("td");
			item.innerText += object[skill];
			row.appendChild(item);
		}
		ungroupedTable.appendChild(row);
	});


	//assign people to groups
	createGroups(ungrouped);
}
