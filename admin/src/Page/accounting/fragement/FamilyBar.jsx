import { Button, Toolbar, Typography,  Divider,  Paper, FormControl, TextField, } from "@mui/material"
import { SearchBar } from "../../../Component/MuiEx";
import { getCurrentMonth01 } from "../../../Utils/Common";

const FamilyBar = (props) => {    
    let {balance,onSwitch,onCustomerSearch,onSnapshot} = props
    return (        
            <Paper sx={{ marginBottom: 2 }}>
                <Toolbar style={{ paddingLeft: 2 }}>                    
                    {onCustomerSearch && <>
                        <SearchBar placeholder="name | email | phone" onSearch={onCustomerSearch} /></>}

                    <Typography sx={{ flex: '1 1 10%' }} variant="h6" component="div" > </Typography>
                    {balance && <Typography variant="body2" sx={{mr:2,fontWeight:'bold'}}>{"Total balance: $"+ balance}</Typography>}
                    {balance && onSwitch  &&<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />}
                    {onSwitch && <Button onClick={onSwitch}>Switch</Button>}
                    <Button variant={'outlined'} onClick={onSnapshot}>Snapshot</Button>
                </Toolbar>
            </Paper>
    )
}
const BalanceSnapshotBar = (props) => {    
    let {balance,onSubmit,snapdate} = props
    return (        
            <Paper sx={{ p: 1 ,mb:2}} component="form" onSubmit={onSubmit}>
                <Toolbar style={{paddingLeft:1,paddingRight:1}}>                    
                    <FormControl sx={{ width: '200px', mr: 2 }}>
                        <TextField margin="normal" sx={{ mt: "8px" }} type="date" name="snapdate" defaultValue={new Date().toISOString().substring(0,10)} id="snapdate" label="Before date"
                            InputLabelProps={{ shrink: true }} />
                    </FormControl>                    
                    <Button variant='contained' type="submit">Go</Button>                    
                    {snapdate && <Typography variant="body2" sx={{mr:1,ml:2,fontWeight:'bold'}}>{"Snapshot date: "+ snapdate.substring(0,10)}</Typography>}  
                    <Typography sx={{ flex: '1 1 10%' }} variant="h6" component="div" > </Typography>
                    {balance && <Typography variant="body2" sx={{mr:1,fontWeight:'bold'}}>{"Total balance: $"+ balance}</Typography>}                    
                </Toolbar>
            </Paper>
    )
}
export {FamilyBar,BalanceSnapshotBar}