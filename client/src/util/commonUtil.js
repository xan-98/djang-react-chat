import ApiConnector from "../api/apiConnector";

var user = {};
const getUserServer = async () => {
  const data = await ApiConnector.sendGetRequest("user/");
  user = data.data;
  if (user.id) {
    return user;
  }
  return false;
};

const getUser = () => {
  return user;
};

const setToken = (userToken) => {
  localStorage.setItem("token", JSON.stringify(userToken));
};
const getToken = () => {
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken?.token;
};
const CommonUtil = {
  getUserServer: getUserServer,
  getUser: getUser,
  setToken: setToken,
  getToken: getToken,
};

export default CommonUtil;
