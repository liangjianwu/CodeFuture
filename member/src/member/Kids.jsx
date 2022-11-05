
import { Alert, Box, Button, Tab, Tabs, Typography,Snackbar } from "@mui/material"
import { useEffect, useState } from "react"
import apis from "../api"
import { apiResult, getUserSession } from "../Utils/Common"
import KidForm from "./fragement/KidForm"

const Kids = () => {
    const [tabIndex, setTabIndex] = useState(0)    
    const [kids, setKids] = useState()
    const [struct, setStruct] = useState()
    const [error, setError] = useState()
    getUserSession(apis)
    const [currentTab, setCurrentTab] = useState()
    const [hintMsg,setHintMsg] = useState()
    let initPage = false
    useEffect(() => {
        if (!initPage) {
            initPage = true
        } else {
            return
        }
        if (!kids) {
            apis.loadKidsProfile().then(ret => {
                apiResult(ret, data => {
                    data.members.map(m => {
                        m.member_infos && m.member_infos.map(mi => {
                            m[mi.key] = mi.value
                        })
                        m.member_infos = null
                    })

                    setKids(data.members)
                    setStruct(data.struct)
                    // if(data.members.length>0) {
                    //     setCurrentTab(<KidForm data={data.members[0]} onSave={(data)=>{handleSave(0,data)}} struct={data.struct}/>)
                    // }
                }, setError)
            })
        }
    }, [])

    const handleTabChange = (event, idx) => {
        setTabIndex(idx)
        setCurrentTab()
        // if(idx === kids.length) {
        //     setCurrentTab(<KidForm onSave={(data)=>{handleSave(-1,data)}} struct={struct}/>)
        // }else {
        //     setCurrentTab(<KidForm data={kids[idx]} onSave={(data)=>{handleSave(idx,data)}} struct={struct}/>)
        // }

    }
    const handleAddKid = () => {
        setCurrentTab(<KidForm data={{ id: 0 }} title={"Add a kid"} onSave={(data) => { handleSave(-1, data) }} struct={struct} />)
    }
    const handleSave = (idx, data) => {
        data.name = data.firstname + ' ' + data.lastname
        if (idx < 0) {
            kids ? setKids([...kids, data]) : setKids(data)
        } else {
            let kk = [...kids]
            kk[idx] = data
            setKids(kk)
        }
        setCurrentTab()
        setHintMsg("Saved successfully")
    }
    const handleHintClose = ()=>{
        setHintMsg()
    }
    return <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {kids && kids.length > 0 && <Tabs value={tabIndex} onChange={handleTabChange} >
            {kids.map((kid, index) => {
                return <Tab label={kid.name ? kid.name : 'New kid'} key={index} />
            })}
            {kids.length < 3 && <Tab label={'Add Kid'} key={"111"} />}
        </Tabs>}
        {error && <Alert severity="error">{error}</Alert>}

        {kids && kids.length > 0 && kids.map((kid, idx) => {
            return tabIndex === idx && <KidForm key={idx} data={kid} onSave={(data) => { handleSave(idx, data) }} struct={struct} />
        })}
        {kids && kids.length > 0 && tabIndex === kids.length && <KidForm data={{ id: 0 }} onSave={(data) => { handleSave(-1, data) }} struct={struct} />}
        {currentTab}
        {!currentTab && (!kids || kids.length == 0) && <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <img src="/kid.jpg" />
            <Typography>There is no information for your child !!</Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={handleAddKid}>Add Now !!</Button>
        </Box>}
        {hintMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
            <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
        </Snackbar>}
    </Box>
}
export default Kids