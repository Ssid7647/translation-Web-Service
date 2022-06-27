var axios = require('axios');
let qs = require('qs');
let langCode = {
    Arabic: 'ara',
    Assamese: 'asm',
    Bengali: 'ben',
    Boro: 'brx',
    Chinese: 'chi',
    Dogri: 'doi',
    Dzongkha: 'dzo',
    English: 'eng',
    French: 'fre',
    German: 'ger',
    Gujarati: 'guj',
    Hindi: 'hin',
    Japanese: 'jpn',
    Kannada: 'kan',
    Kashmiri: 'kas',
    KashmiriPA: 'ksp',
    Konkani: 'kok',
    Korean: 'kor',
    Maithili: 'mai',
    Malayalam: 'mal',
    Manipuri: 'mni',
    Marathi: 'mar',
    MeeteiMayek: 'met',
    Modi: 'mod',
    Nepali: 'nep',
    OLCHIKI: 'olc',
    Oriya: 'ori',
    Punjabi: 'pan',
    Russian: 'rus',
    Sanskrit: 'san',
    Santali: 'sat',
    Sindhi: 'snd',
    SindhiPA: 'sdp',
    Spanish: 'spa',
    Tamil: 'tam',
    Telugu: 'tel',
    Tenyidie: 'ten',
    Urdu: 'urd'
}


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
/*{
  sentence: `I've Just Seen a Face" is a Beatles song written and sung by Paul McCartney (pictured), first released on the album Help! in August 1965.`,
  sourceLang: 'english',
  targetLang: 'hindi'
} */

module.exports = async (data) => {
    try {
        // console.log("lang server data",data)
        /// console.log( langCode[toTitleCase(data.sourceLang)])
        let now = Date.now();
        var payload = qs.stringify({
            'sText': data.sentence,
            'tLocale': langCode[toTitleCase(data.targetLang)],
            'clientID': 'Testing',
            'mapID': 'cdac.in',
            'delimiter': '[@#$]',
            'sLocale': langCode[toTitleCase(data.sourceLang)]
        });
        //  console.log("payload", payload)
        var config = {
            method: 'post',
            url: 'https://gistlangserver.in/api/Leveraging/GetLeverage',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            'data': payload,
            timeout: 500
        };

        //console.log("config", config);
        let response = await axios(config);
        let responseTime = Date.now() - now
        
    
        let translation = response.data.response.split('(^)')[0]
      /*  console.log("String ::" ,data.sentence)
        console.log("translation :",translation.replace(/\d$/, ''))*/
        if (translation.endsWith('0')) {
            return {
                "trans-unit": {
                    source: {
                        '_xml:lang': 'eng',
                        __text: data.sentence,

                    },
                    
                    target: {

                        _state: 'translated',
                        _contributor: "GIST Langserver,CDAC-Pune",
                        _responseTime: `${responseTime} ms.`,
                        __text: translation.replace(/\d$/, ''),
                    },
                    "alt-trans": [],
                    _approved: 'no',

                    _translate: 'yes',
                    '_xml:space': 'preserve'
                }

            }

        }
        return {
            "trans-unit": {
                source: {
                    '_xml:lang': 'eng',
                    __text: data.sentence,

                },
                
                target: {

                    _state: 'untranslated',
                    _contributor: "GIST Langserver,CDAC-Pune",
                    _responseTime: null,
                    __text: " ",
                },
                "alt-trans": [],
                _approved: 'no',

                _translate: 'no',
                '_xml:space': 'preserve'
            }

        }





    } catch (error) {
       
        return {
            "trans-unit": {
                source: {
                    '_xml:lang': 'eng',
                    __text: data.sentence,

                },
                target: {

                    _state: 'untranslated',
                    _contributor: "GIST Langserver,CDAC-Pune",
                    _responseTime: null,
                    __text: " ",

                },
                "alt-trans": [],
                _approved: 'no',

                _translate: 'no',
                '_xml:space': 'preserve'
            }

        }
    }
}