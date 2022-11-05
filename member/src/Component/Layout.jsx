
import { Container, Box, Typography, } from "@mui/material"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { getUserSession } from "../Utils/Common"
import TopBar from "./TopBar"


const Layout = () => {
    const navigate = useNavigate()

    const session = getUserSession()
    if (session && session.email_verified == 0 && window.location.pathname.substring(0, 5) != '/user') {
        window.location.href = '/user/emailverify'
        return <></>
    }

    return <Container component="main" sx={{ padding: 0 }}>
        <TopBar sx={{ background: '#059' }} />
        <Outlet />
        <Box sx={{ padding: 2, paddingBottom: 4, paddingTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#fff" }}>
            <Typography variant="body2" color="text.secondary" align="center">
                {"CodeFuture"}
                <br></br>
                {'Copyright © '}
                {' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        </Box>
    </Container>

}

export default Layout