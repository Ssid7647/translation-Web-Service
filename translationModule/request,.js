let axios = require('axios')


module.exports=async(payload)=>{
    try {
        let response=await axios(payload);
        return response.data;
    } catch (error) {
        return null;
    }
}
