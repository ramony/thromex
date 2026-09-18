console.log('background.ts loaded');

import { load } from 'js-yaml';

const CreateSuccess = (data) => ({ success: true, data: data });
const CreateFail = (errorMsg) => ({ success: false, errorCode: '999', errorMsg: errorMsg });
const CreateJson = (jsonData) => {
    console.log('jsonData.success', jsonData.success)
    if (jsonData.success == undefined) {
        return { success: true, data: jsonData };
    }
    return jsonData;
};

const getHtml = async (endpoint: any, encoding: any) => {
    let params = {
        headers: { 'content-type': "text/html;charset=" + encoding }
    }
    try {
        let res = await fetch(endpoint, params);

        const buffer = await res.arrayBuffer();
        const html = new TextDecoder(encoding).decode(buffer);
        return CreateSuccess(html);
    } catch (e) {
        console.log(endpoint + " getHtml error, " + e)
        return CreateFail(e);
    }
}

const getJSON = async (endpoint) => {
    try {
        const res = await fetch(endpoint, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return CreateSuccess(data);
    } catch (e) {
        console.log(endpoint + " getJSON error, " + e)
        return CreateFail(e);
    }
}

const postJSON = async (endpoint, requestBody) => {
    try {
        const res = await fetch(endpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        const data = await res.json();
        return CreateSuccess(data);
    } catch (e) {
        console.log(endpoint + " postJSON error, " + e)
        return CreateFail(e);
    }
}

const getYaml = async (endpoint) => {
    try {
        const res = await fetch(endpoint, {
            method: 'get',
            headers: {
                'Content-Type': 'application/yaml'
            }
        });
        const content = await res.text();
        const data = load(content);

        const result = CreateJson(data);
        console.log('yaml result', result)

        return result;
    } catch (e) {
        console.log(endpoint + " getJSON error, " + e)
        return CreateFail(e);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'getHtml') {
        (async () => {
            const { endpoint, encoding } = request;
            let data = await getHtml(endpoint, encoding)
            console.log('result data', data.data)
            sendResponse(data);
        })();
        return true;
    } else if (request.type == 'getJSON') {
        (async () => {
            const { endpoint } = request;
            let data = await getJSON(endpoint);
            console.log(JSON.stringify(data))
            sendResponse(data);
        })();
        return true;
    } else if (request.type == 'getYaml') {
        (async () => {
            const { endpoint } = request;
            let result = await getYaml(endpoint);
            sendResponse(result);
        })();
        return true;
    } else if (request.type == 'postJSON') {
        (async () => {
            const { endpoint, rdata } = request;
            let result = await postJSON(endpoint, rdata);
            sendResponse(result);
        })();
        return true;
    }
})