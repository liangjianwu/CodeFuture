import { Container } from "@mui/material"
import { useParams } from "react-router"

const Coach =(props)=>{
    const params = useParams()
    return <Container component="main" maxWidth="lg">
        <img style={{width:"100%"}} src={'/' + params.name + '.jpg'}/>
    </Container>
}
export default Coach