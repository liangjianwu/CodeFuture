module.exports.CrmMenu = () => {
    return [
        {
            "code": "201",
            "isMenu": true,
            "items": [
                { "code": "201100", "auth": true, "name": "客户管理", "url": "/crm/dashboard", "type": "page", "isMenu": true, "items": [] },
            ]
        },
        // {
        //     "code": "200",
        //     "isMenu": true,
        //     "items": [
        //         { "code": "200100", "name": "My Customers", "url": "/crm/mycustomer", "type": "page", "isMenu": true, "items": [] },
        //         // { "code": "200102", "name": "Tasks", "url": "/crm/task", "type": "page", "isMenu": true, "items": [] },
        //         // { "code": "200103", "name": "Calendar", "url": "/crm/calendar", "type": "page", "isMenu": true, "items": [] },
        //         // { "code": "200104", "name": "Templates", "url": "/crm/template", "type": "page", "isMenu": true, "items": [] },

        //     ]
        // }

    ]
}

