/*Class dEntry
-Creates an object of type dEntry
- includes an unique id , the date, and the entry itself */
class dEntry {
  constructor(id, date, entry) {
    this.id = id;
    this.date = date;
    this.entry = entry;
  }
}

//Function getDate(input): Returns the date that the user provides
function getDate(input) {
  return document.getElementById(input).value.trim();
}

// Function: generate ID, tasked with making a random UUID as the primary key
function generateId() {
  return crypto.randomUUID();
}

//Function: saveEntryByDate(date, text) 
async function saveEntryByDate(date, text) {
  // Try block to test the code
  try {
    // generate an unique id for the entry
    const id = generateId();
    // Get the result when we fetch for entries
    const res = await fetch('http://localhost:3000/api/entries', {
      // Note we are using POST to get data  from web to store it
      method: 'POST',
      //Metadata  as JSON and what we are taking from JSON
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, date, text })
    });
    // Get the data from the result's json and return it, otherwise throw an error.
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to save entry:", err);
  }
}

// Functiom: GetEntryByDate(date) 
async function getEntryByDate(date) {
  // Try block
  try {
    // Fetch the date and save it into result
    const res = await fetch(`http://localhost:3000/api/entries/${date}`);
    // If we don't get a result, return null
    if (!res.ok) return null;
    // Save the data from the result's json
    const data = await res.json();
    return data; // return the data 
  } catch (err) { // Otherwise if something breaks, throw an error
    console.error("Failed to fetch entry:", err);
    return null;
  }
}

// NEW: Delete a single entry from the backend
async function deleteEntryByDate(date) {
  // Try block
  try {
    // Fetch the result from the given data 
    const res = await fetch(`http://localhost:3000/api/entries/${date}`, {
      method: 'DELETE' // We are going to use delete as the method
    });
    const data = await res.json(); // get the data from the result's JSON
    return data; //return the data
  } catch (err) { // otherwise throw an error 
    console.error("Failed to delete entry:", err);
  }
}

/*writeEntry() 
- Should take in user input for an entry and store it like this:
                            date
                            Text
                            Space for next one
*/
async function writeEntry() {
  // Take the date using ISO and slice it so we only get the month, day, year
  const today = new Date().toISOString().slice(0, 10);
  // have the text be from the entry text trimmed down.
  const text = document.getElementById("entryText").value.trim();
  // If there is nothing written, then return an alert that we cant save an empty text
  if (!text) {
    alert("Cannot save empty entry.");
    return;
  }
  // create a variable that checks if there is an entry already written
  const existing = await getEntryByDate(today); 
  if (existing) { //If that vairable is not empty, alert user to edit instead
    alert("Entry already exists, Edit it instead.");
    return;
  }
  // otherwise run the save entry function and change the text to such
  await saveEntryByDate(today, text);
  alert("Entry saved!");
  document.getElementById("entryText").value = "";
  hideAll();
}


/*readEntry(inputID = "entryDate", resultID ="viewResult") 
give a date, should parse through the entry until you reach the date and reads that section
*/
async function readEntry(inputID = "entryDate", resultID = "viewResult") {
  // Get the date and the result 
  const date = getDate(inputID);
  const result = document.getElementById(resultID);
  result.innerHTML = ""; //set the inner html to blank
  // if the date doesnt exist, ask user for it
  if (!date) {
    alert("Please enter a date.");
    return;
  }
  // otherwise get the entry and if it exists switch the innerhtml to it
  const entry = await getEntryByDate(date);
  if (entry) {
    result.innerHTML = `<strong>${entry.date}:</strong><br>${entry.text}`;
  } else {
    result.innerHTML = "No entry found for that date."; //otherwise return that we cant find it 
  }
}

/* Function loadEntryForEdit()
Given a date, should find entry then allow the user to edit their work*/
async function loadEntryForEdit() {
  // Get the date selected
  const date = getDate("editDate");
  const entry = await getEntryByDate(date); // get the entry from what we want
  if (entry) { // If there is an entry, set the html to display the entry's text
    document.getElementById("editText").value = entry.text;
  } else { // Otherwise alert user that there is no entry for that date
    alert("No entry found for that date.");
    document.getElementById("editText").value = "";
  }
}
// Function: saveEditedEntry()
async function saveEditedEntry() {
  // Get the date and text
  const date = getDate("editDate");
  const newText = document.getElementById("editText").value.trim();
  if (!newText) { //If there is no text, then alert user
    alert("Cannot save empty entry.");
    return;
  }
  await saveEntryByDate(date, newText); // Same API for new + updated
  alert("Entry updated successfully!"); //reset the editText and Date
  document.getElementById("editText").value = "";
  document.getElementById("editDate").value = "";
  hideAll();
}

//Function deleteEntry(), allows user to delete the entry
async function deleteEntry(inputID = "entryDelete", resultID = "deleteResult") {
  //Check if the user really wants to delete that entry
  if (!confirm("Are you sure you want to delete this entry? Hit \"ok\" to proceed.")) {
    return;
  }
  //if so, get the date from the user input
  const date = getDate(inputID);
  const result = document.getElementById(resultID); //save the result
  result.innerHTML = ""; //make the inner html blank

  if (!date) { //If no date is selected, alert the user to enter a date
    alert("Please enter a date.");
    return;
  }
  // Check if there is an existing entry for selected date
  const existing = await getEntryByDate(date);
  if (!existing) { // If there isn't then return that there is no entry
    result.innerHTML = "No entry found for that date.";
    return;
  }
  //Otherwise, call deleteEntryByDate and delete the entry
  await deleteEntryByDate(date);
  alert("Entry deleted!"); // Tell the user that it's done
  result.innerHTML = "Entry Deleted!";
  document.getElementById(inputID).value = "";
}



// The show functions show the prompts needed per button function
function showWrite() {
  hideAll();
  document.getElementById("write").classList.remove("hidden");
}

function showView() {
  hideAll();
  document.getElementById("view").classList.remove("hidden");
}

function showEdit() {
  hideAll();
  document.getElementById("edit").classList.remove("hidden");
  document.getElementById("editText").value = "";
  document.getElementById("editDate").value = "";
}
function showDelete() {
  hideAll();
  document.getElementById("delete").classList.remove("hidden");
}

//Hide functions hide everything when needed
function hideAll() { 
  document.getElementById("delete").classList.add("hidden");
  document.getElementById("edit").classList.add("hidden");
  document.getElementById("write").classList.add("hidden");
  document.getElementById("view").classList.add("hidden");
  document.getElementById("viewResult").innerHTML = "";
}
