
import { Box, Typography, Stack, Grid, } from "@mui/material"
import CoachList from "./fragement/CoachList"
import Contact from "./fragement/Contact"

const Home = () => {
    return <>
        <Box sx={{ background: 'url("/header.png")', backgroundSize: { xs: '500px 400px', sm: '900px 700px', md: 'auto' }, height: { md: '850px', sm: '700px', xs: '400px' } }}>
            <Box sx={{ padding: { md: 5, xs: 3 }, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#059c" }}>
                <Typography component="h4" sx={{ color: '#fff', fontSize: { md: '40px', md: '30px', xs: '22px' }, fontWeight: 'bold', }} variant="h4">LARGEST SABRE ONLY FENCING CLUB IN CANADA</Typography>
                <Typography component="h5" sx={{ color: '#fff', fontSize: { md: '28px', md: '24px', xs: '18px' }, fontWeight: '400', marginTop: 2 }} variant="h5">State of the Art Fencing Facilities and Equipment. Learn from World Level Coaches</Typography>
            </Box>
        </Box>
        <Box sx={{ padding: 2, paddingBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#059", overflow: "auto" }}>
            <Typography component="h4" variant="h4" sx={{ color: '#fff', fontWeight: 'bold', margin: 4 }}>COACHES</Typography>
            <CoachList />
        </Box>
        <Contact />

    </>
}

export default Home