import { Box,  Typography, Stack, Grid, } from "@mui/material"
const CoachList = ()=>{
    const coaches = [
        { name: 'Laurent Couderc', title: 'Head Coach', head1: '/t1-1.png', head2: '/t1.png',link:'laurent' },
        { name: 'Oleh Shturbabin', title: 'Associate Head Coach', head1: '/t2-1.png', head2: '/t2.png',link:'oleh' },
        { name: 'Sean Chi', title: 'Senior Coach', head1: '/t3-1.png', head2: '/t3.png',link:'sean' },
        { name: 'Arthur Zatko', title: 'National Team Coach', head1: '/t4-1.png', head2: '/t4.png',link:'arthur' },
        { name: 'Empereur Elliott', title: 'Physical Instuctor', head1: '/t5.png', head2: '/t5-2.png',link:'elliott' },
    ]
    return <>
        <Stack direction={"row"} sx={{ marginTop: 3, display: { xs: 'none', md: 'flex' } }}>
                {coaches.map((coach, index) => {
                    return <Stack onClick={()=>window.open('/coach/'+coach.link,'_blank')} key={index} direction={"column"} sx={{ marginLeft: 4, marginRight: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',cursor:'pointer' }}>
                        <img src={coach.head1} style={{ width: "150px" }}></img>
                        <img src={coach.head2} style={{ width: "150px" }}></img>
                        <Typography sx={{ color: '#fff', fontWeight: 'bold', marginTop: 2,textDecoration:'underline' }}>{coach.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#fff',textDecoration:'underline' }}>{coach.title}</Typography>
                    </Stack>
                })}
            </Stack>
            <Grid container sx={{ marginTop: 2, display: { xs: 'flex', md: 'none' } }}>
                <Grid item xs={12}>
                    <Stack direction={"column"} onClick={()=>window.open('/coach/'+coaches[0].link,'_blank')} sx={{ marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',cursor:'pointer' }}>
                        <img src={coaches[0].head1} style={{ width: "150px" }}></img>
                        <img src={coaches[0].head2} style={{ width: "150px" }}></img>
                        <Typography sx={{ color: '#fff', fontWeight: 'bold', marginTop: 2,textDecoration:'underline' }}>{coaches[0].name}</Typography>
                        <Typography variant="body2" sx={{ color: '#fff',textDecoration:'underline' }}>{coaches[0].title}</Typography>
                    </Stack>
                </Grid>
                {coaches.map((coach, index) => {
                    return index > 0 && <Grid key={index} item xs={6}>
                        <Stack direction={"column"} onClick={()=>window.open('/coach/'+coach.link,'_blank')} sx={{ marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center',cursor:'pointer' }}>
                            <img src={coach.head1} style={{ width: "100px" }}></img>
                            <img src={coach.head2} style={{ width: "100px" }}></img>
                            <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginTop: 2 ,textDecoration:'underline'}}>{coach.name}</Typography>
                            <Typography variant="body2" sx={{ color: '#fff', fontSize: '14px',textDecoration:'underline' }}>{coach.title}</Typography>
                        </Stack>
                    </Grid>
                })}
            </Grid>
    </>
}
export default CoachList