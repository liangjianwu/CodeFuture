import { LOGO_ICON_COLOR, LOGO_TEXT_COLOR } from "../../../App/config";
import { SingleSelector } from "../../../Component/MuiEx";
import Uploader from "../../../Component/Uploader";
import CodeEditor from "./CodeEditor";
import { Grid, Box, TextField, Alert } from "@mui/material"
import { useState } from "react";

const PageEditor = (props) => {
    const types = ['Title', 'text', 'code', 'picture']
    const values = ['h', 'text', 'code', 'picture']
    const subtypes = ['Title', 'text', 'code', 'picture']
    const subvalues = ['h', 'text', 'code', 'picture']
    const {content,index,subindex,onChange} = props
    const [error, setError] = useState()

    return <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
            <SingleSelector
                items={subindex < 0 ? types : subtypes} values={subindex < 0 ? values : subvalues}
                defaultValue={content.type ? content.type : ''}
                name="type"
                onChange={(name,value)=>onChange(index,subindex,name,value)}
            />
        </Grid>
        <Grid item xs={12} sm={12}>
            {content.type && ['picture','content', 'code'].indexOf(content.type) < 0 && <TextField multiline={content.type==='text'} rows={content.type==='text'?6:1} name="content" onChange={(e) => { onChange(index,subindex,'content', e.target.value) }} fullWidth id="content" label="Content" value={content.content} />}            
            {content.type === 'picture' && <Box>
                <TextField margin="normal" type="text" onChange={(e) => onChange(index,subindex,'content', e.target.value)} value={content.content} fullWidth label="Image url" />
                <Uploader onUpload={(filename) => {
                    onChange(index,subindex,'content', "http://" + window.location.host + "/api/resource/photo?file=" + filename)
                }} onFailed={setError} />                
            </Box>}
            {content.type === 'code' && <Box>
                <CodeEditor value={content.content} height={"300px"} onChange={(v) => { onChange(index,subindex,'content', v) }} />
            </Box>}
        </Grid>
        {content.type ==='picture' && <Grid item xs={12}>
            <TextField name="width" onChange={(e) => { onChange(index,subindex,'width', e.target.value) }} fullWidth id="width" label="Width" value={content.width} />            
        </Grid>}        
        {content.type === 'h' && <Grid item xs={12} sm={12}>
            {/* <TextField name="size" onChange={(e) => { onChange('size', e.target.value) }} fullWidth label="H(1~6)" defaultValue={content.size} /> */}
            <SingleSelector items={["H1", "H2", "H3", "H4", "H5", "H6"]} values={[1, 2, 3, 4, 5, 6]} name="size" onChange={(name,value)=>onChange(index,subindex,name,value)} />
        </Grid>}
        {content.type === 'text' && <Grid item xs={12} sm={12}>
            {/* <TextField name="size" onChange={(e) => { onChange('size', e.target.value) }} fullWidth label="Size (px)" defaultValue={content.size} /> */}
            <SingleSelector items={["48", "36", "24", "16", "12"]} values={['48px', '36px', '24px', '16px', '12px']} name="size" onChange={(name,value)=>onChange(index,subindex,name,value)} />
        </Grid>}
        {['h', 'text'].indexOf(content.type) >= 0 && <Grid item xs={12} sm={12}>
            {/* <TextField name="color" onChange={(e) => { onChange('color', e.target.value) }} fullWidth label="Color" defaultValue={content.color} /> */}
            <SingleSelector items={[
                <span style={{ color: LOGO_ICON_COLOR }}>Orange</span>,
                <span style={{ color: LOGO_TEXT_COLOR }}>Deep Blue</span>,
                <span style={{ color: 'red' }}>Red</span>,
                <span style={{ color: '#888' }}>Gray</span>,
            ]} values={[LOGO_ICON_COLOR, LOGO_TEXT_COLOR, "red", "#888"]} onChange={(name,value)=>onChange(index,subindex,name,value)} name="color" />
        </Grid>}
        {['h', 'text'].indexOf(content.type) >= 0 && <Grid item xs={12} sm={12}>
            <SingleSelector items={['Bold', 'Normal']} values={[true, false]} defaultValue={content.bold} name="bold" onChange={(name,value)=>onChange(index,subindex,name,value)} />
        </Grid>}
        {['h', 'text'].indexOf(content.type) >= 0 && <Grid item xs={12} sm={12}>
            <SingleSelector 
                items={[
                    <span style={{ color:"red",textDecoration:'underline red 2px' }}>red</span>,
                    <span style={{ color:"orange",textDecoration:'underline orange 2px' }}>red</span>,
                    <span style={{ color:"red",textDecoration:'line-through red 2px' }}>red</span>,
                    <span style={{ color:"orange",textDecoration:'line-through red 2px' }}>red</span>,
                ]} 
                values={['underline red 2px', 'underline orange 2px', 'line-through red 2px', 'line-through orange 2px']} defaultValue={content.decoration} name="decoration" 
                onChange={(name,value)=>onChange(index,subindex,name,value)} />
        </Grid>}
        {error && <Alert severity='error' onClose={() => setError()} >{error} </Alert>}
    </Grid>
}
export default PageEditor