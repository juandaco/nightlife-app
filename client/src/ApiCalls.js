/*
  Internal or External API Calls
*/

function getPlacesData(location) {
  return fetch(`/api/places/data?location=${location}`, {
    accept: 'application/json',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function getUserData() {
  return fetch('/api/users/data', {
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function verifyUser() {
  return fetch(`/api/users/current`, {
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON);
}

function userLogout() {
  return fetch(`/api/users/logout`, {
    accept: 'application/json',
    credentials: 'include',
  })
    .then(checkStatus)
    .then(parseJSON);
}

/*
  Generic functions
*/
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

const ApiCalls = {
  getPlacesData,
  getUserData,
  verifyUser,
  userLogout,
};

export default ApiCalls;
