import { EmailOutlined,  LocationOnOutlined, PhoneAndroidOutlined, WhatsApp } from "@mui/icons-material"
import { Box,  Typography, Stack, Grid, } from "@mui/material"
const Contact = ()=>{
    return  <Box sx={{ padding: 2, paddingBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', background: "#059" }}>
            <Typography variant="h4" sx={{ color: '#fff', marginBottom: 1, fontWeight: 'bold', display: { xs: 'flex', md: 'none' } }}>CONTACT US</Typography>
            <Grid container sx={{ marginTop: 0 }} spacing={4}>
                <Grid item xs={12} sm={6}>
                    <Stack sx={{ paddingLeft: { md: 2, xs: 0 } }}>
                        <a target="_blank" href="https://www.google.ca/maps/place/7550+Birchmount+Rd+%23202,+Markham,+ON+L3R+6C6/@43.8375815,-79.3481326,12.92z/data=!4m5!3m4!1s0x89d4d46ed00c2cdb:0x1971acbb4362ef2a!8m2!3d43.8370447!4d-79.3205896">
                            <img src="/map.png" style={{ width: "100%" }} />
                        </a>
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack sx={{ margin: 0 }}>
                        <Typography variant="h4" sx={{ color: '#fff', marginBottom: 1, fontWeight: 'bold', display: { xs: 'none', md: 'flex' } }}>CONTACT US</Typography>
                        <Stack direction="row" sx={{ marginBottom: 1, color: '#fff' }}>
                            <EmailOutlined sx={{ marginRight: 1 }} />
                            <Typography variant="body"><a href="mailto:axisfencingclubca@gmail.com" style={{ color: "#fff" }}>axisfencingclubca@gmail.com</a></Typography>
                        </Stack>
                        <Stack direction="row" sx={{ marginBottom: 1, color: "#fff" }}>
                            <PhoneAndroidOutlined sx={{ marginRight: 1 }} />
                            <Typography variant="body"><a href="tel:+16479293223" style={{ color: "#fff" }}>+1 (647)-929-3223</a></Typography>
                        </Stack>
                        <Stack direction="row" sx={{ marginBottom: 1, color: "#fff" }}>
                            <LocationOnOutlined sx={{ marginRight: 1 }} />
                            <Typography variant="body"><a target="_blank" style={{ color: "#fff" }} href="https://www.google.ca/maps/place/7550+Birchmount+Rd+%23202,+Markham,+ON+L3R+6C6/@43.8375815,-79.3481326,12.92z/data=!4m5!3m4!1s0x89d4d46ed00c2cdb:0x1971acbb4362ef2a!8m2!3d43.8370447!4d-79.3205896">#202, 7550 Birchmount Rd., Markham<br></br> Ontario, Canada L3R 6C6</a></Typography>
                        </Stack>
                        <Stack direction="row" sx={{ marginBottom: 1, color: "#fff" }}>
                            <WhatsApp sx={{ marginRight: 1 }} />
                            <Typography variant="body">Whatsapp: 16479293223</Typography>
                        </Stack>
                        <Stack direction="row" sx={{ marginBottom: 1, color: "#fff",cursor:'pointer' }} onClick={()=>{
                            window.open("https://www.xiaohongshu.com/user/profile/60b7ca5e00000000010048bb?xhsshare=WeixinSession&appuid=5c9ee7c70000000012023dfb&apptime=1659137440","_blank")
                        }}>
                            <img src="https://picasso-static.xiaohongshu.com/fe-platform/63c94335af259090224a696424f69b08bc1f1f37.png" style={{width:"60px"}} />                        
                            <Typography variant="body" sx={{m:"5px",textDecoration:'underline'}}>Axis Fencing Club</Typography>
                        </Stack>
                    </Stack>
                    <Stack direction="row" sx={{ marginTop: 2 }}>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            <img src="/qrcode.png" style={{ width: '140px',height:'145px' }} />
                        </Box>
                        <Box sx={{ display: { xs: 'flex', sm: 'none' }, width: '100%', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
                            <Typography variant="body" sx={{ margin: 2 }}>Wechat</Typography>
                            <img src="/qrcode.png" style={{ width: "80%" }} />
                            <Typography variant="body" sx={{ margin: 1 }}>Axis Fencing Club</Typography>
                            <Typography variant="body">16479293223</Typography>
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, width: 200, padding: { xs: 0, md: 3 }, flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
                            <Typography variant="h6" sx={{ margin: 1 }}>Wechat</Typography>
                            <Typography variant="body" sx={{ margin: 1 }}>Axis Fencing Club</Typography>
                            <Typography variant="body">16479293223</Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
}

export default Contact