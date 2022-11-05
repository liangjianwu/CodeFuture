import { Alert, Box, Button, Grid, Snackbar, } from '@mui/material'
import { useEffect, useState } from 'react'
import apis from '../../../api'
import FormEditor from '../../../Component/template/FormEditor'
import FormGenerator from '../../../Component/template/FormGenerator'
import { apiResult, getUserSession } from '../../../Utils/Common'
const MemberDataStructSetting = () => {
    const [form, setForm] = useState([])
    const [error, setError] = useState()
    const [hintMsg, setHintMsg] = useState()
    const session = getUserSession(apis)
    useEffect(() => {
        apis.loadMemberInfoStruct().then(ret => {
            apiResult(ret, data => {
                setForm(data)
            }, setHintMsg)
        })
    }, [])
    const handleItemAdd = (type, idx) => {
        setError()
        let item = { type: type }
        if (type === 'section') {
            let label = window.prompt("Section label")
            if (!label || label === "") return
            item = { type: type, items: [], label: label }
        }
        const nform = [...form]
        if (idx >= 0) {
            nform[idx].items.push(item)
        } else {
            nform.push(item)
        }
        setForm(nform)
    }
    const editFormSection = (idx) => {
        setError()
        let newVal = window.prompt("Edit the section label", form[idx].label)
        if (newVal && newVal !== "") {
            const nform = [...form]
            nform[idx].label = newVal
            setForm(nform)
        }
    }
    const handleItemRemove = (item, idx) => {
        setError()
        const nform = [...form]
        if (idx.length === 1) {
            nform.splice(idx[0], 1)
        } else if (idx.length === 2) {
            nform[idx[0]].items.splice(idx[1], 1)
        }
        setForm(nform)
    }
    const handleFormItemChange = (item, idx) => {
        setError()
        const nform = [...form]
        if (idx.length === 1) {
            nform[idx[0]] = item
        } else if (idx.length === 2) {
            nform[idx[0]].items[idx[1]] = item
        }
        setForm(nform)
    }
    const handleSubmit = () => {
        setError()
        apis.setMemberInfoStruct({ form: form }).then(ret => {
            apiResult(ret, data => {
                setHintMsg("Saved successfully")
            }, setError)
        })
    }
    const handleHintClose = () => {
        setHintMsg()
    }
    return <Box sx={{ mt: 2 }}>
        {error && <Alert severity='error'>{error}</Alert>}
        {hintMsg && <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={hintMsg ? true : false} autoHideDuration={3000} onClose={handleHintClose}>
            <Alert onClose={handleHintClose} severity="success" sx={{ width: '100%' }}>{hintMsg}</Alert>
        </Snackbar>}
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <FormEditor title={"Member information Structure Definition"} form={form} onItemRemove={handleItemRemove} onItemChange={handleFormItemChange} onItemAdd={handleItemAdd} onFormSectionEdit={editFormSection} />
            </Grid>
            <Grid item xs={4}>
                <Button sx={{ mt: 2 }} variant="contained" onClick={handleSubmit}>Save</Button>
                <FormGenerator form={form} />
            </Grid>
        </Grid>
    </Box>

}

export default MemberDataStructSetting