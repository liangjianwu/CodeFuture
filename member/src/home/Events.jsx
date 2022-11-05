import { Box, Card, CardMedia, Grid,Typography,CardContent,CardActions,Button, Alert } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import apis from "../api"
import { apiResult, getUserSession } from "../Utils/Common"

const Events = () => {
    const [events, setEvents] = useState()
    const [error, setError] = useState()
    const navigate = useNavigate()
    getUserSession(apis)
    useEffect(() => {
        apis.loadEvents().then(ret => {
            apiResult(ret, data => {
                setEvents(data)
            }, setError)
        })
    }, [])
    return <Box sx={{p:2,pt:{md:6,xs:4}}}>
        <Typography component="h6" variant="h6" sx={{ fontWeight: '',mb:2,display:{md:'none',xs:'block'}}}>Hot events</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2} >
            {events && events.map((event, index) => {
                return <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ width: "100%" }} >
                        <CardMedia
                            component="img"
                            height="200"
                            image={event.photo?('/memberapi/event/photo?file='+event.photo):"/header.png"}
                            alt={event.name}
                        />
                        <CardContent sx={{height:200}}>
                            <Typography gutterBottom variant="subtitle1" component="div" sx={{fontWeight:''}}>{event.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{height:'120px',overflow:'hidden',mb:1}}>{event.description}</Typography>
                            {event.apply == 1 && event.begin && event.end && <Typography variant="body2" color="text.secondary" >Registration date: <span style={{fontWeight:'bold'}}>{new Date(event.end).getTime() < Date.now() ?"Expired":(event.begin+" ~ "+event.end)}</span></Typography>}                            
                            {event.apply == 1 && event.pay == 1 && event.fee > 0 && <Typography variant="body2" color="text.secondary" >Registration fee: <span style={{fontWeight:'bold'}}>CAD ${event.fee}</span></Typography>}
                        </CardContent>
                        <CardActions>                            
                            <Button size="small" onClick={()=>{navigate('/event/'+event.code)}}>Detail</Button>
                        </CardActions>
                    </Card>
                </Grid>
            })}
        </Grid>
    </Box>
}

export default Events