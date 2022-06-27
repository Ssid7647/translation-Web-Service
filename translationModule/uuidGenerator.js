let uuid=require('uuid')


module.exports=async()=>{
    try {
        
        return uuid.v4();
    } catch (error) {
        console.log(error)
        return null
    }
}

