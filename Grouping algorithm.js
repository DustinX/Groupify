
window.onload = createScores();

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

function assignRest(ungrouped, answer, groups) {
	/*
	Look for the skill that has the fewest people that are strong in that skill
	Then, assign the person strongest in that skill

	Example:
	Number of people with respective skill below 30:
	L: (leaders ignored here because they were already assigned in previous function)
	S: 5
	C: 4
	W: 2

	We would place a person with a strong "S" skill here since more ungrouped people have low S skills
	In this case, we don't want to run out of people with
	 relatively strong S skills by placing them somewhere else first.
	 In other words, we don't want to squander to few ungrouped people left with strong S skills.

	These numbers are evaluated again after a person is placed.
	The "threshold" is increased until there are more people below the threshold than there are
		"extra" people that *wouldn't* need to be that skill.
		(The "threshold" is a number that is slowly incremented to find the skill with the most people below it,
	and therfore find the skill with the most "lowskill" people remaining)

	Example:
	Number of people needed for each skill:
	L: 0
	S: 3
	C: 1
	W: 2

	Number of ungrouped people:
	6

	Number of people that wouldn't have to be each skill:
	L: 6
	S: 3
	C: 5
	W: 4

	Number of people below the current skill threshold:
	L: 3
	S: 4
	C: 1
	W: 2

	It is okay that 2 people is blow the threshold for W because there are still
	 4 people that wouldn't need to cover a W slot
	However, it is a problem that 4 S's are below the threshold because we still need 3 more S's.
	So we assign an S next in this case, since they are in demand the most.


	After placing the S person, it could be W that has the shortage next.
	This way we can avoid a skill not getting any strong representitives
	*/

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
