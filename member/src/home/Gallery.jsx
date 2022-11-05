import { Box, ImageList,ImageListItem, Grid, Pagination,Typography,Alert } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import apis from "../api"
import { apiResult, getUserSession } from "../Utils/Common"

const Gallery = () => {
    const [photos, setPhotos] = useState()
    const [videos, setVideos] = useState()
    const [photototal,setPhotoTotal] = useState(0)
    const [videototal,setVideoTotal] = useState(0)
    const [error, setError] = useState()
    const navigate = useNavigate()
    const pagesize = 4
    getUserSession(apis)
    useEffect(() => {
        loadResources('img',0,1)
        loadResources('video',0,1)
    }, [])
    const loadResources = (type,page,countdata) => {
        apis.loadResources('gallery',type,page,type==='video'?pagesize+1:pagesize,countdata).then(ret => {
            apiResult(ret, data => {
                type === 'img'?setPhotos(data.data):setVideos(data.data)
                if(countdata === 1) {
                    type === 'img'?setPhotoTotal(data.total):setVideoTotal(data.total)
                }
            }, setError)
        })
    }
    const handlePageChange=(type,page) =>{
        loadResources(type,page-1,0)
    }
    return <Box sx={{p:2}}>
        <Typography component="h6" variant="h6" sx={{ fontWeight: '',mt:2}}>Hot videos</Typography>                
        {videos && <Box sx={{display:{xs:'none',sm:'none',md:'block'}}}><VideoList videos={videos} cols = {3} rowHeight={200} /></Box>}
        {videos && <Box sx={{display:{xs:'none',sm:'block',md:'none'}}}><VideoList videos={videos} cols = {4} rowHeight={200} /></Box>}
        {videos && <Box sx={{display:{xs:'block',sm:'none',md:'none'}}}><VideoList videos={videos} cols = {12} rowHeight={200} /></Box>}
        {videototal > pagesize && <Pagination count={Math.ceil(videototal/(pagesize+1))} onChange={(event,page)=>handlePageChange('video',page)}/>}
        <Typography component="h6" variant="h6" sx={{ fontWeight: '',mt:2}}>Photos wall</Typography>                
        {photos && <Box sx={{display:{xs:'none',sm:'none',md:'block'}}}><PhotoList photos={photos} cols = {4} rowHeight={200} /></Box>}
        {photos && <Box sx={{display:{xs:'none',sm:'block',md:'none'}}}><PhotoList photos={photos} cols = {3}  rowHeight={200}/></Box>}
        {photos && <Box sx={{display:{xs:'block',sm:'none',md:'none'}}}><PhotoList photos={photos} cols = {2}  rowHeight={150}/></Box>}
        {photototal > (3*pagesize) && <Pagination count={Math.ceil(photototal/(3*pagesize))} onChange={(event,page)=>handlePageChange('img',page)}/>}

        {error && <Alert severity="error">{error}</Alert>}
    </Box>
}
const PhotoList = (props) =>{
    let {photos,cols,rowHeight} = props
    return <ImageList sx={{ width: "100%" }} cols={cols} rowHeight={rowHeight}>
    {photos && photos.map((item,index) => {
        let path = item.path
        if(item.islocal == 1) {
            path = '/memberapi/home/photo?file='+path
        }
        return <ImageListItem key={index} sx={{cursor:'pointer'}} onClick={()=>{window.open(path)}}>
        <img style={{maxHeight:rowHeight}}
            src={path}
            srcSet={path}
            alt={item.name}
            loading="lazy"
        />
        </ImageListItem>
    })}
    </ImageList>
}
const VideoList = (props) =>{    
    let {videos,cols,rowHeight} = props
    return <Grid container spacing={0.5} sx={{ width: "100%" }}>
    {videos && videos.map((item,index) => {
        let path = item.path       
        return <Grid item key={index} xs={index==0?12:cols}>
        <iframe src={path} title={item.name} width="100%" height={(index==0&&cols<12?3:1)*rowHeight} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;full-screen;fullscreen" allowfullscreen></iframe>
        </Grid>
    })}
    </Grid>
}
export default Gallery


