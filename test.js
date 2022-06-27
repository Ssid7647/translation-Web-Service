

let axios = require('axios');




(async () => {
    let response = await axios('http://localhost:8000/translate', {
        method: "POST",
        data: {
            "sourceLang": 'english',
            'targetLang': "marathi",
            "delimiter":"(^)",
            'sentences': `It has been felt necessary to put up and promote a unified, empowered, robust, bundled and technology driven platform for helping and promoting the Micro, Small and Medium Enterprises (MSMEs) of the country.(^) As the name suggests it will aim at Creation and Harmonious Application of Modern Processes for Increasing the Output and National Strength.(^) Accordingly, the name of the system is CHAMPIONS.(^) This is basically for making the smaller units big by helping and handholding, in particular, by solving their problems and grievances.(^)The XLIFF Technical Committee is currently preparing to start working on XLIFF Version 2.2.(^) Prior to making of the major new version 2.0, feedback was gathered from XLIFF's user community which was integrated into the following generation version of the standard.(^) Two of the primary methods used included compiling a list of extensions used by XLIFF toolmakers, and compiling a list of XLIFF features supported by each XLIFF tool.`
        }
    })
    console.log(response.data);
})()