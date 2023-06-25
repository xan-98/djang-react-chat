import { useEffect, useState } from "react";
import Auth from "./Auth";
import Router from "./Router";
import Loading from "./components/Loading";
import CommonUtil from "./util/commonUtil";

const App = () => {
  const token = CommonUtil.getToken();
  const [user, setUser] = useState({});

  const getUser = async () => {
    if (user != {} && token) {
      const data = await CommonUtil.getUserServer();
      setUser(data);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (!token) {
    return <Auth />;
  }

  return <>{user.id ? <Router /> : <Loading />}</>;
};

export default App;
