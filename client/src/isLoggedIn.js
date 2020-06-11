function isLoggedIn() {
  return fetch('/isLoggedIn')
    .then((response) => {
      return response.json();
    })
}

export default isLoggedIn;
