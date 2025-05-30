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
// Function: getEntries(), return the list of entries or a blank if none exist
function getEntries() {
  return JSON.parse(localStorage.getItem("entries")) || [];
}

// Function: SaveEntries(), save the entry
function saveEntries(entries) {
  localStorage.setItem("entries", JSON.stringify(entries));
}

/*writeEntry() 
- Should take in user input for an entry and store it like this:
                            date
                            Text
                            Space for next one
*/
function writeEntry() {
  // get the id, today's date and write the text
    const id = generateId();  
    const today = new Date().toLocaleDateString();
    const text = document.getElementById("entryText").value.trim();
  // If the text is empty, then alert the user that they cant save the date
  if (text === "") {
    alert("Cannot save empty entry.");
    return;
  }
  // Since we want to save the entries, pull from local storage
  const entries = getEntries();
  // Create a checker to see if there's already an entry existing
  const alreadyExists = entries.some(entry => entry.date === today);
  // if it does give an alert
  if (alreadyExists) {
    alert("Entry already exists, Edit it instead.");
    return;
  }
  // Otherwise, create a new dEntry using everything collected
  const newEntry = new dEntry(id, today, text);
  entries.push(newEntry);
  // Set it into local storage
  saveEntries(entries);
  // Alert user of date
  alert("Entry saved!");
  document.getElementById("entryText").value = "";
  hideAll();
}

/*readEntry(inputID = "entryDate", resultID ="viewResult") 
give a date, should parse through the entry until you reach the date and reads that section
*/
function readEntry(inputID = "entryDate", resultID ="viewResult") {
  // Get the date, entries and the result
  const date = getDate(inputID);
  const entries = getEntries();
  const result = document.getElementById(resultID);
  result.innerHTML = "";
  // If we don't have a date, ask the user for the date
  if (!date) {
    alert("Please enter a date.");
    return;
  }
   // Then find the date and match it with the target date
  const match = entries.find(e => e.date === date);
  if (match) {
    result.innerHTML = `<strong>${match.date}:</strong><br>${match.entry}`;
  } else {
    result.innerHTML = "No entry found for that date.";
  }
}
/* Function loadEntryForEdit()
Given a date, should find entry then allow the user to edit their work*/
function loadEntryForEdit() {
  // Get the date and the entries
  const date = getDate("editDate");
  const entries = getEntries();
  // Find the specific entry
  const entry = entries.find(e => e.date === date);
  if (entry) {
    // If we find it, load the entry in the edit box
    document.getElementById("editText").value = entry.entry;
  } else { // Otherwise, tell user that there is no entry
    alert("No entry found for that date.");
    document.getElementById("editText").value = "";
  }
}
// Function saveEditedEntry() Save the entry once done
function saveEditedEntry() {
  //Retrieve the date and text
  const date = getDate("editDate");
  const newText = document.getElementById("editText").value.trim();
  // get the list of entries
  let entries = getEntries();
  //Get the index by finding the date
  const index = entries.findIndex(e => e.date === date);
  // if the index in the array exits
  if (index !== -1) {
    entries[index].entry = newText; // Set entry to whats in the new text
    saveEntries(entries); // Update localSotrage
    alert("Entry updated successfully!"); // alert the user
    document.getElementById("editText").value = ""; //reset the edit text and date to blank
    document.getElementById("editDate").value = "";
    hideAll();
  } else { // Otherwise tell user nothing found
    alert("Failed to update. Entry not found.");
  }
}
//Function deleteEntry(), allows user to delete the entry
function deleteEntry(inputID = "entryDelete", resultID ="DeleteResult") {
 // Do one last check to see if the user wants to delete the entry
  if (!confirm("Are you sure you want to delete this entry? Hit \"ok\" to proceed with deletion")) {
    return;
  }
  // get the date
  const date = getDate(inputID);
  // If we don't have a date, ask the user for the date
  if (!date) {
    alert("Please enter a date.");
    return;
  }
  // Get the list of entries
  const entries = getEntries();
  // pull up the html
  const result = document.getElementById(resultID);
  result.innerHTML = "";
  
  // Then find the date and match it with the target date 
  const match = entries.find(e => e.date === date);
  
  // If we get a match, create a filter entries and save that filtered
  if (match) {
  const filtered = entries.filter(entry => entry.date !== date);
  alert("Entry deleted!");
  saveEntries(filtered);
  document.getElementById(inputID).value = "";
  //update the inner html
  result.innerHTML = "Entry Deleted!"; // Also return that its gone in result
} else {
    result.innerHTML = "No entry found for that date."; // return error message
  } 
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
