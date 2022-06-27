const express = require('express')
const router = express.Router();
const translate = require('../translationModule/translate')
let path = require('path')
let generateUUID = require('../translationModule/uuidGenerator')
let getTranslation = require('../translationModule/translate')





router.get('/', (req, res) => {
    res.send("ok done!!!");

})
router.post('/', async (req, res) => {
    try {
        let uuid = await generateUUID();
        res.send({
            "uuid": uuid
        })
        await getTranslation({ "body": req.body, "uuid": uuid })
        return
    } catch (error) {
        console.log(error)
        res.send(null)
    }
})
router.post('/getFile', async (req, res) => {
    try {
        

    } catch (error) {
        res.send(error)
    }
})




module.exports = router