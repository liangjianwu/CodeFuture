const generateHtml = (template) => {
    let html1 = '<div style="margin:0 auto;max-width:800px;"><table style="width:100%;"><tbody>'
    const html2 = '</tbody></table></div>'
    const imgUrl = 'https://img-getpocket.cdn.mozilla.net/296x148/filters:format(jpeg):quality(60):no_upscale():strip_exif()/https%3A%2F%2Fmedia.glamour.com%2Fphotos%2F6287a3d13b27028f51acd01b%2F16%3A9%2Fw_1280%2Cc_limit%2Fmyth-of-mom-hair-v3.jpg'
    template.map((item,i1)=>{
        let tr1 = '<tr>'
        item.map((subitem,i2)=>{
            let td1 = '<td colspan="'+(6/item.length)+'" style="width:'+Math.floor(100/item.length)+'%;height:auto;">'
            let div1 = '<div>'
            let content = ""
            subitem.map((obj,i3)=>{
                if(obj.type === 'title') {
                    content += '<div style="text-align:'+obj.textAlign+';margin-top:'+(obj.marginTop?obj.marginTop:"5px")+';margin-bottom:'+(obj.marginBottom?obj.marginBottom:"5px")+'"><h2 style="margin:0;color:'+obj.color+';font-size:'+obj.fontSize+';">'+obj.text+'</h2></div>'
                }else if(obj.type === 'subtitle') {
                    content += '<div style="text-align:'+obj.textAlign+';margin-top:'+(obj.marginTop?obj.marginTop:"5px")+';margin-bottom:'+(obj.marginBottom?obj.marginBottom:"5px")+'"><h4 style="margin:0;color:'+obj.color+';font-size:'+obj.fontSize+';">'+(obj.text)+'</h4></div>'
                }else if(obj.type === 'text') {
                    content += '<div style="text-align:'+obj.textAlign+';margin-top:'+(obj.marginTop?obj.marginTop:"5px")+';margin-bottom:'+(obj.marginBottom?obj.marginBottom:"5px")+'"><p style="margin:0;color:'+obj.color+';font-size:'+obj.fontSize+';">'+(obj.text)+'</p></div>'
                }else if(obj.type === 'image') {
                    content += '<div style="height:'+(obj.height?obj.height:"100%")+';overflow:hidden;margin-top:'+(obj.marginTop?obj.marginTop:"5px")+';margin-bottom:'+(obj.marginBottom?obj.marginBottom:"5px")+'"><img src="'+(obj.src?obj.src:imgUrl)+'" alt="image" style="width:'+(obj.width?obj.width:"100%")+';" /></div>'
                }else if(obj.type === 'images') {
                    content += '<table style="width:100%;margin-top:'+(obj.marginTop?obj.marginTop:"5px")+';margin-bottom:'+(obj.marginBottom?obj.marginBottom:"5px")+'"><tbody>'
                    for(let i=0;i<(obj.row?obj.row:2);i++) {
                        content +="<tr>"
                        for(let j=0;j<(obj.column?obj.column:3);j++) {
                            content += '<td><img src="'+imgUrl+'" alt="image" style="width:100%;" /></td>'
                        }
                        content += "</tr>"
                    }
                    content +='</tbody></table>'
                }else if(obj.type === 'button') {
                    content += '<a href="'+obj.url+'" style="text-decoration:none;" target="_blank"><div style="text-align:center;padding:8px;border:1px solid grey;border-radius:3px;width:100%;height:'+(obj.height?obj.height:"40px")+';margin-top:'+(obj.marginTop?obj.marginTop:"5px")+';margin-bottom:'+(obj.marginBottom?obj.marginBottom:"5px")+';font-size:'+obj.fontSize+';color:'+(obj.color?obj.color:"#ffffff")+';background-color:'+(obj.backgroundColor?obj.backgroundColor:"#1976d2")+';" onclick="window.location.href=\"'+(obj.url)+'\"" value="'+(obj.text?obj.text:obj.type)+'">'+(obj.text?obj.text:obj.type)+'</div></a>'
                }else if(obj.type === 'url') {
                    content += '<div style="text-align:'+obj.textAlign+';margin-top:'+(obj.marginTop?obj.marginTop:"5px")+';margin-bottom:'+(obj.marginBottom?obj.marginBottom:"5px")+'"><a href="'+obj.url+'" target="_blank" style="font-size:'+obj.fontSize+';color:'+obj.color+'" >'+(obj.text?obj.text:obj.type)+'</a></div>'
                }else if(obj.type === 'panel') {
                    td1 = '<td colspan="'+(6/item.length)+'" style="width:'+Math.floor(100/item.length)+'%;background-color:'+obj.backgroundColor+';">'
                    div1 = '<div style="margin-left:'+(obj.paddingLeft?obj.paddingLeft:"5px")+';margin-right:'+(obj.paddingRight?obj.paddingRight:"5px")+';">'
                }
            })
            td1 += div1 + content
            td1 += '</div></td>'
            tr1 += td1
        })
        tr1 += '</tr>'
        html1 += tr1
    })
    html1 += html2
    return html1
}
export default generateHtml