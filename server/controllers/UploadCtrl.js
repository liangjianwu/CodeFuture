const {  returnError, returnResult } = require("../components/errcode")
const excelToJson = require('convert-excel-to-json');
const formidable = require('formidable');
const { ErrorHint, Debug } = require("../components");
const fs = require('fs');
const db = require('../db/db')
const md5 = require('md5')
const model = require('../db/model');
const Member = model.Member
const User = model.User
const Group = model.Group
const MemberGroup = model.MemberGroup
const UserProfile = model.UserProfile
const MemberInfo = model.MemberInfo
const getGender = (value) => {
    if(!value)  return 'Other'
    Debug([value.toLowerCase(),value.toLowerCase() == 'male'])
    if (value.toLowerCase() == 'male' || value.toLowerCase() == 'm') 
        return 'Male'
    else if (value.toLowerCase() == 'female' || value.toLowerCase() == 'f') 
        return 'Female'
    else 
        return 'Other'
}
module.exports.uploadMemberFiles = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        try {
            let filename = files.file.originalFilename
            let oldpath = files.file.filepath
            let ff = filename.split('.')
            let suffix = ff[ff.length - 1]
            if (ff.length < 2 || (suffix !== 'xlsx' && suffix !== 'xls')) {
                return returnError(res, 920001)
            }

            let newpath = './upload/' + Date.now() + '.' + suffix;
            const columns = Object.keys(Member.rawAttributes)                        
            fs.rename(oldpath, newpath, async function (err) {
                try {
                    if (err) {
                        ErrorHint(err)
                        return returnError(res, 920002)
                    } else {
                        let result = excelToJson({
                            sourceFile: newpath,
                        })
                        const retdata = { customers: [], succeed: 0, total: 0 }
                        let keys = Object.keys(result);
                        for (let i = 0; i < keys.length; i++) {
                            let header = {}
                            let sheet = result[keys[i]]
                            for (let index = 0; index < sheet.length; index++) {
                                let item = sheet[index]
                                if (index == 0) {
                                    header = item
                                } else {
                                    try {
                                        let itemkeys = Object.keys(header)
                                        let customer = {}
                                        let kv = []
                                        let parent = {}
                                        let group = ''
                                        for (let j = 0; j < itemkeys.length; j++) {
                                            if (columns.indexOf(header[itemkeys[j]]) >= 0) {
                                                customer[header[itemkeys[j]]] = item[itemkeys[j]]
                                                if(header[itemkeys[j]] == 'email') {
                                                    parent.email = item[itemkeys[j]]
                                                }
                                                if(header[itemkeys[j]] == 'phone') {
                                                    parent.phone = item[itemkeys[j]]
                                                }
                                            } else {                                                
                                                if(header[itemkeys[j]] == 'group') {
                                                    group = item[itemkeys[j]]
                                                }else if(header[itemkeys[j]] == 'parent'){
                                                    parent.name = item[itemkeys[j]]
                                                    let nn = parent.name.split(' ')
                                                    parent.firstname = nn[0]
                                                    parent.lastname = nn.length>1?nn[nn.length-1]:''
                                                }else {
                                                    kv.push({key:header[itemkeys[j]],value:item[itemkeys[j]]})
                                                }
                                            }
                                        }                                        
                                        if (customer.gender != '') {
                                            Debug(customer.gender)
                                            customer.gender = getGender(customer.gender)
                                        }                                        
                                        if (!customer.name && (customer.firstname || customer.lastname)) {
                                            customer.name = customer.firstname + ' ' + customer.lastname
                                        }else if(customer.name && !customer.firstname && !customer.lastname) {
                                            let nn = customer.name.split(' ')
                                            customer.firstname = nn[0]
                                            customer.lastname = nn.length>1?nn[nn.length-1]:''
                                        }
                                        
                                        if(!parent.email || parent.email == '') {
                                            retdata.customers.push({ sheet: keys[i], rowIndex: index, result: 'failed', note: 'The email is empty' })
                                            retdata.total += 1
                                            continue
                                        }
                                        let user = await User.findOne({where: { email:parent.email }})
                                        if(!user) {
                                            user = await User.create({
                                                email:parent.email,
                                                mid :req.mid,
                                                passwd:md5(md5('123456')),
                                            })
                                            parent.user_id = user.id
                                            parent.mid = req.mid
                                            await UserProfile.create(parent)
                                        }
                                        let member = {
                                            mid:req.mid,
                                            user_id:user.id,
                                            name:customer.name,
                                            firstname:customer.firstname,
                                            lastname:customer.lastname,
                                            gender:customer.gender,
                                            birthday:customer.birthday,
                                            phone:customer.phone,
                                            email:customer.email,
                                        }
                                        member = await Member.create(member)                                        
                                        if(group!='') {
                                            let g =await Group.findOne({where:{mid:req.mid,name:group,status:1}})
                                            if(!g) {
                                                g =await Group.create({mid:req.mid,name:group,status:1})
                                            }
                                            Debug([group,g.name,g.id])
                                            await MemberGroup.create({mid:req.mid,member_id:member.id,group_id:g.id})
                                        }
                                        for(let i=0;i<kv.length;i++) {
                                            let item = kv[i]
                                            if(item.value) {
                                                await MemberInfo.create({
                                                    mid:req.mid,
                                                    member_id:member.id,
                                                    key:item.key,
                                                    value:item.value
                                                })
                                            }
                                        } 
                                        retdata.total += 1
                                        retdata.succeed += 1                                        
                                    } catch (e) {
                                        ErrorHint(e)
                                        return returnError(res, 920002)
                                    }
                                }
                            }
                        }
                        return returnResult(res, retdata)
                    }
                } catch (e) {
                    ErrorHint(e)
                    return returnError(res, 920002)
                }
            });
        } catch (e) {
            ErrorHint(e)
            return returnError(res, 920002)
        }
    })


}