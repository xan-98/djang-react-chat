import { useState } from "react";
import ApiConnector from "./api/apiConnector";
import CommonUtil from "./util/commonUtil";

async function loginUser(credentials) {
  const data = await ApiConnector.sendPostRequest(
    "user/auth/",
    credentials,
    false
  );
  return data;
}

const Auth = () => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [authError, setAuthError] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser({
      username,
      password,
    });
    if (data?.token) {
      CommonUtil.setToken(data);
      window.location.href = "/";
    } else {
      setAuthError(true);
    }
  };

  return (
    <div className="auth">
      <div className="page">
        <div className="center-form">
          <div className="center-form__header">Авторизация</div>
          {authError && (
            <div className="center-form__error">
              Ошибка аутентификации неверное имя пользователя или пароль!
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="center-form__group">
              <div className="center-form__input-group">
                <input
                  type="text"
                  name="login"
                  placeholder="Логин"
                  required
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="center-form__input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button className="btn center-form__btn-submit" type="submit">
              Войти
            </button>
          </form>
        </div>
        <div className="bg-image"></div>
      </div>
    </div>
  );
};

export default Auth;
