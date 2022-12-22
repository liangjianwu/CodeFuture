import { Box,   Paper, Typography } from "@mui/material"
import { CodeBlock,nord,vs2015,CopyBlock } from "react-code-blocks";
const SlideContentItem = (props)=>{
    const {item,idx,subindex,selected,model,onClick} = props
    const itemMinHeight = 100
    return <Paper sx={{p:2,width:"100%",border:selected && (model !== 1 )?'2px solid gray':'1px dotted gray',boxShadow:'0 0 0 0 !important',minHeight:selected?itemMinHeight:0,filter:selected&&"drop-shadow(3px 3px 3px gray)"}} onClick={(e)=>{e.preventDefault();onClick && onClick(idx,-1,item)}}>    
        {item.type == 'h' && item.size>0 && <Typography variant={"h"+item.size} component={'h'+item.size} sx={{color:item.color,fontWeight:item.bold?'bold':'',textDecoration:item.decoration}}>{item.content}</Typography>}
        {item.type == 'text' && <Typography variant={"body"} component={'p'}  sx={{color:item.color,fontSize:item.size,fontWeight:item.bold?'bold':'',textDecoration:item.decoration}}>{item.content}</Typography>}
        {item.type == 'content' && <Box>
        {item.content && item.content.map((subitem,subidx)=>{
            return <Box  key={subidx} onClick={(e)=>{e.stopPropagation();onClick && onClick(idx,subidx,item)}} sx={{minHeight:"30px",border:selected&&subindex===subidx?'1px solid':'0px'}}>
                {subitem.type == 'h' && <Typography variant={"h"+subitem.size} component={'h'+subitem.size}  sx={{color:subitem.color,fontWeight:subitem.bold?'bold':''}}>{subitem.content}</Typography>}
                {subitem.type == 'text' && <Typography variant={"body"} component={'p'} sx={{color:subitem.color,fontSize:subitem.size,fontWeight:subitem.bold?'bold':''}}>{subitem.content}</Typography>}                                    
                {subitem.type == 'code' && <CodeBlock text={subitem.content} theme={selected?vs2015:nord} language={'python'} showLineNumbers={true} wrapLines ></CodeBlock>}
                {subitem.type == 'picture' && <img src={subitem.content} style={{width:subitem.width}}/>}            
            </Box>
        })}
    </Box>}
    {item.type == 'code' && <CopyBlock text={item.content} theme={selected ? vs2015:nord} codeBlock language={'python'} showLineNumbers={true} wrapLines ={true} ></CopyBlock>}
    {item.type == 'picture' && <Box><img src={item.content} style={{width:item.width}}/></Box>}
</Paper>
}

export default SlideContentItem