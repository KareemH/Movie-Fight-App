const fetchData = async (searchTerm) => {
  console.log(searchTerm);
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "354da5f",
      s: searchTerm,
      //   i: "tt0479952",
    },
  });

  if (response.data.Error) {
    return [];
  }
  // console.log(response.data.search);
  return response.data.Search;
};

// Create the HTML on the JS side and then add it to the HTML view
// This creates a less tightly coupled relationship between the HTML and JS
const root = document.querySelector(".autocomplete"); // Find the element with class autocomplete
// Root is a reference to the element with autocomplete, set that element's HTML with the below
root.innerHTML = `
      <label><b>Search For a Movie</b></label>
      <input class="input" />
      <div class="dropdown">
          <div class="dropdown-menu">
              <div class="dropdown-content results"></div>
          </div>
      </div>
  `;

// fetchData();

// Retrieve the <input> element tag of the HTML
const input = document.querySelector("input");

// Retrieve the elements with classes dropdown and results
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

const onInput = async (event) => {
  // After the debounce function calls fetchData and fetchData then returns movies to debounce which then returns movies to onInput
  const movies = await fetchData(event.target.value);

  // If there are no movies (no search results)
  if (!movies.length) {
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
  for (let movie of movies) {
    // Create a new anchor tag
    const option = document.createElement("a");
    // Error handling code to see if a poster is provided or not
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    // To that new anchor tag, add a class of dropdoown-item from Bulma
    option.classList.add("dropdown-item");
    // Set the inner HTML of that anchor tag to be:
    option.innerHTML = `
          <img src="${imgSrc}" />
          ${movie.Title}
        `;
    // Bulma handles that the img and text are inline

    // Add a click event listener to each option of the dropdown meny
    option.addEventListener("click", () => {
      // When a user clicks
      dropdown.classList.remove("is-active"); // The dropdown is not active
      input.value = movie.Title; // The input is replaced with the text of the movie the user clicked
      onMovieSelect(movie); // Now get the specific detail of a clicked movie using this helper function
    });

    // resultsWrapper is a reference to the div (with class results) that encapsulates all search results
    // For each option (<a> tag), append it as a child to the resultsWrapper element
    resultsWrapper.appendChild(option);
  }
  // console.log(movies);
};

// // onInput function will trigger a fetchData call when a user finishes typing their input query
// const onInput = (event) => {
//   // If the timeoutId is truthy (timeoutId exists in memory with a value)
//   // That means setTimeout was triggered to fetchData() since tmeoutId was returned a value
//   if (timeoutId) {
//     // Clear the timeout using timeoutId
//     // Clears the timer associated with the id
//     clearTimeout(timeoutId);
//   }

//   // In a half second, call fetchData()
//   // This implies that the user has already typed a majority of their query in a half second
//   // Debounce an input
//   /* Waiting for some time to pass after the last event to actually do something */
//   timeoutId = setTimeout(() => {
//     fetchData(event.target.value);
//   }, 500);
// };

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

// The breif summary of a movie is passed as an object to the function
const onMovieSelect = async (movie) => {
  // Make an asynchronous API call to retrieve specific data about the clicked movie using the movie ID
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "354da5f",
      i: movie.imdbID,
    },
  });

  console.log(response.data);
};

// Decouple the HTML and JS
// So, render the HTML instead of placing the HTML in the index.html file
const movieTemplate = (movieDetail) => {
  return `
      <article class="media">
          <figure class="media-left">
              <p class="image">
                  <img src="${movieDetail.Poster}" />
              </p>
          </figure>
  
          <div class="media-content">
              <div class="content">
                  <h1>${movieDetail.Title}</h1>
                  <h4>${movieDetail.Genre}</h4>
                  <p>${movieDetail.Plot}</p>
              </div>
          </div>
      </article>
  
      <article class="notification is-primary">
          <p class="title">${movieDetail.Awards}</p>
          <p class="subtitle">Awards</p>
      </article>
  
      <article class="notification is-primary">
          <p class="title">${movieDetail.BoxOffice}</p>
          <p class="subtitle">Box Office</p>
      </article>
  
      <article class="notification is-primary">
          <p class="title">${movieDetail.Metascore}</p>
          <p class="subtitle">Metascore</p>
      </article>
  
      <article class="notification is-primary">
          <p class="title">${movieDetail.imdbRating}</p>
          <p class="subtitle">IMDB Rating</p>
      </article>
  
      <article class="notification is-primary">
          <p class="title">${movieDetail.imdbVotes}</p>
          <p class="subtitle">IMDB Votes</p>
      </article>
      `;
};
