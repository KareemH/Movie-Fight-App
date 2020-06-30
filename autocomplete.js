// A config variable is passed, but then destructured to root variables
const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  //   // Create the HTML on the JS side and then add it to the HTML view
  //   // This creates a less tightly coupled relationship between the HTML and JS
  // // const root = document.querySelector(".autocomplete"); // Find the element with class autocomplete
  // // Root is a reference to the element with autocomplete, set that element's HTML with the below
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

  // Retrieve the <input> element tag of the HTML
  const input = root.querySelector("input");

  // Retrieve the elements with classes dropdown and results
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    // After the debounce function calls fetchData and fetchData then returns movies to debounce which then returns movies to onInput
    const items = await fetchData(event.target.value);

    // If there are no movies (no search results)
    if (!items.length) {
      // Remove the is-active class to make the dropdown disappear
      dropdown.classList.remove("is-active");
      // Return from the entire function, no need to make the dropdown active as shown below
      return;
    }

    // Make sure to reset the results for a new search query
    resultsWrapper.innerHTML = "";

    // Because input is changng, we want the dropdown to be active with current results being fetched
    // is-active is Bulma css, just append is-active to the classlist of the dropdown element reference
    dropdown.classList.add("is-active");
    // Loop through and format the movies
    for (let item of items) {
      // Create a new anchor tag
      const option = document.createElement("a");

      // To that new anchor tag, add a class of dropdoown-item from Bulma
      option.classList.add("dropdown-item");
      // Set the inner HTML of that anchor tag to be:
      option.innerHTML = renderOption(item);
      // Bulma handles that the img and text are inline

      // Add a click event listener to each option of the dropdown meny
      option.addEventListener("click", () => {
        // When a user clicks
        dropdown.classList.remove("is-active"); // The dropdown is not active
        input.value = inputValue(item); // The input is replaced with the text of the movie the user clicked
        onOptionSelect(item); // Now get the specific detail of a clicked movie using this helper function
      });

      // resultsWrapper is a reference to the div (with class results) that encapsulates all search results
      // For each option (<a> tag), append it as a child to the resultsWrapper element
      resultsWrapper.appendChild(option);
    }
    // console.log(movies);
  };

  // Add an event listener to listen for any changes on the input
  input.addEventListener("input", debounce(onInput, 500));

  // Adding an event listener to the entire document (which may seem strange)
  // Listen to a click event
  // When a click event is activated, run the callback function
  document.addEventListener("click", (event) => {
    // event.target will return the HTML element that was clicked
    // If event.target is not contained in the root variable referencing the element of autocomplete
    // That means a user clicked outside of the autocomplete menu <div>
    if (!root.contains(event.target)) {
      // Remove the is-active class to make the dropdown disappear
      dropdown.classList.remove("is-active");
    }
  });
};
