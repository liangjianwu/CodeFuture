
const TplTitle = (props) => {
    return <div style={{ textAlign: props.data.textAlign }}><h2 style={{
        fontSize: props.data.fontSize,
        color: props.data.color,
        marginTop: props.data.marginTop ? props.data.marginTop : "5px",
        marginBottom: props.data.marginBottom ? props.data.marginBottom : "5px",
    }}>{props.data.text ? props.data.text : props.data.type}</h2></div>
}
const TplSubtitle = (props) => {
    return <div style={{ textAlign: props.data.textAlign }}><h4 style={{
        fontSize: props.data.fontSize,
        color: props.data.color,
        marginTop: props.data.marginTop ? props.data.marginTop : "5px",
        marginBottom: props.data.marginBottom ? props.data.marginBottom : "5px",
    }}>{props.data.text ? props.data.text : props.data.type}</h4></div>
}
const TplText = (props) => {
    return <div style={{ textAlign: props.data.textAlign }}><p style={{
        fontSize: props.data.fontSize,
        color: props.data.color,
        marginTop: props.data.marginTop ? props.data.marginTop : "5px",
        marginBottom: props.data.marginBottom ? props.data.marginBottom : "5px",
    }}>{props.data.text ? props.data.text : props.data.type}</p></div>
}
const TplImage = (props) => {
    const imgUrl = 'https://img-getpocket.cdn.mozilla.net/296x148/filters:format(jpeg):quality(60):no_upscale():strip_exif()/https%3A%2F%2Fmedia.glamour.com%2Fphotos%2F6287a3d13b27028f51acd01b%2F16%3A9%2Fw_1280%2Cc_limit%2Fmyth-of-mom-hair-v3.jpg'
    return <div style={{
        overflow:'hidden',
        height: props.data?.height, marginTop: props.data.marginTop ? props.data.marginTop : "5px",
        marginBottom: props.data.marginBottom ? props.data.marginBottom : "5px",
    }}><img
            src={props.data.src ? props.data.src : imgUrl}
            alt={props.data.type}
            style={{
                width: props.data.width ? props.data.width : "100%",
            }} /></div>
}
const TplButton = (props) => {
    return <a href={props.data.url} target="_blank" style={{ textDecoration: 'none' }}><div style={{
        textAlign: 'center',
        padding: "8px",
        hover: "#1976d299",
        fontSize: props.data.fontSize ? props.data.fontSize : 16,
        color: props.data.color ? props.data.color : '#fff',
        width: "100%",
        height: props.data.height ? props.data.height : '40px',
        border: "1px solid grey",
        borderRadius: "3px",
        marginTop: props.data.marginTop ? props.data.marginTop : "5px",
        marginBottom: props.data.marginBottom ? props.data.marginBottom : "5px",
        backgroundColor: props.data.backgroundColor ? props.data.backgroundColor : "#1976d2",
    }}>{props.data.text ? props.data.text : props.data.type}</div></a>
}
const TplUrl = (props) => {
    return <div style={{ textAlign: props.data.textAlign }}><a href={props.data.url} target="_blank" style={{
        fontSize: props.data.fontSize,
        color: props.data.color ? props.data.color : '#1976d2',
        marginTop: props.data.marginTop ? props.data.marginTop : "5px",
        marginBottom: props.data.marginBottom ? props.data.marginBottom : "5px",
    }}>{props.data.text ? props.data.text : props.data.type}</a></div>
}
export {
    TplTitle, TplSubtitle, TplImage, TplButton, TplText, TplUrl
}