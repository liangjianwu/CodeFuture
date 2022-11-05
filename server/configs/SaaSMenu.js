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
        
        {
            "code": "301",
            "auth": true,
            "isMenu": true,
            "name":"Accounting",
            "items": [
                { "code": "301000", "auth": true, "name": "Families", "url": "/member/familys", "type": "page", "isMenu": true, "items": [] },
                { "code": "301001", "auth": true, "name": "Members", "url": "/member/members", "type": "page", "isMenu": true, "items": [] },
                { "code": "301100","auth": true, "name": "Balance", "url": "/accounting/balance", "type": "page", "isMenu": true, "items": [] },
                { "code": "301101","auth": true, "name": "Quick order", "url": "/accounting/quickcharge", "type": "page", "isMenu": true, "items": [] },
                { "code": "301102","auth": true, "name": "Transactions", "url": "/accounting/orders/0/0", "type": "page", "isMenu": true, "items": [] },
                { "code": "301105","auth": true, "name": "Report", "url": "/report", "type": "entrance", "isMenu": true,hasSubmenu:true, "items": [
                    { "code": "301105001","auth": true, "name": "Coaches", "url": "/report/coaches", "type": "page", "isMenu": true, "items": [] },                
                    { "code": "301105002","auth": true, "name": "Recharge", "url": "/report/recharge", "type": "page", "isMenu": true, "items": [] },                    
                ] },                

            ]
        },    
        {
            "code": "201",
            "auth": true,
            "isMenu": true,
            "name":"Informations",
            "items": [
                { "code": "201101","auth": true, "name": "Balance Snapshot", "url": "/accounting/balancesnapshot", "type": "page", "isMenu": true, "items": [] },                
                { "code": "201102","auth": true, "name": "Products", "url": "/accounting/products", "type": "page", "isMenu": true, "items": [] },                
                { "code": "201103","auth": true, "name": "Coaches", "url": "/coach/coaches", "type": "page", "isMenu": true ,"items":[]},       
                { "code": "201105","auth": true, "name": "Schedule", "url": "/coach/schedule/0/0", "type": "page", "isMenu": true ,"items":[]}, 
            ]
        },   
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
            "code": "501",
            "isMenu": true,
            "name":"Tools",
            "auth":true,
            "items": [
                // { "code": "501100", "name": "Customers", "url": "/email/mycustomers", "type": "page", "isMenu": true, "items": [] },
                { "code": "501101","auth": true, "name": "Mass mailing ", "url": "/email/tasks", "type": "page", "isMenu": true, "items": [] },
                { "code": "501102","auth": true, "name": "Email template", "url": "/email/templates", "type": "page", "isMenu": true, "items": [] },                                
                { "code": "501103","auth": true, "name": "Events", "url": "/event/events", "type": "page", "isMenu": true, "items": [] },                
            ]
        },
        {
            "code": "900",
            "auth": true,
            "isMenu": true,
            "name": "Setting",
            "items": [
                {
                    "code": "900001", auth: true, "name": "Setting", "type": "entrance", "url": "/service/user", "isMenu": true, "hasSubmenu": true, "items": [
                        { "code": "900001001", "auth": true, "name": "My profile", "url": "/service/user/profile", "type": "page", "isMenu": true, "items": []},
                        { "code": "900001002", "auth": true, "name": "Reset password", "url": "/service/user/setting", "type": "page", "isMenu": true, "items": [] },               
                        { "code": "900001003", "auth": true, "name": "My company", "url": "/service/merchant/home", "type": "page", "isMenu": true, "items": [] },
                        { "code": "900001004", "auth": true, "name": "Member", "url": "/member/setting", "type": "page", "isMenu": true, "items": [] },
                        // { "code": "900002002", "name": "商户信息", "url": "/service/merchant/profile", "type": "page", "isMenu": true, "items": [] },
                        // { "code": "900002003", "name": "账号管理", "url": "/service/merchant/accounts", "type": "page", "isMenu": true, "items": [] }
                    ]
                }
            ]
        },
    ]
}

module.exports.SaasFirstMenu = () => {
    return [
        {
            "code": "900",
            "auth": true,
            "isMenu": true,
            "name": "Setting",
            "items": [
                {
                    "code": "900001", auth: true, "name": "Setting", "type": "entrance", "url": "/service/user", "isMenu": true, "hasSubmenu": true, "items": [
                        { "code": "900001001", "auth": true, "name": "My profile", "url": "/service/user/profile", "type": "page", "isMenu": true, "items": []},
                        { "code": "900001002", "auth": true, "name": "Reset password", "url": "/service/user/setting", "type": "page", "isMenu": true, "items": [] },               
                        { "code": "900001003", "auth": true, "name": "My company", "url": "/service/merchant/home", "type": "page", "isMenu": true, "items": [] },
                        // { "code": "900002002", "name": "商户信息", "url": "/service/merchant/profile", "type": "page", "isMenu": true, "items": [] },
                        // { "code": "900002003", "name": "账号管理", "url": "/service/merchant/accounts", "type": "page", "isMenu": true, "items": [] }
                    ]
                }
            ]
        },
    ]
}