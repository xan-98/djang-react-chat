const jsonHandler = (response) => {
  return response.json();
};

const getPostRequestHeader = () => {
  return {
    Accept: "application/json, text/plain",
    "Content-Type": "application/json; charset=UTF-8",
  };
};

const getAuthHeader = () => {
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return {
    Authorization: "Bearer " + userToken?.token,
  };
};

const ApiUtils = {
  jsonHandler: jsonHandler,
  getPostRequestHeader: getPostRequestHeader,
  getAuthHeader: getAuthHeader,
};

export default ApiUtils;
