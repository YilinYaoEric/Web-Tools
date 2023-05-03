/*
@Yilin Yao
2023/4/9
This file is for implementing methods to connect the server
and the front end
*/


const BASE_URL = 'http://localhost:8000/'


// Test needed
const create_user = (username, password) => {
    let data = new FormData();
    data.append('username', username);
    data.append('password', password);
    let ret = null;
    let succesed = 0;
    fetch(BASE_URL + 'user/create', {method: "POST", body: data})
        .then(statusCheck)
        .then(res => {succesed = 1; ret = res})
        .catch(err => (ret = err))
    succesed = ret === 'Created';
    return [succesed, ret];
}

const log_in_attempt = (username, password) => {
    const data = {
        username: username,
        password: password
    }
    let ret = null;
    let succesed = 0;
    fetch(BASE_URL + 'user/create', {method: "POST", body: data})
        .then(statusCheck)
        .then(res => {succesed = 1; ret = res})
        .catch(err => (ret = err))
    succesed = ret === 'Passed';
    return [succesed, ret];
}


const get_main_data = (username, password, set_main_data) => {
    if (!username || !password) {return}
    fetch(BASE_URL + "user/" + username + '/' + password)
        .then((res) => {
            if(res.status === 400){
                throw new Error(res.text())
            }
            return res
        })
        .then(statusCheck)
        .then(async (res) => {return await JSON.parse(await res.text());})
        .then((res) => {console.log(res); return res;})
        .then(res => {
            set_main_data(JSON.parse(res)); 
            return res;
        })
        .catch(err => {console.log(err)}) // TODO: implement
}


const update_main_data = (username, password, main_data) => {
    if (!username || !password || !main_data) {
        return
    }
    let data = new FormData();
    data.append('username', username);
    data.append('password', password);
    data.append('properties', main_data)

    fetch(BASE_URL + 'user/update_status', {method: "POST", body: data})
        .then(res => {if(res.status === 400){throw new Error('Incorrect Password')} return res;})
        .catch(err => (console.log(err)))
}


const update_password = (username, password, new_pass) => {
    const data = {
        username: username,
        password: password,
        properties: new_pass
    }
    let ret = null;
    let succesed = 0;
    fetch(BASE_URL + 'user/update_password', {method: "POST", body: data})
        .then(statusCheck)
        .then(res => {succesed = 1; ret = res})
        .catch(err => (ret = err))
    succesed = ret === 'Successed';
    return [succesed, ret];  
}


/**
 * Check the status of the response and throw error if the ok is false.
 * @param {promise} response - the promise made by any fetch
 * @returns {response} return the promise made by fetch.
 */
async function statusCheck(response) {
    if (!response.ok) {
        throw new Error(await response.text());
    }
    return response;
}

export {create_user, log_in_attempt, get_main_data, update_main_data, update_password}