module.exports = {
    order_cancel_time:24*3600000,
    verify_code_expired_time:3600000,    //验证码过期时间
    auth_token_expired_time:24*30*3600000,    //登录会话过期时间
    auth_ticket_expired_time:24*3600000,    //app授权会话过期时间
    auth_ticket_expired:false,              //app授权会话是否过期
    auth_client_base_url:'http://localhost/cli/user/',                      //
    app_auth_token_expired_time:60000,      //app临时会话授权过期时间
    email_try_count:3,                      //email发送服务尝试发送次数
    stripe:{
        key:'sk_test_51JdH68GDZjSJ4dWtIwMHMrn09bieIrBgIVvD0solTh4ZamosGD955GOD65nkuVMOOCcfKnqTTp9NLfwJgPx7UnIt00VA55mrmr',
        publick_key:'pk_test_51JdH68GDZjSJ4dWt4LwCGARdAtRlOdo6nEy7uYWVFyj5IKy3usVCKO9c9pd0uqNsDzxE0GWiQ4JIWzqWbrjxLlrT00IRJeZEZS',
        live_key:'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',
        live_public_key:'pk_live_51JdH68GDZjSJ4dWtQEUwW1etPAQpar4D5xeGak9FZTJZhbi5SmlRGJIut6z9xc4pL4ZwnS0ojYQ0jKeUnG2QKQOD00JHJ9v1Bn',
        webhook_key:'whsec_cSNuvw6T1dQc0uZT61QGWVp7FHYTfqaN',
        webhook_public_key:'whsec_AKIgSJLAZvJalZFgAzUpPBiKtbc20gDh'
    },
    mailjet:{
        app_key:'443170009c1144519329dfaada8becfd',
        secret_key:'3958a7fd4a06fbf48288a9d3c2f98244',
    },
    
}