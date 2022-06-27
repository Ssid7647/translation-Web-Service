

let langServer = require('./langServer')
let ulca = require('./ulca')
const X2JS = require('x2js')
let generateToken = require('./anuvaad').getAuthToken
let anuvaad = require('./anuvaad').anuvaadTranslation
let generateXml = require('./generateXml.js')
let saveData = require('../database/mongo').saveData
let appendData = require('../database/mongo').appendData
let changeStatus = require('../database/mongo').changeStatus
let createXmlFile = require('./generateXmlFromDB')

let fs = require('fs')
let x2js = new X2JS();
let counter = 0;
let ulcaFailCounter = 0;
let ulcaFailureFlag = false
let anuvaadFailureFlag = false

let anuvaadFailCounter = 0;

async function getTranslation(sentenceArray, sourceLang, targetLang, uuid) {
  try {


    let authToken = await generateToken();
    let percentage = null;
    for (let sentence of sentenceArray) {
      if (ulcaFailCounter===process.env.FAILURE_LIMIT)
      {
        ulcaFailureFlag=true
      }
      if(anuvaadFailCounter===process.env.FAILURE_LIMIT)
      {
        anuvaadFailureFlag=true
      }

        let langServerOutput = await langServer({ 'sentence': sentence, 'sourceLang': sourceLang, 'targetLang': targetLang })
      let ulcaOutput = null
      let anuvaadOutput = null
      if (!ulcaFailureFlag) {
        ulcaOutput = await ulca({ 'sentence': sentence, 'sourceLang': sourceLang, 'targetLang': targetLang });
      }

      if (!anuvaadFailureFlag) {
        anuvaadOutput = await anuvaad({ 'sentence': sentence, 'sourceLang': sourceLang, 'targetLang': targetLang, "token": authToken })
      }

      if (ulcaOutput === null) {
        ulcaFailCounter++
      }
      else {

        ulcaFailCounter = 0
        ulcaOutput.forEach((target) => {
          langServerOutput["trans-unit"]['alt-trans'].push(target);
        })

      }


      if (anuvaadOutput === null) {
        anuvaadFailCounter++
      }
      else {
        anuvaadFailCounter = 0
        langServerOutput["trans-unit"]['alt-trans'].push(anuvaadOutput);

      }



      percentage = parseFloat((++counter / sentenceArray.length) * 100).toFixed(2);
      console.log('percentage', percentage);
      // await generateXml(langServerOutput, sourceLang, targetLang, uuid, counter);
      if (counter === 1) {
        await saveData(uuid, langServerOutput['trans-unit'], percentage, "in process", sourceLang, targetLang)
      }
      else {
        await appendData(uuid, langServerOutput['trans-unit'], percentage)
      }

    }
    await changeStatus(uuid, "completed")
    await createXmlFile(uuid, sourceLang, targetLang);
    console.log("translation complete")

    return true
  } catch (error) {
    console.log(error);
    return false;
  }
}








module.exports = async (data) => {
  try {



    if (Object.keys(data.body).length === 4) {
      let sourceLang = data.body.sourceLang;
      let targetlang = data.body.targetLang;
      let delimiter = data.body.delimiter || process.env.DELIMITER
      console.log(delimiter)
      let sentenceArray = data.body.sentences.split(delimiter);

      if (sentenceArray.length > 0 && sourceLang && targetlang) {

        return await getTranslation(sentenceArray, sourceLang, targetlang, data.uuid)

      }
      else {
        return new Error("Empty Array")
      }
    }
    else {
      return new Error("invalid inputs")
    }

  } catch (error) {
    return new Error('Translation failed');
  }



}