//Note you cant run this project alone, you need to open up a web browser and do it from there 
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

//Function: generate ID, tasked with making a random UUID as the primary key
function generateId() {
  return crypto.randomUUID(); // Browser-native in modern JS
}

/* writeEntry() 
- Should take in user input for an entry and store it like this:
                            date
                            Text
                            Space for next one
*/
function writeEntry() {
    //We want to grab the date and entry
    let id = generateId();
    let today = new Date().toLocaleDateString(); // M/D/Y for US computers
    let text = prompt("Write Your entry here!");
    //then create an entry object with the dEntry class
    let myEntry = new dEntry(id, today, text);
    // Either entries will be an empty array or an array of dEntry
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push(myEntry); //pushes it to the top of the stack/end of queue
    // Saves the newly updated entry 
    localStorage.setItem("entries", JSON.stringify(entries));
}

/*viewEntry() 
give a date, should parse through the entry until you reach the date and reads that section
*/
function viewEntry() {
let found = false;
do {
let tDate = prompt("Enter the date of the entry you want to see, this should be in M/DD/YYYY");
//Check if no date was selected 
   if(tDate == null) {
    alert("No date selected, try again");
}
// Trim the date accordingly
tDate = tDate.trim();
// Parse the entries
let entries = JSON.parse(localStorage.getItem("entries")) || [];
// If there are no entries, then say such
if(entries.length === 0) {
    alert("No entries detected at all");
    found = true;
} else { // Otherwise parse the entries till we find the one we want
    for(let i = 0; i < entries.length; i++) {
        if(entries[i].date == tDate) {
            console.log(entries[i].date + "\n" +entries[i].entry);
            alert(entries[i].date + "\n" +entries[i].entry);
            found = true;
            break;
        }
    }
    if (!found) {
    alert("No entries found with given date");
    }
}
} while(!found);
}


/* runDiary()
    Serves as a menu for the user    
    - Write today's entry
    - View prior entries
    - Modify today's entry? (May be a bit advanced)
    - exit
*/
function runDiary() {
    let isOn = true;
    do {
    console.log("MENU:");
    console.log("Input the corresponding number to do a task");
    console.log("--------");
    console.log("1) Write today's entry");
    console.log("2) View an entry");
    console.log("3) Exit");
    console.log("--------");
    
    let choice = prompt("pick what task you want to run according to the assigned number");
    
    if(choice == "1") {
        writeEntry();
    } else if(choice == "2") {
        viewEntry();
    } else if (choice == "3") {
        alert("Goodbye!");
        isOn = false;
    } else {
        alert("Invalid number. Try again");
    }
    }while(isOn);
}

runDiary();