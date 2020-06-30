// Debounce an input
//   /* Waiting for some time to pass after the last event to actually do something */
const debounce = (func, delay = 1000) => {
  let timeoutId;
  // ...args is literally each character typed into the input box
  return (...args) => {
    console.log(args);
    // If the timeoutId is truthy (timeoutId exists in memory with a value)
    // That means setTimeout was triggered to fetchData() since tmeoutId was returned a value
    if (timeoutId) {
      // Clear the timeout using timeoutId
      // Clears the timer associated with the id
      clearTimeout(timeoutId);
    }

    // In a half second (depending on the delay variable), call fetchData()
    // This implies that the user has already typed a majority of their query in a half second
    timeoutId = setTimeout(() => {
      // func() is really a placeholder name for fetchData()
      // .apply will just attach the input arguments to the function fetchData
      // After a certain amount of time delay. then call fetchData()
      func.apply(null, args);
    }, delay);
  };
};
