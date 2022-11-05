import {Navigate} from 'react-router'
import SignIn from '../Page/account/SignIn'
import { getUserSession } from '../Utils/Common'
const AuthRoute = (props) => {
    const {path,Component} = props
    let session = getUserSession()
    let obj = session?(session.email_verified === 1||path==='emailverify'?<Component />:<Navigate to="/service/emailverify"/>):<Navigate to="/account/signin"/>
    return obj
}
const LoginRoute =(props) => {
    let session = getUserSession()
    return session?<Navigate to="/service/dashboard"/>:<SignIn />
}
export { AuthRoute,LoginRoute }