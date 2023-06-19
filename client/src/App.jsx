import Auth from './Auth';
import CommonUtil from "./util/commonUtil";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Router from './Router';

const App = () => {
    const token = CommonUtil.getToken();
    const [user, setUser] = useState({});
    
    const getUser = async () => {
        if (user != {} && token) {
            const data = await CommonUtil.getUserServer()
            setUser(data)
        }
    }

    useEffect(() => {
        getUser()
    }, []);

    if (!token) {
        return <Auth />
    }

    return (
        <>
            {
                user.id ?
                    <Router />
                    :
                    <Loading />
            }
        </>
    )
}

export default App

