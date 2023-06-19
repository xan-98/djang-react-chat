import './assets/style/auth.scss'
import { useState } from 'react';
import ApiConnector from "./api/apiConnector";
import CommonUtil from "./util/commonUtil";

async function loginUser(credentials) {
	const data = await ApiConnector.sendPostRequest('user/auth/',credentials, false)
	return data
}


const Auth = () => {

	const [username, setUserName] = useState();
	const [password, setPassword] = useState();
	
	const handleSubmit = async e => {
		e.preventDefault();
		const data = await loginUser({
			username,
			password
		});
		if(data?.token){
			CommonUtil.setToken(data);
			window.location.href = '/';
		}
	}


	return (
		<div className='auth'>
			<div className="page">
				<div className='form-wrapper'>
					<div className="header">
						Авторизация
					</div>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<div className="input-group">
								<input type="text" name='login' placeholder='Логин' required onChange={e => setUserName(e.target.value)} />
							</div>
							<div className="input-group">
								<input type="password" name='password' placeholder='Пароль' required onChange={e => setPassword(e.target.value)} />
							</div>
						</div>
						<button className='btn btn-submit' type="submit">Войти</button>
					</form>
				</div>
				<div className="bg-image"></div>
			</div>
		</div>
	)
}


export default Auth
