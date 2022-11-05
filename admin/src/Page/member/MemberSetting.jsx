import { Box, Grid, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import FormEditor from '../../Component/template/FormEditor'
import FormGenerator from '../../Component/template/FormGenerator'
import MemberDataStructSetting from './fragement/MemberDataStructSetting'
const MemberSetting = () => {
    const [tabIndex,setTabIndex] = useState(0)    
    const handleTabChange = (idx) =>{
        setTabIndex(idx)
    }
    return <>
        <Tabs value={tabIndex} onChange={handleTabChange} >
            <Tab label="Member Information Struct" />            
        </Tabs>
        {tabIndex == 0 && <MemberDataStructSetting />}
    </>
}

export default MemberSetting