import { Divider, Grid, Paper, Stack,Typography, Toolbar, IconButton, } from "@mui/material"

import { FormItem, FormTypeMenu } from "./FormTypeMenu";
import { Edit, Remove } from "@mui/icons-material";


const FormEditor = (props) => {    
    const {form,onItemChange,onItemRemove,onItemAdd,onFormSectionEdit} = props
    return <Paper sx={{ marginTop: 2, padding: 2 }}>
        <Toolbar sx={{ margin: "0 !important", padding: "0 !important", minHeight: "0 !important" }}>
            <Typography sx={{ flex: '1 1 100%' }} component="div" >Form Editor</Typography>
            <FormTypeMenu onAdd={onItemAdd} />
        </Toolbar>
        <Grid container>
            {form && form.map((item, index) => {
                if (item.type === 'section') {
                    return <Paper key={index} sx={{ padding: 2, width: "100%", marginTop: 2 }}>
                        <Toolbar sx={{ margin: "0 !important", padding: "0 !important", minHeight: "0 !important" }}>
                            <Typography sx={{ flex: '1 1 100%' }} component="div" >{item.label}</Typography>
                            <Stack direction={"row"}>
                                <IconButton size={"small"} onClick={() => { onItemRemove(item, [index]) }}><Remove fontSize="small" /></IconButton>
                                <IconButton size={"small"} onClick={() => { onFormSectionEdit(index) }}><Edit fontSize="small" /></IconButton>
                                <FormTypeMenu onAdd={onItemAdd} idx={index} />
                            </Stack>
                        </Toolbar>
                        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
                        {item.items && item.items.map((subitem, idx) => {
                            return <FormItem key={idx} item={subitem} onChange={onItemChange} onRemove={onItemRemove} idx={[index, idx]}></FormItem>
                        })}
                    </Paper>
                } else {
                    return <FormItem key={index} item={item} idx={[index]} onChange={onItemChange} onRemove={onItemRemove}></FormItem>
                }
            })}
        </Grid>
    </Paper>
}

export default FormEditor