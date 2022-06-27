let axios = require('axios');
const fs= require('fs');

let languageCode = {
    "hindi": "hi",
    "english": "en",
    "tamil": "ta",
    "bengali": "bn",
    "assamese": "as",
    "gujarati": "gu",
    "kannada": "kn",  // doughtful
    "malayalam": "ml",
    "marathi": "mr",
    "punjabi": "pa",
    "oriya": "or"
}
let model_id = {
    "hi-en": 100,
    "bn-en": 101,
    "ta-en": 102,
    "en-hi": 103,
    "en-ta": 104,
    "en-as": 110,
    "en-bn": 112,
    "en-gu": 114,
    "en-kn": 116,
    "en-ml": 118,
    "en-mr": 120,
    "en-or": 122,
    "en-pa": 124,
    "en-te": 126,
    "as-en": 128,
    "gu-en": 130,
    "kn-en": 132,
    "ml-en": 134,
    "mr-en": 136,
    "or-en": 138,
    "pa-en": 140,
    "te-en": 142
}


var loginData = JSON.stringify({
    "userName": process.env._USERNAME,
    "password": process.env._PASSWORD
});
var loginConfig = {
    method: 'post',
    url: 'https://users-auth.anuvaad.org/anuvaad/user-mgmt/v1/users/login',
    headers: {
        'Content-Type': 'application/json'
    },
    data: loginData
};

var translationData = {
    "model_id": null,
    "source_language_code": null,
    "target_language_code": null,
    "sentences": [],
    "workflowCode": "WF_S_STR"
};

var translationConfig = {
    method: 'post',
    url: 'https://users-auth.anuvaad.org/anuvaad-etl/wf-manager/v1/workflow/sync/initiate',
    headers: {
        'auth-token': null,
        'Content-Type': 'application/json'
    },
    data: null
};
async function getAuthToken() {
    try {
        let response = await axios(loginConfig);
        return response.data.data;
    } catch (error) {
        return null
    }
}


async function getTranslatedData(payload) {
    try {
        let response = await axios(payload);
        return response.data
    } catch (error) {
        throw error;
    }
}

async function getTranslationPayload(text, sourceLang, targetLang, modelId, authToken) {
    try {
        translationData.model_id = modelId;
        translationData.source_language_code = sourceLang
        translationData.target_language_code = targetLang
        translationData.sentences.push({
            "src": text,
            "s_id": 1
        })


        translationConfig.headers['auth-token'] = authToken;
        translationConfig.data = JSON.stringify(translationData);

        return translationConfig;
    } catch (error) {
        throw error
    }
}

async function getTranslationPayloads(data, sourceLang, targetLang, modelId, authToken) {
    try {
        translationData.model_id = modelId;
        translationData.source_language_code = sourceLang
        translationData.target_language_code = targetLang
        data.forEach((sentence, index) => {
            translationData.sentences.push({
                "src": sentence,
                "s_id": index
            })
        });


        translationConfig.headers['auth-token'] = authToken;
        translationConfig.data = JSON.stringify(translationData);

        return translationConfig;
    } catch (error) {
        throw error
    }
}


async function anuvaadTranslation(data) {

    let text = data.sentence
    let sourceLang = languageCode[data.sourceLang.toLowerCase()];
    let targetLang = languageCode[data.targetLang.toLowerCase()];

    let modelId = model_id[`${sourceLang}-${targetLang}`]
    // console.log(data,modelId );
    if (sourceLang !== undefined && targetLang !== undefined && modelId !== undefined) {
        //  console.log(text, sourceLang, targetLang)
        let now = Date.now()
        let authToken = data.token;
        let translationPayload = await getTranslationPayload(text, sourceLang, targetLang, modelId, authToken.token)

        let translatedData = await getTranslatedData(translationPayload)
       
       // console.log("translation ::",translatedData.output.translations[translatedData.output.translations.length -1])
        return { "_contributor": "anuvaad",source:data.sentence , target: translatedData.output.translations[translatedData.output.translations.length -1].tagged_tgt, _responseTime: `${Date.now() - now} ms.`, _state: "translated" };
       /* for (let translation of translatedData.output.translations) {
            return { "_contributor": "anuvaad", target: translation.tagged_tgt,source:data.sentence , _responseTime: `${Date.now() - now} ms.`, _state: "translated" };
        }*/

        /* translatedData.output.translations.forEach((translation) => {
             return {"contributor":"anuvaad","response":translation.tagged_tgt,"responseTime":`${Date.now()-now} ms.`}
         })*/

    }
    else {
        return null;

    }



}


module.exports={getAuthToken,anuvaadTranslation};