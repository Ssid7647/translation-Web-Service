let modelData = require('../ULCA_Model_test.json');
let axios = require('axios');






let langCodes = {
    Hindi: 'hi',
    English: 'en',
    Marathi: 'mr',
    Assamese: 'as',
    Bengali: 'bn',
    Telugu: 'te',
    Punjabi: 'pa',
    Gujarati: 'gu',
    Malayalam: 'ml',
    Kannada: 'kn',
    Odia: 'or',
    Tamil: 'ta',
    Malyalam: 'ml'
}


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


async function getMetaData(inputLang, outputLang) {
    try {
        let langPairUrls = []
        let langPair = `${inputLang}-${outputLang}`
        for (let datum of modelData) {
            //  console.log( JSON.parse(datum.requestSchema) );
            if (langPair === datum.langPair) {
                langPairUrls.push({ "url": datum.callbackUrl, "payload": JSON.parse(datum.requestSchema), "contributor": datum.contributor })
            }

        }
        return langPairUrls;

    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getPaylaod(text, payload) {
    try {

        payload.input[0].source = text

        return payload

    } catch (error) {
        console.error(error)
        throw error
    }
}

async function getTranslation(url, paylaod) {
    try {

        const response = await axios({
            method: 'post',
            url: url,
            data: paylaod,

        });
        return (await response.data.output);
    } catch (error) {
        return null;
    }
}

async function getTranslatedData(text, urls) {
    try {

        let Translations = [];

        for (let url of urls) {

            let now = Date.now()
            let payload = await getPaylaod(text, url.payload)
            // console.log("payload",payload)
            let translation = await getTranslation(url.url, payload)
            //console.log("translation",translation);
            let responseTime = Date.now() - now
            if (translation === null) {
                Translations.push({ "translation": null, "contributor": url.contributor, "responseTime": null });
            }
            else {
                Translations.push({ "translation": translation, "contributor": url.contributor, "responseTime": `${responseTime} ms.` });
            }
        }
        // console.log(Translations);

        return Translations;
    } catch (error) {

    }
}


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

module.exports = async (data) => {
    try {
        //console.log("ulca data",data);
        let text = data.sentence
        //let inputLang = await toTitleCase(data.sourceLang)
        //let outputLang = await toTitleCase(data.targetLang)
        let urls;
        if (data.sourceLang !== "" && data.targetLang !== "" && text !== "") {
            if (langCodes[toTitleCase(data.sourceLang)] === undefined || langCodes[toTitleCase(data.targetLang)] === undefined) {
                throw new Error("invalid language input")
                return;
            }


            urls = await getMetaData(toTitleCase(data.sourceLang), toTitleCase(data.targetLang));
            //console.log(text)

            if (urls.length === 0) {
                console.log("invalid language pair")
                return;
            }
            //  console.table(urls);
            let output = await getTranslatedData(text, urls);
            let target = []
            output.forEach((response) => {
                target.push(
                    {
                        _contributor: `ulca/${response.contributor}`,
                        _responsetime: `${response.responseTime}`,
                        source:data.sentence,
                        target: response.translation[0].target,
                        
                        _state: "translated"

                    }
                )

            })




            return target;


        }
        else {
            return null;

        }


    } catch (error) {
        return null;
    }
}