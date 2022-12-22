
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';

export default function Terms() {
    return (<>
        <Container component="main" maxWidth="lg" sx={{ marginTop: 10 }}>
            <CssBaseline />
            <Box sx={{ marginTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <img src="/logo1.jpg" style={{ height: 150 }} />
                <Typography variant='h4' sx={{ fontWeight: 'bold',mt:2 }}>CodeFuture User Agreement (2022-2023)</Typography>
            </Box>
            <Box sx={{ display: 'flex',mt:6, flexDirection: 'column', alignItems: 'left', }}>
                
            </Box>
        </Container>
    </>
    );
}
