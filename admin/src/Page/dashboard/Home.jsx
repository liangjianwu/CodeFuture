const { useEffect } = require("react")
const { useNavigate } = require("react-router")

const Dashboard = ()=>{
    const navigate = useNavigate()
    const firsturl = localStorage.getItem("firsturl")
    useEffect(()=>{
        firsturl && navigate(firsturl)
    },[firsturl])    
    return <></>
}

export default Dashboard