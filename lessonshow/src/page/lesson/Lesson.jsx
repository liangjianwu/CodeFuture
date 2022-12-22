import { Box, List, ListItem, } from "@mui/material"
import { useEffect,  useState } from "react"
import { useOutletContext,useParams,useNavigate } from "react-router"
import apis from "../../api";
import { apiResult, getUserSession } from "../../Utils/Common";
import SlideContentItem from "./fragement/SlideContentItem";

const demo = [
    {
        id: 1, title: 'Part 1: variable & type', items: [
            { content: 'fdsaklfdjsaklfdjksaf1', type: 'h' ,size:3,color:'red'},
            { content: 'fdsaklfdjsaklfdjksaf2', type: 'h' ,size:4},
            { content: 'fdsaklfdjsaklfdjksaf3', type: 'h' ,size:5},
            { content: 'fdsaklfdjsaklfdjksaf3', type: 'text'},
            { content: [
                { content: 'fdsaklfdjsaklfdjksaf1', type: 'h' ,size:3},
                { content: 'fdsaklfdjsaklfdjksaf2', type: 'h' ,size:4},
                { content: 'fdsaklfdjsaklfdjksaf3', type: 'h' ,size:5},
                { content: 'fdsaklfdjsaklfdjksaf3', type: 'text',size:20},
                { content: 'fdsaklfdjsaklfdjksaf3', type: 'code'},
            ], type: 'content' },
            { content: 'fdsaklfdjsaklfdjksaf5', type: 'code' },
            { content: 'http://localhost:3000/logo.png', type: 'picture' },
        ]
    },
    {
        id: 2, title: 'Part 2: variable & type', items: [
            { content: 'fdsaklfdjsaklfdjksaf6', type: 'h',size:3 },
            { content: 'fdsaklfdjsaklfdjksaf7', type: 'h',size:4 },
            { content: 'fdsaklfdjsaklfdjksaf8', type: 'h',size:5 },
            { content: 'fdsaklfdjsaklfdjksaf9', type: 'text' },
            { content: 'fdsaklfdjsaklfdjksaf0', type: 'code' },
            { content: 'http://localhost:3000/logo.png', type: 'picture',height:100 },
        ]
    }
]
export default function Lesson() {
    const [onContentLoad,onPartChanged] = useOutletContext()
    const [contentIdx, setContentIdx] = useState(0)
    const [index,setIndex] = useState(0)
    const [lesson,setLesson] = useState()
    const [model,setModel] = useState(0)      
    const [contents, setContents] = useState()    
    const params = useParams()
    const navigate = useNavigate()
    if( !getUserSession(apis) ) {
        navigate('/user/signin')
    }
    
    useEffect(() => {     
        console.log("load")   
        apis.lessonGet(params.id).then(ret=>{
            apiResult(ret,data=>{
                for(let i=0;i<data.lesson_pages.length;i++) {
                    data.lesson_pages[i].content = data.lesson_pages[i].content.length>0?JSON.parse(data.lesson_pages[i].content):[]
                }
                setContents(data.lesson_pages)
                setContentIdx(0)
                setLesson(data)
                setIndex(0)  
                onContentLoad && onContentLoad(data.lessonNo + ":"+ data.name, data.lesson_pages, onPartItemClick)              
            })
        })
    }, [])
    const onPartItemClick = (item, idx) => {               
        setContentIdx(idx)
        setIndex(0)        
        onPartChanged(idx)
    }
    window.onkeydown = (e)=>{
        if(e.keyCode === 32) {
            setModel((model+1)%3)
        }else if(e.keyCode === 39 || e.keyCode == 40) {
            setIndex(index< contents[contentIdx].content.length-1?(index+1):index)
        }else if(e.keyCode === 37 || e.keyCode == 38) {
            setIndex(index>1?index-1:0)
        }else if(e.keyCode === 33 ) {  
            let newIdx = contentIdx > 0?contentIdx-1:contentIdx          
            onPartChanged(newIdx)
            setContentIdx(newIdx)
            setIndex(0)            
        }else if(e.keyCode === 34) {            
            let newIdx = contentIdx < contents.length-1?contentIdx+1:contentIdx
            onPartChanged(newIdx)
            setContentIdx(newIdx)
            setIndex(0)
        }
        
    }
    const onItemExpand = (idx,item)=>{

    }
    return <Box sx={{ p: 2 }}> 
        {contentIdx>=0 && <List >
            {contents && contents[contentIdx].content && contents[contentIdx].content.map((item, idx) => {
                return <ListItem key={idx} sx={{display:(model === 0 && index>=idx) || (model === 1 && index === idx) || model === 2?'block':'none'}}>
                    <SlideContentItem item={item} idx={idx} selected={index === idx} model={model} onClick={(idx,item)=>setIndex(idx)} onExpand={onItemExpand}/>
                </ListItem> 
            })}
        </List> }
    </Box>

}