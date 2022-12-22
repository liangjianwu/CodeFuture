import { EmailOutlined, LocationOnOutlined, PhoneAndroidOutlined, WhatsApp } from "@mui/icons-material"
import { Container, Box, Button, Toolbar, Typography, Stack, Grid, } from "@mui/material"
import React, { useRef, useLayoutEffect, useState } from "react";
import { BLANK_BLOCK_COLOR, LOGO_ICON_COLOR, LOGO_TEXT_COLOR } from "../../app/config";


const SquareGrid = (props) => {
    const targetRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (targetRef.current) {
            setDimensions({
                width: targetRef.current.offsetWidth,
                height: targetRef.current.offsetWidth 
            });
        }
    }, []);

    return (
        <Grid item md={3} sm={12} lg={3} xs={12} sx={props.sx} justifyContent="center">
            <Box ref={targetRef} sx={{ display:'flex',flexDirection:'column',justifyContent: 'center',alignItem:'center',width: '100%',height:{xs:'100%',md:dimensions.height}}}>
                {props.children}
            </Box>

        </Grid>
    );
}
const Home = () => {
    return <Container component="main" maxWidth='hg' sx={{ padding: { xs: '0' } }}>
        <Box sx={{p:2,pt:3,pb:3,display:'flex',flexDirection:'row'}}>
            <img height="50px" src="logo.png" />
            <Typography sx={{flex:'1 1 100%'}}></Typography>
            <Box sx={{display:{sm:'none',xs:'none',md:'block'}}}><img height="50px" src="slogan.png" /></Box>
        </Box>
        <Grid container>        
            <SquareGrid sx={{ bgcolor: LOGO_TEXT_COLOR, p: { sm: 2, xs: 0, md: 0 ,lg:2},display:{xs:'none',md:'block'} }}>
                <img src="/biglogo2.png" width="100%"></img>
            </SquareGrid>            
        </Grid>

        <Box sx={{ padding: 2, paddingBottom: 4, paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#fff" }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {"CodeFuture - Code your future"}
                <br></br>
                {'Copyright © '}
                {' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    </Container>
}

export default Home