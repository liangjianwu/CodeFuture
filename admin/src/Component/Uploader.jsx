import { CircularProgress,  Typography,} from "@mui/material"
import Uploady, { useItemFinishListener, useItemErrorListener, useItemStartListener } from "@rpldy/uploady";
import { asUploadButton } from "@rpldy/upload-button";
import { useState } from "react";
import { getUserSession } from "../Utils/Common";
import apis from "../api";
const Uploader = (props) => {
    const session = getUserSession(apis)
    const [loading,setLoading] = useState()
    const LogProgress = () => {
        useItemFinishListener((res) => {
            //console.log(res.uploadResponse.data.data)        
            let filename = res.uploadResponse.data.data
            props.onUpload && props.onUpload(filename)
            setLoading(false)

        })
        useItemErrorListener((res) => {
            setLoading(false)
            props.onFailed && props.onFailed(res.uploadResponse.data.data.error)
        })
        useItemStartListener((obj) => {            
            setLoading(true)
        })
        return null;
    }
    const DivUploadButton = asUploadButton((props) => {
        return <div {...props} style={{ width: 150, height: 35, padding: 6, cursor: "pointer", border: '1px solid grey' }}>
            {loading ? <CircularProgress /> : <Typography variant="subtitle2">{"Upload File (<1M)"}</Typography>}
        </div>
    });
    return <Uploady
        destination={apis.uploadResource(session)}>
        <LogProgress />
        <DivUploadButton />
    </Uploady>
}
export default Uploader