import { Box,  IconButton, Paper, Typography } from "@mui/material"
import { vs2015,CopyBlock,nord } from "react-code-blocks";
import { ContentCopy,  MoreHoriz } from "@mui/icons-material";
import { copyTextToClipboard } from "../../../Utils/Common";
import { useState } from "react";
const SlideContentItem = (props)=>{
    const {item,idx,selected,model,onClick} = props
    const itemMinHeight = 100
    const [items,setItems] = useState([])
    const onCopy = (text)=>{
        copyTextToClipboard(text)
    }
    const handleClick = (subidx)=>{
        let ii = [...items]        
        if(ii.indexOf(subidx)>=0) {                        
            ii.splice(ii.indexOf(subidx),1)
        }else {
            ii.push(subidx)
        }
        setItems(ii)
    }
    return <Paper sx={{p:2,width:"100%",border:selected && (model !== 1 )?'2px solid gray':'1px dotted gray',boxShadow:'0 0 0 0 !important',minHeight:selected?itemMinHeight:0,filter:selected&&"drop-shadow(5px 5px 5px gray)"}} onClick={()=>{onClick && onClick(idx)}}>    
        {item.type == 'h' && <Typography variant={"h"+item.size} component={'h'+item.size} sx={{color:item.color,fontWeight:item.bold?'bold':''}}>{item.content}</Typography>}
        {item.type == 'text' && <Typography variant={"body"} component={'p'}  sx={{color:item.color,fontSize:item.size,fontWeight:item.bold?'bold':''}}>{item.content}</Typography>}
        {item.type == 'content' && <Box>
        {item.content && item.content.map((subitem,subidx)=>{
            let choiced = items.indexOf(subidx)>=0
            return <Box  key={subidx}>                        
                {subitem.type == 'h' && <Typography onClick={()=>handleClick(subidx)} variant={"h"+subitem.size} component={'h'+subitem.size}  sx={{m:choiced?2:0,color:subitem.color,fontWeight:(subitem.bold === 'bold' || choiced)?'bold':'',textDecoration:choiced?'underline dotted red 3px':''}}>{subitem.content}</Typography>}
                {subitem.type == 'text' && <Typography onClick={()=>handleClick(subidx)} variant={"body"} component={'p'} sx={{m:choiced?2:0,color:subitem.color,fontSize:choiced?'28px':subitem.size,fontWeight:(subitem.bold === 'bold' || choiced)?'bold':'',textDecoration:choiced?'underline dotted red 3px':''}}>{subitem.content}</Typography>}                                    
                {subitem.type == 'code' && <Box sx={{position:'relative'}}>
                    {/* <IconButton sx={{position:'absolute',top:5,right:5,color:'white'}} size="small" onClick={onCopy(subitem.content)}><ContentCopy  fontSize="small"/></IconButton> */}
                    <CopyBlock text={subitem.content} theme={selected?vs2015:nord} language={'python'} showLineNumbers={true} wrapLines={true} ></CopyBlock>
                </Box>}
                {subitem.type == 'picture' && <img src={subitem.content} style={{width:subitem.width}}/>}            
            </Box>
        })}
    </Box>}
    {item.type == 'code' && <Box sx={{position:'relative'}}>
        <IconButton sx={{position:'absolute',top:5,right:5,color:'white'}} size="small" onClick={()=>{onCopy(item.content)}}><ContentCopy  fontSize="small"/></IconButton>
        <CopyBlock text={item.content} theme={selected ? vs2015:nord} language={'python'} showLineNumbers={true} wrapLines={true} ></CopyBlock>
    </Box>}
    {item.type == 'picture' && <Box><img src={item.content} style={{width:item.width}}/></Box>}
</Paper>
}

export default SlideContentItem