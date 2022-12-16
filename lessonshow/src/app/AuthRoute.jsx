import {Navigate} from 'react-router'
import MemberIndex from '../member/Index'
import EmailVerify from '../user/EmailVerify'
import SignIn from '../user/SignIn'
import { getUserSession, sessionGet, sessionSet } from '../Utils/Common'
const AuthRoute = (props) => {
    const {path,Component} = props
    let session = getUserSession()
    let obj = session?(session.email_verified === 1||path==='emailverify'?<Component />:<Navigate to="/service/emailverify"/>):<Navigate to="/user/signin"/>
    return obj
}
const LoginRoute =(props) => {
    let session = getUserSession()
    let url = sessionGet('loginCallback')    
    return session?(session.email_verified != 1 ? <EmailVerify /> :(url?<Navigate to={url}/>:<MemberIndex />)):<SignIn />
}
export { AuthRoute,LoginRoute }