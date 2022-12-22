const { returnResult, returnError, returnSuccess } = require("../components/errcode")
const formidable = require('formidable');
const model = require("../db/model");
const { ErrorHint, Debug, errorMsg } = require("../components");
const db = require("../db/db");
const { doWithTry } = require("./utils/Common");
const Resource = model.Resource
const op = db.Sequelize.Op
const fs = require('fs');
var pathlib = require("path");
module.exports.upload = async (req, res) => {
    doWithTry(res, async () => {
        let form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                let filename = files.file.originalFilename
                let oldpath = files.file.filepath
                let ff = filename.split('.')
                let suffix = ff[ff.length - 1]
                if (ff.length < 2 || (suffix !== 'png' && suffix !== 'jpg' && suffix !== 'jpeg')) {
                    return returnError(res, 920005)
                }
                let newfilename = Date.now() + '.' + suffix;
                let newpath = pathlib.resolve('./upload/' + newfilename)
                fs.rename(oldpath, newpath, async function (err) {
                    try {
                        if (err) {
                            ErrorHint(err)
                            return returnError(res, 920002)
                        } else {
                            return returnResult(res, newfilename)
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
    })
}
module.exports.postResource = async (req, res) => {
    doWithTry(res, async () => {
        let { id, name, description, path, type, resource_type, islocal } = req.body
        let resource = null
        if (id > 0) {
            await Resource.update({ name, description, path, type, resource_type, islocal }, { where: { id: id, status: 1 } })
        } else {
            resource = await Resource.create({ name, description, path, type, resource_type, islocal, mid: req.mid })
            id = resource.id
        }
        return returnResult(res, id)
    })
}

module.exports.changeStatus = async (req, res) => {
    doWithTry(res, async () => {
        let { id, status } = req.body
        let f = await Resource.findOne({ where: { id: id } })
        if (f) {
            f.status = status
            await f.save()
            return returnResult(res, '')
        } else {
            return returnError(res, 900001)
        }
    })
}

module.exports.loadResources = {
    get: async (req, res) => {
        doWithTry(res, async () => {
            let { type, page, pagesize, countdata } = req.query
            let retdata = { total: 0, data: [] }
            if (countdata == 1) {
                retdata.total = await Resource.count({ where: { mid: req.mid, type: type, status: 1 } })
            }
            retdata.data = await Resource.findAll({ where: { mid: req.mid, type: type, status: 1 }, order: [['id', 'desc']], limit: Number(pagesize), offset: Number(pagesize) * Number(page) })
            return returnResult(res, retdata)
        })
    }
}
module.exports.photo = {
    get: async (req, res) => {

        let { file } = req.query
        let a = file.split('.')
        if (a.length != 2 || isNaN(a[0]) || (a[1] != 'jpg' && a[1] != 'jpeg' && a[1] != 'png')) {
            return returnError(res, 900001)
        }
        // res.setHeader("Content-Type", "image/jpeg,image/png")
        res.sendFile(pathlib.resolve('./upload/' + file))

    }
}