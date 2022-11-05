module.exports.EventMenu = () => {
    return [
        // {
        //     "code": "400",
        //     "isMenu": true,
        //     "items": [
        //         { "code": "400100", "auth": true, "name": "Dashboard", "url": "/event/dashboard", "type": "page", "isMenu": true, "items": [] },
        //     ]
        // },
        {
            "code": "401",
            "isMenu": true,
            "items": [
                { "code": "401100", "name": "活动列表", "url": "/event/events", "type": "page", "isMenu": true, "items": [] },
                // { "code": "401100", "name": "页面模板", "url": "/event/templates", "type": "page", "isMenu": true, "items": [] },                
                // { "code": "401101", "name": "Resources", "url": "/merchant/resources", "type": "page", "isMenu": true, "items": [] },                
            ]
        }

    ]
}