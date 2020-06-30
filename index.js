// Auto complete configuration object to pass into createAutoComplete
// Since these properties are needed many times, we encapsulate the properties/methods in one resuable object
const autoCompleteConfig = {
  renderOption(movie) {
    // Error handling code to see if a poster is provided or not
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
          <img src="${imgSrc}" />
          ${movie.Title}
        `;
  },
  // Will return the movie title to appear in the input box for reformatting purposes
  inputValue(movie) {
    return movie.Title;
  },
  // Axios call to an API
  async fetchData(searchTerm) {
    // console.log(searchTerm);
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "354da5f",
        s: searchTerm,
      },
    });

    if (response.data.Error) {
      return [];
    }
    // console.log(response.data.search);
    return response.data.Search;
  },
};

// -------------------------------------------------------------------------
// This section of code helps to provide dropdown menu functionality
// Pass a configuration object to be templated into this function
createAutoComplete({
  // Use spread operator to make a copy of the autoCompleteConfig object
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

// Pass a configuration object to be templated into this function
createAutoComplete({
  // Use spread operator to make a copy of the autoCompleteConfig object
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});
// -------------------------------------------------------------------------

let leftMovie;
let rightMovie;
// This function differs from fetchData in that we are making a more specific API call for a particular movie that was clicked on
// The brief summary of a movie is passed as an object to the function
const onMovieSelect = async (movie, summaryElement, side) => {
  // Make an asynchronous API call to retrieve specific data about the clicked movie using the movie ID
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "354da5f",
      i: movie.imdbID,
    },
  });

  //   console.log(response.data);
  // movieTemplate will format the data returned by the API call in a side by side comparison format
  summaryElement.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else if (side === "right") {
    rightMovie = response.data;
  }

  // If both the leftMovie and rightMovie contain data
  if (leftMovie && rightMovie) {
    // Run a comparison on the stats of both movies
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseFloat(leftStat.dataset.value);
    const rightSideValue = parseFloat(rightStat.dataset.value);

    if (isNaN(rightSideValue) || isNaN(leftSideValue)) {
      rightStat.classList.remove("is-primary");
      leftStat.classList.remove("is-primary");
    } else if (rightSideValue > leftSideValue) {
      // Make right side green
      rightStat.classList.remove("is-warning");
      rightStat.classList.add("is-primary");
      // Make left side yellow
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else if (rightSideValue < leftSideValue) {
      // Make left side green
      leftStat.classList.remove("is-warning");
      leftStat.classList.add("is-primary");
      // Make right side yellow
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    } else if (rightSideValue === leftSideValue) {
      // Both sides are green
      rightStat.classList.add("is-primary");
      leftStat.classList.add("is-primary");

      // Both sides are not yellow
      rightStat.classList.remove("is-warning");
      leftStat.classList.remove("is-warning");
    }
  });
};

// Decouple the HTML and JS
// So, render the HTML instead of placing the HTML in the index.html file
const movieTemplate = (movieDetail) => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const awards = movieDetail.Awards.split(" ").reduce(
    (number, possibleNumberOrWord) => {
      const value = parseInt(possibleNumberOrWord);
      if (isNaN(value)) {
        return number;
      } else {
        return number + value;
      }
    },
    0
  );

  console.log(awards);

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

    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>

    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};
