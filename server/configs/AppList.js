const { CrmMenu } = require("./CrmMenu")
const { AccountingMenu } = require("./AccountingMenu")
const { SaasMenu } = require("./SaaSMenu")
const { EventMenu } = require("./EventMenu")
const {EmailServiceMenu} = require('./EmailServiceMenu')
const AppsList = {    
    list:[        
        {
            id:1,
            name:"客户管理",
            description:"客户管理系统帮您您管理您的客户",
            url:"/crm/mycustomer",
            helpurl:'/service/crm',
        },
        {
            id:2,
            name:"储值记账",
            description:"记账系统帮助您管理客户的余额和消耗情况，可以储值和记录消费情况",
            url:"/accounting/members",
            helpurl:'/service/accounting',
        },
        {
            id:3,
            name:"活动报名",
            description:"活动报名系统可以定制报名页面并且自动生成报名前端页面",
            url:"/event/events",
            helpurl:'/service/event',
        },
        {
            id:4,
            name:"邮件群发",
            description:"邮件群发可以定制邮件模板，选择客户批量发送",
            url:"/email/tasks",
            helpurl:'/service/emailservice',
        },
    ],
    getMenuData:(appid)=>{
        if(appid === 0) return SaasMenu()
        if(appid === 1) return CrmMenu()
        if(appid === 2) return AccountingMenu()
        if(appid === 3) return EventMenu()
        if(appid === 4) return EmailServiceMenu()
    },
    getApp:(appid)=>{        
        if(appid===0) return AppsList.saas
        if(appid===1) return AppsList.crm
        if(appid===2) return AppsList.accounting
        if(appid===3) return AppsList.event
        if(appid===4) return AppsList.emailservice
        
    },
    saas:{
        appid:0,
        name:'saas',
        functree:SaasMenu(),
        default_admin_roleid:1
    },
    crm:{
        appid:1,
        name:'crm',
        functree:CrmMenu(),
    },
    accounting:{
        appid:2,
        name:'accounting',
        functree:AccountingMenu(),
    },
    event:{
        appid:3,
        name:'event',
        functree:EventMenu(),
    },
    emailservice:{
        appid:4,
        name:'event',
        functree:EmailServiceMenu(),
    }
}

module.exports = {AppsList}