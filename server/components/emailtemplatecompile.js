const { Debug, ErrorHint } = require("./console")

const generateHtml = (template) => {
    try {
        let html1 = '<div style="margin:0px auto;max-width:800px;"><table style="width:100%;"><tbody>'
        const html2 = '</tbody></table></div>'
        const imgUrl = 'https://img-getpocket.cdn.mozilla.net/296x148/filters:format(jpeg):quality(60):no_upscale():strip_exif()/https%3A%2F%2Fmedia.glamour.com%2Fphotos%2F6287a3d13b27028f51acd01b%2F16%3A9%2Fw_1280%2Cc_limit%2Fmyth-of-mom-hair-v3.jpg'
        template.map((item, i1) => {
            let tr1 = '<tr>'
            item.map((subitem, i2) => {
                let td1 = '<td colspan="' + (6 / item.length) + '" style="width:' + Math.floor(100 / item.length) + '%;">'
                let div1 = '<div>'
                let content = ""
                subitem.map((obj, i3) => {

                    if (obj.type === 'title') {
                        content += '<div style="text-align:' + obj.textAlign + ';margin-top:' + (obj.marginTop ? obj.marginTop : "5px") + ';margin-bottom:' + (obj.marginBottom ? obj.marginBottom : "5px") + '"><h2 style="margin:0;color:' + obj.color + ';font-size:' + obj.fontSize + ';">' + (obj.text ? obj.text : (obj.type)) + '</h2></div>'
                    } else if (obj.type === 'subtitle') {
                        content += '<div style="text-align:' + obj.textAlign + ';margin-top:' + (obj.marginTop ? obj.marginTop : "5px") + ';margin-bottom:' + (obj.marginBottom ? obj.marginBottom : "5px") + '"><h4 style="margin:0;color:' + obj.color + ';font-size:' + obj.fontSize + ';">' + (obj.text ? obj.text : (obj.type)) + '</h4></div>'
                    } else if (obj.type === 'text') {
                        content += '<div style="text-align:' + obj.textAlign + ';margin-top:' + (obj.marginTop ? obj.marginTop : "5px") + ';margin-bottom:' + (obj.marginBottom ? obj.marginBottom : "5px") + '"><p style="margin:0;color:' + obj.color + ';font-size:' + obj.fontSize + ';">' + (obj.text ? obj.text : (obj.type)) + '</p></div>'
                    } else if (obj.type === 'image') {
                        content += '<div style="height:' + (obj.height ? obj.height : "100%") + ';overflow:hidden;margin-top:' + (obj.marginTop ? obj.marginTop : "5px") + ';margin-bottom:' + (obj.marginBottom ? obj.marginBottom : "5px") + '"><img src="' + (obj.src ? obj.src : imgUrl) + '" alt="image" style="width:' + (obj.width ? obj.width : "100%") + ';" /></div>'
                    } else if (obj.type === 'images' && Array.isArray(obj.src) && obj.src.length > 0) {
                        content += '<table style="margin-top:' + (obj.marginTop ? obj.marginTop : "5px") + ';margin-bottom:' + (obj.marginBottom ? obj.marginBottom : "5px") + '"><tbody>'
                        let column = (obj.column ? obj.column : 3)
                        let rr = Math.floor(obj.src.length / column)
                        if (obj.src.length % column > 0) rr += 1
                        let row = Math.min((obj.row ? obj.row : 2), rr)
                        let cur = 0
                        for (let i = 0; i < row; i++) {
                            content += "<tr>"
                            for (let j = 0; j < column; j++) {
                                if (cur < obj.src.length) {
                                    content += '<td style="width:'+Math.floor(100/column)+'%"><img src="' + obj.src[cur] + '" alt="image" style="width:100%;" /></td>'
                                    cur += 1
                                } else {
                                    content += '<td style="width:'+Math.floor(100/column)+'%"></td>'
                                }
                            }
                            content += "</tr>"
                        }
                        content += '</tbody></table>'
                    } else if (obj.type === 'button') {
                        content += '<a href="' + obj.url + '" style="text-decoration:none;" target="_blank"><div style="text-align:center;padding:10 0;border:1px solid grey;border-radius:3px;width:100%;height:' + (obj.height ? obj.height : "30px") + ';margin-top:' + (obj.marginTop ? obj.marginTop : "5px") + ';margin-bottom:' + (obj.marginBottom ? obj.marginBottom : "5px") + ';font-size:' + obj.fontSize + ';color:' + (obj.color ? obj.color : "#ffffff") + ';background-color:' + (obj.backgroundColor ? obj.backgroundColor : "#1976d2") + ';" onclick="window.location.href=\"' + (obj.url) + '\"" value="' + (obj.text ? obj.text : obj.type) + '">' + (obj.text ? obj.text : obj.type) + '</div></a>'
                    } else if (obj.type === 'url') {
                        content += '<div style="text-align:' + obj.textAlign + ';margin-top:' + (obj.marginTop ? obj.marginTop : "5px") + ';margin-bottom:' + (obj.marginBottom ? obj.marginBottom : "5px") + '"><a href="' + obj.url + '" target="_blank" style="font-size:' + obj.fontSize + ';color:' + obj.color + '" >' + (obj.text ? obj.text : obj.type) + '</a></div>'
                    } else if (obj.type === 'panel') {
                        td1 = '<td colspan="' + (6 / item.length) + '" style="width:' + Math.floor(100 / item.length) + '%;background-color:' + obj.backgroundColor + ';">'
                        div1 = '<div style="margin-left:' + obj.paddingLeft + ';margin-right:' + obj.paddingRight + ';">'
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
    } catch (e) {
        ErrorHint(e)
    }
    return ''
}

module.exports.templateCompile = (title, template, variables, values) => {
    let count = 0
    variables.map((tv, index) => {
        if (tv.type === 'eTitle') {
            tv.variable.map((v, index1) => {
                title = title.replace('#' + v + '#', values[count])
                count++
            })
        } else {
            tv.variable.map((v, index1) => {
                if (v === '$text') {
                    template[tv.pos[0]][tv.pos[1]][tv.pos[2]].text = values[count]
                } else if (v === '$url') {
                    template[tv.pos[0]][tv.pos[1]][tv.pos[2]].url = values[count]
                } else if (v === '$src') {
                    template[tv.pos[0]][tv.pos[1]][tv.pos[2]].src = values[count]
                } else {
                    template[tv.pos[0]][tv.pos[1]][tv.pos[2]].text = template[tv.pos[0]][tv.pos[1]][tv.pos[2]].text.replace('#' + v + '#', values[count])
                }
                count++
            })
        }
    })
    let html = generateHtml(template)
    return { title: title, html: html, text: 'Please open the mail with a client that support html or webmail' }
}
module.exports.templateCompileWithObj = (title, template, variables, values, customer) => {    
    try {        
        variables && variables.map((tv, index) => {
            if (tv.type === 'eTitle') {
                tv.variable.map((v, index1) => {
                    let value = null
                    if (v === "_customer_name" && customer) {
                        value = customer.name
                    } else {
                        value = values[v.substring(1)] ? values[v.substring(1)] : null
                    }
                    if(value != null) {
                        title = title.replace('%' + v + '%', value)
                    }                
                })
            } else {
                tv.variable.map((v, index1) => {
                    let value = null
                    if (v === "_customer_name" && customer) {
                        value = customer.name
                    } else {
                        value = values[v.substring(1)] ? values[v.substring(1)] : null
                    }
                    value = value == null?"none":value
                    if (value != null) {
                        let obj = template[tv.pos[0]][tv.pos[1]][tv.pos[2]]
                        if (["title", "subtitle", "text"].indexOf(obj.type) >= 0) {
                            obj.text = obj.text.replace('%' + v + '%', value)
                        } else if (["image"].indexOf(obj.type) >= 0) {
                            obj.text = obj.src.replace('%' + v + '%', value)
                        } else if (["images"].indexOf(obj.type) >= 0) {
                            obj.src = value
                        } else if (["button", "url"].indexOf(obj.type) >= 0) {
                            obj.url = obj.url.replace('%' + v + '%', value)
                        }
                    }
                })
            }
        })
        let html = generateHtml(template)
        return {title:title,html:html,text:"Please open the mail with a client that support html or webmail"}
    }catch(e){
        ErrorHint(e)
        return {title:title,html:"",text:""}
    }
    
}
module.exports.generateHtml = generateHtml