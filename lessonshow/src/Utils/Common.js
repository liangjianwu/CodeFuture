import { hex_md5 } from 'react-native-md5'
const apiResult = (ret, successCallback, failCallback, fieldCheckCallback) => {
    if (ret.status === 200 && ret.data.success) {
        successCallback(ret.data.data)
    } else {
        if (ret.data.data.errcode === 990000) {
            let es = {}
            ret.data.data.errors.map((item) => {
                es = { ...es, [item.param]: item.msg }
                return true
            })
            fieldCheckCallback ? fieldCheckCallback(es) : failCallback('Parameters error')
        } else if ([900002, 900003, 900004].indexOf(ret.data.data.errcode) >= 0) {
            setUserSession()
            window.location.href = "/user/signin"
        } else {
            failCallback(ret.data.data.error)
        }
    }
}
const formToJson = (formData) => {
    const data = {};
    formData.forEach((value, key) => {
        data[key] = key === 'passwd' ? hex_md5(value) : value
    });
    return data;
}

const sessionSet = (key, value) => {
    console.log([key, value])
    if (!value) {
        console.log(["1", key, value])
        sessionStorage.removeItem(key)
        return
    }
    const data = { data: value }
    sessionStorage.setItem(key, JSON.stringify(data))
}
const sessionGet = (key) => {
    let value = sessionStorage.getItem(key)
    value = value ? JSON.parse(value) : value
    return value ? value.data : value
}
const cacheSet = (key, value) => {
    if (!value) {
        localStorage.removeItem(key)
        return
    }
    localStorage.setItem(key, JSON.stringify({ data: value }))
}

const cacheGet = (key) => {
    let value = localStorage.getItem(key)
    value = value ? JSON.parse(value) : value
    return value ? value.data : value
}
const getUserSession = (apis) => {
    let session = sessionGet('member_session')
    session = session ? session : cacheGet('member_session')
    //console.log([session.expired_time,Date.now()])
    if (session && session.expired_time < Date.now()) {
        sessionSet('member_session', undefined)
        cacheSet('member_session', undefined)
        return undefined
    }
    if (session && apis) {
        const time = Date.now()
        apis.setHeader('request-userid', session.userid)
        apis.setHeader('request-appid', 0)
        apis.setHeader('request-token', hex_md5(session.token + time))
        apis.setHeader('request-time', time)
    }
    return session
}
const setUserSession = (data, cache = false) => {
    sessionSet('member_session', data)
    const session = cacheGet('member_session')
    if (session && session.expired_time > Date.now()) {
        cacheSet('member_session', data)
    } else if (cache) {
        cacheSet('member_session', data)
    }

}
const getVarsFromString = (str, symbol) => {
    const arrs = str.split(symbol)
    const rets = []
    for (let i = 0; i < arrs.length; i++) {
        i % 2 === 1 && rets.push(arrs[i])
    }
    return rets
}

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}


function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

export { apiResult, formToJson, sessionSet, sessionGet, cacheSet, cacheGet, getUserSession, setUserSession, getVarsFromString, formatDate, copyTextToClipboard }