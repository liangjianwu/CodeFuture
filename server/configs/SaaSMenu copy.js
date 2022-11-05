module.exports.SaasMenu = () => {
    return [
        // {
        //     "code": "100",
        //     "isMenu": true,
        //     "auth": true,
        //     "items": [
        //         { "code": "100100", "auth": true, "name": "所有服务", "url": "/service/dashboard", "type": "page", "isMenu": true, "items": [] },
        //     ]
        // },
        // {
        //     "code": "101",
        //     "isMenu": true,
        //     "auth": true,
        //     "name": "Services",
        //     "items": [
        //         { "code": "101001", "name": "客户管理", "url": "/service/crm", "type": "page", "isMenu": true, "items": [] },
        //         { "code": "101002", "name": "储值记账", "url": "/service/accounting", "type": "page", "isMenu": true, "items": [] },
        //         { "code": "101003", "name": "活动报名", "url": "/service/event", "type": "page", "isMenu": true, "items": [] },
        //         { "code": "101004", "name": "邮件群发", "url": "/service/email", "type": "page", "isMenu": true, "items": [] },
        //     ]
        // },
        {
            "code": "201",
            "auth": true,
            "isMenu": true,
            "items": [
                { "code": "201100", "auth": true, "name": "学员管理", "url": "/crm/dashboard", "type": "page", "isMenu": true, "items": [] },
            ]
        },
        {
            "code": "301",
            "auth": true,
            "isMenu": true,
            "name":"私课管理",
            "items": [
                { "code": "301100","auth": true, "name": "学员储值", "url": "/accounting/members", "type": "page", "isMenu": true, "items": [] },
                { "code": "301101","auth": true, "name": "快速扣费", "url": "/accounting/quickcharge", "type": "page", "isMenu": true, "items": [] },
                { "code": "301102","auth": true, "name": "交易记录", "url": "/accounting/transactions/0", "type": "page", "isMenu": true, "items": [] },
                { "code": "301103","auth": true, "name": "产品和服务", "url": "/accounting/products", "type": "page", "isMenu": true, "items": [] },                

            ]
        },
        {
            "code": "401",
            "auth": true,
            "isMenu": true,
            "name":"活动",
            "items": [
                { "code": "401100","auth": true, "name": "活动列表", "url": "/event/events", "type": "page", "isMenu": true, "items": [] },
                // { "code": "401100", "name": "页面模板", "url": "/event/templates", "type": "page", "isMenu": true, "items": [] },                
                // { "code": "401101", "name": "Resources", "url": "/merchant/resources", "type": "page", "isMenu": true, "items": [] },                
            ]
        },
        {
            "code": "501",
            "isMenu": true,
            "name":"邮件",
            "auth":true,
            "items": [
                // { "code": "501100", "name": "Customers", "url": "/email/mycustomers", "type": "page", "isMenu": true, "items": [] },
                { "code": "501101","auth": true, "name": "邮件群发", "url": "/email/tasks", "type": "page", "isMenu": true, "items": [] },
                { "code": "501102","auth": true, "name": "邮件模板", "url": "/email/templates", "type": "page", "isMenu": true, "items": [] },                                
            ]
        },
        {
            "code": "900",
            "auth": true,
            "isMenu": true,
            "name": "设置",
            "items": [
                {
                    "code": "900001", auth: true, "name": "我的账号", "type": "entrance", "url": "/service/user", "isMenu": true, "hasSubmenu": true, "items": [
                        {
                            "code": "900001001", "auth": true, "name": "个人信息", "url": "/service/user/profile", "type": "page", "isMenu": true, "items": [
                                { "code": "900001001001", "auth": true, "name": "EmailVerify", "url": "/service/user/emailverify", "type": "page", "isMenu": false, "items": [] }
                            ]
                        },
                        { "code": "900001002", "auth": true, "name": "设置", "url": "/service/user/setting", "type": "page", "isMenu": true, "items": [] }
                    ]
                },
                {
                    "code": "900002", "auth": true, "name": "商户", "url": "/service/merchant", "type": "entrance", "isMenu": true, "hasSubmenu": true, "items": [
                        { "code": "900002001", "auth": true, "name": "首页", "url": "/service/merchant/home", "type": "page", "isMenu": true, "items": [] },
                        // { "code": "900002002", "name": "商户信息", "url": "/service/merchant/profile", "type": "page", "isMenu": true, "items": [] },
                        // { "code": "900002003", "name": "账号管理", "url": "/service/merchant/accounts", "type": "page", "isMenu": true, "items": [] }
                    ]
                }
            ]
        },
    ]
}