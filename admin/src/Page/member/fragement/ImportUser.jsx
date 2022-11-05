import { useState } from "react"
import apis from "../../../api"
import {  getUserSession } from "../../../Utils/Common"
import { Container, CssBaseline, Button,Grid, Box, Typography, Alert, Backdrop, CircularProgress } from '@mui/material';
import { Add} from "@mui/icons-material";
import Uploady, {  useItemFinishListener, useItemErrorListener, useItemStartListener } from "@rpldy/uploady";
import { asUploadButton } from "@rpldy/upload-button";
import MyTable from "../../../Component/MyTable";


const ImportUser = (props) => {
    const [hint, setHint] = useState()
    const [error, setError] = useState()
    const [results, setResults] = useState()
    const [loading, setLoading] = useState(false)

    const LogProgress = () => {
        useItemFinishListener((res) => {
            //console.log(res.uploadResponse.data.data)        
            let { total, succeed, customers } = res.uploadResponse.data.data
            setHint('Total ' + total + ', succeed ' + succeed)
            setResults(customers)
            setLoading(false)

        })
        useItemErrorListener((res) => {
            setLoading(false)
            setError(res.uploadResponse.data.data.error)
        })
        useItemStartListener((obj) => {
            setError()
            setHint()
            setLoading(true)
        })
        return null;
    }
    const DivUploadButton = asUploadButton((props) => {
        return <div {...props} style={{ width: 100, height: 100, padding: 5, cursor: "pointer", border: '1px dashed grey' }}>
            <Add fontSize="large" /> <Typography variant="subtitle2">SELETE A EXCEL FILE</Typography>
        </div>
    });
    return (

        <Container component="main" maxWidth="sm">
            {loading && <Backdrop open={loading} ><CircularProgress /></Backdrop>}
            <CssBaseline />
            <Box sx={{ marginTop: 12, width: '350px !important', display: 'flex', flexDirection: 'column', alignItems: 'left', }}>
                <Typography component="h1" variant="h5">Import familys & kids from file</Typography>
                <Typography variant="body1" sx={{ color: 'red', mt: 2 }}>Important note!!</Typography>
                <Box fullwidth sx={{ mt: 2, }}>
                    The file should be an excel file<br></br>
                    The fisrt row of the sheet should be a header <br></br>                    
                    <a href="/template.xlsx" target="_blank">Download template</a>                 
                </Box>
                <Grid container mt={2} spacing={2}>
                    {error && <Alert sx={{ mt: 1, mb: 1 }} severity={"error"}>{error}</Alert>}
                    <Grid item xs={4}>
                        <Uploady
                            destination={apis.uploadCustomers(getUserSession())}>
                            <LogProgress />
                            <DivUploadButton />
                        </Uploady>
                    </Grid>
                    <Grid item xs={8}>
                        {hint && <Alert sx={{ mt: 1, mb: 1 }} severity={"info"}>{hint}</Alert>}
                    </Grid>
                    <Grid item xs={12}>
                        {results && results.length > 0 && <MyTable
                            rows={results}
                            height={280}
                            totalRow={results.length}
                            showPageination={false}
                            headers={[{ name: 'sheet', showName: 'Sheet' }, { name: 'rowIndex', showName: 'Row' }, { name: 'result', showName: 'Result' }, { name: 'note', showName: 'Note' }]}
                        ></MyTable>}
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="button" fullWidth variant="contained" sx={{ mt: 1, mb: 2 }} onClick={() => { props.onClose && props.onClose() }}> Close </Button>
                    </Grid>
                </Grid>
            </Box>

        </Container>
    )
}
export default ImportUser