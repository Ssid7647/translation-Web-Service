const X2JS = require('x2js')
let fs = require('fs')
let x2js = new X2JS();
let path = require('path');
let getData=require('../database/mongo').getData

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

let xliffJson = {
    xliff: {
        file: {
            header: {
                skl: {
                    'external-file': { _href: null }
                }
            },
            body: { 'trans-unit': [] },
            _datatype: 'plaintext',
            _original: null,
            '_source-language': null,
            '_target-language': null
        },
        _version: '1.2',
        _xmlns: 'urn:oasis:names:tc:xliff:document:1.2'
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




module.exports=async(uuid,sourceLang,targetLang)=>{
    try {
        let dirPath = path.join("translationFiles", uuid);
        let filePath = path.join("translationFiles", uuid, `${uuid}.xlf`)
        
        xliffJson.xliff.file['_source-language'] = langCode[toTitleCase(sourceLang)]
        xliffJson.xliff.file['_target-language'] = langCode[toTitleCase(targetLang)]

       //xliffJson.xliff.file.body['trans-unit'].push(translation['trans-unit']);
       let dbData=await getData(uuid)
       if(dbData!==null)
       {
        xliffJson.xliff.file.body['trans-unit']=dbData.translation;
       }
      else{
        throw new Error("!!! Error in file creation !!!!")
       
      }

        console.log(xliffJson.xliff.file.body['trans-unit'].length)
        let xmlData = x2js.js2xml(xliffJson);
        // console.log("xmlData",xmlData)
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
        }
        fs.writeFileSync(filePath, xmlData, "utf-8")

        console.log('!!! File created !!!'  , filePath);
        
    } catch (error) {
        console.error(error)
        throw error
    }
}