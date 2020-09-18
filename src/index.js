// When user performs an action, we create an action object and dispatch it
// The store has as a dispatch method that takes in an action
// Then the store forwards the action to the corresponding reducer
// So we never call the reducer directly, we just work with the store
// The store is in charge of calling the reducer
// The reducer computes the new state and returns it
// Next the store will set the state internally and then notify the
// UI component of the update
// The UI components will then pull out the updated data and refresh themselves

// Steps to build redux applications
// 1 - Design the store (this is the entire application state)
// 2 - Define the actions (actions are plain javaScript objects that describe what just happed or should be updated)
// 3 - Create one or more reducers (reducers are pure functions that take in the store and return the updated store)
// Set up the store based on the reducers

// We'll be building an app for adding bugs
// and keep track of their states, i.e resolved,
// not resolved and in-progress

// 1 - Designing the store
// { bugs: [ { id: 1, description: "some description of the bug", resolved: false}, {}, ..., {}]}

// 2 - Define the actions: Add a bug, mark as resolved, delete a bug
// { type: "bugAdded", payload: {description: ""} } -
// NOTE: type is a mandatory property that redux expects every action to have

// 3 - Create one or more reducers : Done in reducer.js

// 4 - Create the store based on reducers : Done in store.js

import store from "./store";
import { bugAdded, bugResolved, bugRemoved } from "./actions";

/****************** Can Delete everything bellow and just dispatch actions accordingly ******************** */

let sendBtn = document.querySelector(".send-btn");
let bugDescription = document.querySelector("#form__bug-description-input");

// Add a bug to the redux state
sendBtn.addEventListener("click", (e) => {
  let description = bugDescription.value;

  // Dispatching the action
  store.dispatch(bugAdded(description));
});

// Subscribing to actions
// NOTE: subscribe takes in a functions that gets called on every store update
// and returns a function for unsubscribing from the store
const unsubscribe = store.subscribe(() => {
  let state = store.getState();
  let bugsDiv = document.querySelector(".bugs");

  console.log("store changed", state);

  // Create an array of state.length number of bug divs with their description
  let bugs = createBugDivs(state);

  // Update the DOM with new state
  bugsDiv.innerHTML = "";

  let noBugsToShow = document.createElement("h3");
  noBugsToShow.setAttribute("class", "bugs__no-bugs-description");
  noBugsToShow.innerHTML = "No bugs to show at this time!";

  // Show no bugs message if no bugs are available
  bugs.length === 0 && bugsDiv.append(noBugsToShow);

  for (let bug of bugs) {
    bugsDiv.append(bug);
  }
});

// Given an state array of bug objects as defined in BUG_ADDED in reducer.js,
// returns an array of "state.length" number of divs
function createBugDivs(state) {
  return state.map((bug) => {
    let div = document.createElement("div");

    div.setAttribute("class", "bug");
    div.setAttribute("id", `bug-${bug.id}`);
    div.style.cursor = "pointer";
    div.innerHTML = bug.description;

    // Click on a bug removes it
    div.addEventListener("click", (e) => {
      let bugId = e.target.id.split("-")[1];

      // Remove the bug
      store.dispatch(bugRemoved(Number(bugId)));
    });

    return div;
  });
}
