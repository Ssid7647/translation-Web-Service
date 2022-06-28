
let axios = require('axios');




(async () => {
    let response = await axios('http://localhost:8000/translate/getFile', {
        method: "POST",
        data: {
          uuid:'f11a5120-3ec9-4b58-85d1-6cd9dc4bf759'
        }
    })
    console.log(response.data);
})()