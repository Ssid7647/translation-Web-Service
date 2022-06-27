let path = require('path')
let fs = require('fs')
let X2JS = require('x2js')
const { json } = require('express')



let data = `<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file datatype="plaintext" original="FFF62096-095B-4C44-60E1-08D86108CFCE" source-language="eng" target-language="hin">
    <header>
      <skl>
        <external-file href="FFF62096-095B-4C44-60E1-08D86108CFCE_skl" />
      </skl>
    </header>
    <body>
    <trans-unit approved="no" id="0" translate="yes" xml:space="preserve">
    <source xml:lang="eng">C-DAC Centre @ Delhi</source>
    </trans-unit>
   
    </body>
  </file>
</xliff>`

let x2js = new X2JS()
let uuid = '6b6c830a-1a6f-475f-b7ca-4c0fa1d47'
let dirPath = path.join('..', "translationFiles", uuid);
console.log(dirPath);

let filepath = path.join('..', 'translationFiles', uuid, `${uuid}.xlf`)
if (fs.existsSync(dirPath)) {
    console.log("folder exist")
}
else {
    fs.mkdirSync(dirPath, { recursive: true });
}

fs.writeFileSync(filepath, data, { encoding: "utf-8" });
