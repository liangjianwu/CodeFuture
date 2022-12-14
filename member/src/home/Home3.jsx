import { EmailOutlined, LocationOnOutlined, PhoneAndroidOutlined, WhatsApp } from "@mui/icons-material"
import { Container, Box, Button, Toolbar, Typography, Stack, Grid, } from "@mui/material"
import React, { useRef, useLayoutEffect, useState } from "react";
import { BLANK_BLOCK_COLOR, LOGO_ICON_COLOR, LOGO_TEXT_COLOR } from "../app/config";


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
        <Grid item md={4} sm={12} lg={4} xs={12} sx={{ ...props.sx }}>
            <Box ref={targetRef} sx={{ width: '100%',height:{xs:'100%',md:dimensions.height}}}>                
                    {props.children}
            </Box>

        </Grid>
    );
}
const MapGrid = (props) => {
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
        <Grid item md={4} sm={12} lg={4} xs={12} sx={{...props.sx,p:{lg:4,xs:2},bgcolor:LOGO_TEXT_COLOR}}>
            <div ref={targetRef} style={{ width: '100%', height: dimensions.height }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15389.38867116068!2d-79.39501712318965!3d43.74682438739788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b32a560c172b5%3A0xcd0948f5f8b381d6!2s173%20York%20Mills%20Rd%2C%20North%20York%2C%20ON%20M2L%201K6!5e0!3m2!1szh-CN!2sca!4v1662310798417!5m2!1szh-CN!2sca" width="100%" height={dimensions.height} style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </Grid>
    );
}
const Home = () => {
    return <Container component="main" maxWidth='hg' sx={{ padding: { xs: '0' } }}>
        <Box sx={{p:2,pt:3,pb:3}}>
            <img height="50px" src="logo.png" />
        </Box>
        <Grid container>
            <SquareGrid sx={{ bgcolor: LOGO_TEXT_COLOR, p: { sm: 2, xs: 0, md: 0 ,lg:2},display:{xs:'none',md:'block'} }}>
                <img src="/biglogo2.png" width="100%"></img>
            </SquareGrid>
            <SquareGrid sx={{ bgcolor: LOGO_TEXT_COLOR, color: '#fff', p: 4 }}>
                <Stack direction={"row"}>
                    <Typography component="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 24, lg: 32 } }} variant="h4">?????????</Typography>
                    <Typography component="h4" sx={{}} variant="h6">???????????????????????????</Typography>
                </Stack>
                <Stack direction={"row"} sx={{ mt: { sm: 4, xs: 2 } }}>
                    <Typography component="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 24, lg: 32 } }} variant="h4">?????????</Typography>
                    <Typography component="h4" sx={{}} variant="h6">???????????????????????????</Typography>
                </Stack>
                <Stack direction={"row"} sx={{ mt: { sm: 4, xs: 2 } }}>
                    <Typography component="h4" sx={{ fontWeight: 'bold', fontSize: { xs: 24, lg: 32 } }} variant="h4">?????????</Typography>
                    <Typography component="h4" sx={{}} variant="h6">???????????????????????????</Typography>
                </Stack>

            </SquareGrid>
            <SquareGrid sx={{ bgcolor: LOGO_TEXT_COLOR, color: '#fff', p: { md:1,sm: 0, xs: 0 } }}>
               <img width="100%" src='p4.png'></img>
            </SquareGrid>

            

            <SquareGrid sx={{ bgcolor: BLANK_BLOCK_COLOR }}>
                <img width="100%" src='logic1.png'></img>
            </SquareGrid>
            {/* <SquareGrid sx={{ bgcolor: BLANK_BLOCK_COLOR, display: { md: 'block', sm: 'block', xs: 'none', lg: 'none' } }}>
                <img src="/aha3.png" width="100%"></img>
            </SquareGrid> */}
            {/* <SquareGrid sx={{ bgcolor: BLANK_BLOCK_COLOR, display: { md: 'block', sm: 'none', xs: 'none', lg: 'none' } }}>
                <img src="/aha2.png" width="100%"></img>
            </SquareGrid> */}
            <SquareGrid sx={{ bgcolor: BLANK_BLOCK_COLOR, p: 2 }}>
                <img width="100%" src='p1.png'></img>
            </SquareGrid>
            <SquareGrid sx={{ bgcolor: BLANK_BLOCK_COLOR, p: 2 }}>
                <img width="100%" src='p2.png'></img>
            </SquareGrid>

            <SquareGrid sx={{ bgcolor: BLANK_BLOCK_COLOR, }}>
                <img width="100%" src='logiclesson.png'></img>
            </SquareGrid>

            <SquareGrid sx={{ p: 6, bgcolor: LOGO_TEXT_COLOR, color: '#fff' }}>
                <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'left' }}>
                    <Stack sx={{ margin: 0 }}>
                        <Typography variant="h4" sx={{ mt: {lg:8,xs:1 }, fontWeight: 'bold' }}>CONTACT US</Typography>
                        <Stack direction="row" sx={{ marginBottom: 1, mt: 3 }}>
                            <EmailOutlined sx={{ marginRight: 1 }} />
                            <Typography variant="body">admin@codefuture</Typography>
                        </Stack>
                        <Stack direction="row" sx={{ marginBottom: 1 }}>
                            <PhoneAndroidOutlined sx={{ marginRight: 1 }} />
                            <Typography variant="body">+1 (416)-725-9206</Typography>
                        </Stack>
                        <Stack direction="row" sx={{ marginBottom: 1 }}>
                            <LocationOnOutlined sx={{ marginRight: 1 }} />
                            <Typography variant="body">173 Yorkmills Rd., North York<br></br> Ontario, Canada M2L 1K6</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </SquareGrid>
            
            {/* <SquareGrid sx={{ bgcolor: BLANK_BLOCK_COLOR, display: { md: 'none', sm: 'block', xs: 'none' } }}>
                <img src="/aha2.png" width="100%"></img>
            </SquareGrid> */}
            <SquareGrid sx={{ bgcolor: LOGO_TEXT_COLOR, color: '#fff' }}>
                <Grid container sx={{ width: '100%',pt:{sm:6,xs:2} }} >
                    <Grid item xs={6} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', background: "#093D65" }}>
                            <Typography variant="body" sx={{ margin: 2 }}>???????????????</Typography>
                            <img src="/qrcode.jpg" style={{ width: '100%', }} />
                            <Typography sx={{ mt: 1 }} variant="body">codefuture666</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', background: "#093D65" }}>
                            <Typography variant="body" sx={{ margin: 2 }}>???????????????</Typography>
                            <img src="/admin.jpg" style={{ width: '100%', }} />
                            <Typography sx={{ mt: 1 }} variant="body">Leo Liang</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </SquareGrid>
            <MapGrid />
            <SquareGrid sx={{ bgcolor: { xs: BLANK_BLOCK_COLOR, lg: LOGO_TEXT_COLOR }, p: { xs: 0, lg: 2 } }}>
                <img src="/apply1.png" width="100%"></img>
            </SquareGrid>
        </Grid>



        <Box sx={{ padding: 2, paddingBottom: 4, paddingTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#fff" }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {"CodeFuture - Code your future"}
                <br></br>
                {'Copyright ?? '}
                {' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    </Container>
}

export default Home