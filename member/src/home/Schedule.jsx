import { Box, Card, CardHeader, Avatar,Paper,Typography,CardContent,CardActions,Button, Alert, Grid } from "@mui/material"
const Schedule = () => {
    const items = [
        { label: 'M',title:'Monday', lessons: [{ name: 'Intermediate Class 2', time: '17:00~18:30' }, { name: 'Intermediate Class 1', time: '18:30~20:00' }] },
        { label: 'T',title:'Tuesday', lessons: [{ name: 'Beginner Class', time: '17:00~18:30' }, { name: 'Competitive Class', time: '18:30~21:00' }] },
        { label: 'W',title:'Wednesday', lessons: [{ name: 'Intermediate Class 2', time: '17:00~18:30' }, { name: 'Intermediate Class 1', time: '18:30~20:00' }] },
        { label: 'T',title:'Thursday', lessons: [{ name: 'Beginner Class', time: '17:00~18:30' }, { name: 'Competitive Class', time: '18:30~21:00' }] },
        { label: 'F',title:'Friday', lessons: [{ name: 'Intermediate Class 1&2', time: '17:00~19:00' }, { name: 'Competitive Class', time: '19:00~21:00' }] },
        { label: 'S',title:'Saturday', lessons: [{ name: 'Baby Fencing', time: '11:00~12:00' }, { name: 'Beginner Class', time: '12:30~14:00' }, { name: 'Combat Class', time: '14:00~15:30' }, { name: 'Competitive Class', time: '15:30~17:30' }] },
        { label: 'S',title:'Sunday', lessons: [{ name: 'Competitive Class', time: '10:30~13:00' }] },
    ]
    return <Box sx={{p:2,pt:{md:4}}}>
        <Typography component="h6" variant="h6" sx={{ fontWeight: 'bold',mb:2,display:{md:'none',xs:'flex',alignContent:'center'}}}>Group class schedule</Typography>
        <Grid container spacing={2}>
        { items.map((item,index)=>{
            return <Grid item xs={12} sm={4} md={3} >                
            <Card key={index}>
            <CardHeader sx={{bgcolor:'#059c',color:'#fff'}} avatar={<Avatar sx={{ bgcolor: '#fff',color:'#ff5722' }} aria-label="recipe">{item.label}</Avatar>}                
                title={item.title}                
            />
            <CardContent sx={{minHeight:200}}>
                {item.lessons.map((lesson,index1)=>(
                    <Box key={index1} sx={{p:1,mt:1}}>
                    <Typography variant="body2" color="text.secondary" sx={{fontWeight:'bold',mb:1}}>{lesson.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{lesson.time}</Typography>
                </Box>
                ))}
            </CardContent>
        </Card></Grid>
        }) }
        </Grid>
        
    </Box>
}

export default Schedule