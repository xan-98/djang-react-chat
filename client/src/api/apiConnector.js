import ApiUtils from "./apiUtils";
import HttpMethods from "./httpMethods";
import ServerUrl from "./serverUrl";

const ApiEndpoints = "api/v1/";
const base_url = ServerUrl.BASE_URL + ApiEndpoints;

const sendGetRequest = (relativeUrl) => {
  const url = base_url + relativeUrl;
  const options = { headers: ApiUtils.getAuthHeader() };
  return fetch(url, options)
    .then(ApiUtils.jsonHandler)
    .then((data) => data)
    .catch((error) => console.log(error));
};

const sendPostRequest = (relativeUrl, requestBody, isLogin = true) => {
  const url = base_url + relativeUrl;
  requestBody = JSON.stringify(requestBody);
  let options = {
    method: HttpMethods.POST,
    body: requestBody,
  };

  options.headers = ApiUtils.getPostRequestHeader();
  if (isLogin) {
    options.headers = {
      ...options.headers,
      ...ApiUtils.getAuthHeader(),
    };
  }

  return fetch(url, options)
    .then(ApiUtils.jsonHandler)
    .then((data) => data)
    .catch((error) => console.log(error));
};

const ApiConnector = {
  sendGetRequest: sendGetRequest,
  sendPostRequest: sendPostRequest,
};

export default ApiConnector;
