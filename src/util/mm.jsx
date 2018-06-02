
class MUtil{
    request(param){
        return new Promise((resolve,reject) => {
            $.ajax({
                type     : param.type       || 'get',
                url      : param.url        || '',
                dataType : param.dataType   || 'json',
                data     : param.data       || null,
                success  : res => {
                    // Data request succeeded
                    if(0 ===res.status){
                        typeof resolve === 'function' && resolve(res.data,res.msg);
                    }
                    // No login, forced login
                    else if (10 === res.status){
                        this.doLogin();

                    }else{
                        typeof reject === 'function' && reject(res.msg,res.data);
                    }
                },
                error    : err => {
                    typeof reject === 'function' && reject(err.statusText);
                }
            });
        });

    }

    // Jump login
    doLogin(){
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }

    // Get URL parameters
    getUrlParam(name){
        // xxx.com?param=123$param1=456
        let queryString = window.location.search.split('?')[1] || '',
            reg         = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            result      = queryString.match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    }

    // Error message
    errorTips(errMsg){
        alert(errMsg || '好像哪里不对了');
    }

    // Successful tips
    successTips(successMsg){
        alert(successMsg || '操作成功');
    }

    // Store local
    setStorage(name,data){
        let dataType = typeof data;
        // Json object
        if(dataType === 'object'){
            window.localStorage.setItem(name,JSON.stringify(data));
        }
        // Basic types
        else if(['number','string','boolean'].indexOf(dataType)>= 0){
            window.localStorage.setItem(name,data);
        }
        // Other unsupported types
        else{
            alert("Change type cannot be used for local storage");
        }
    }

    // Remove local storage
    getStorage(name){
        let data = window.localStorage.getItem(name);
        if(data){
            return JSON.parse(data);
        }
        else{
            return '';
        }
    }

    // Delete local storage
    removeStorage(name){
        window.localStorage.removeItem(name);
    }
}

export default MUtil;