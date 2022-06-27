const mongoose = require('mongoose')

mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`)

var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function () {
    console.log('Database Connection Successfull');
})

const schema = new mongoose.Schema(
    {
        uuid: { type: String, required: true },
        translation: { type: Array },
        percentage: { type: Number },
        status: { type: String },
        sourceLang: { type: String },
        targetLang: { type: String }


    }
)


var Model = mongoose.model('translation', schema);

async function saveData(uuid, translation, percentage, status, sourceLang, targetLang) {
    try {
        let modelData = new Model({
            'uuid': uuid,
            'translation': translation,
            'percentage': percentage,
            'status': status,
            'sourceLang': sourceLang,
            'targetLang': targetLang
        })
        await modelData.save();
        console.log("unit added")
        return true

    } catch (error) {
        console.error(error)
        return false

    }
}

async function appendData(uuid, translation, percentage) {
    try {

        Model.findOne({ 'uuid': uuid }, function (err, response) {
            if (err) {
                return err
            }
            response.translation.push(translation);
            response.percentage = percentage
            response.save()
            console.log("unit added")
            return true

        }).clone().catch(function (err) { console.log(err) }); // to remove redundancy


        return true;
    } catch (error) {
        console.error(error)
        return false

    }
}
async function changeStatus(uuid, status) {
    try {
        Model.updateOne({ 'uuid': uuid }, { "status": status }, function (err, docs) {
            if (err) {
                console.log(err)
                return false
            }
            else {
                console.log("status updated")
                return true
            }
        })


    } catch (error) {
        console.error(error)
        return false
    }
}

async function getData(uuid) {
    try {
        const retrivedData = Model.findOne({ 'uuid': uuid }, function (err, dbResponse) {
            if (err) return (null);
        }).clone().catch(function (err) { console.log(err) });

        return retrivedData

    } catch (error) {
        console.error(error);
        return null
    }
}
module.exports = { saveData, appendData, changeStatus, getData }