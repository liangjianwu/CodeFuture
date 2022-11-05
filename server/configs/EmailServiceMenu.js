module.exports.EmailServiceMenu = () => {
    return [
        {
            "code": "500",
            "isMenu": true,
            "items": [
                { "code": "500100", "auth": true, "name": "Dashboard", "url": "/event/dashboard", "type": "page", "isMenu": true, "items": [] },
            ]
        },
        {
            "code": "501",
            "isMenu": true,
            "items": [
                { "code": "501100", "name": "Customers", "url": "/email/mycustomers", "type": "page", "isMenu": true, "items": [] },
                { "code": "501101", "name": "Tasks", "url": "/email/tasks", "type": "page", "isMenu": true, "items": [] },
                { "code": "501102", "name": "Templates", "url": "/email/templates", "type": "page", "isMenu": true, "items": [] },                                
            ]
        }

    ]
}