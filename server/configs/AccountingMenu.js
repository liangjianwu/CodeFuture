module.exports.AccountingMenu = () => {
    return [
        // {
        //     "code": "300",
        //     "isMenu": true,
        //     "items": [
        //         { "code": "300100", "auth": true, "name": "Dashboard", "url": "/accounting/dashboard", "type": "page", "isMenu": true, "items": [] },
        //     ]
        // },
        {
            "code": "301",
            "isMenu": true,
            "items": [
                { "code": "301100", "name": "客户管理", "url": "/accounting/members", "type": "page", "isMenu": true, "items": [] },
                { "code": "301101", "name": "快速扣费", "url": "/accounting/quickcharge", "type": "page", "isMenu": true, "items": [] },
                { "code": "301102", "name": "交易记录", "url": "/accounting/transactions/0", "type": "page", "isMenu": true, "items": [] },
                { "code": "301103", "name": "产品和服务", "url": "/accounting/products", "type": "page", "isMenu": true, "items": [] },                

            ]
        }

    ]
}