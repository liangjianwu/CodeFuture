import Editor from "@monaco-editor/react";
import { Box} from "@mui/material"
function CodeEditor(props) {
    const handleChange = (v, e) => {
        props.onChange && props.onChange(v)
    }
    return <Box sx={{pt:2,pb:2,bgcolor:'black'}}>
        <Editor
            height={props.height}
            defaultLanguage="python"
            defaultValue={props.value}                     
            options = {{
                minimap:{enabled:false},
                lineNumbers:'on',
                scrollbar:{
                    verticalScrollbarSize: 2,
                    horizontalScrollbarSize: 2,
                },
                overviewRulerBorder: false,
                tabSize:4,
                autoIndent: true,                
            }}
            theme={'vs-dark'}
            onChange = { handleChange }
    /></Box>   
}

export default CodeEditor