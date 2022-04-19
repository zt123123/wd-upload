import axios from 'axios'
import FormData from 'form-data'
import cp from "child_process"
import fs from "fs"
import ansiEscapes from "ansi-escapes"


function main() {
  try {
    const res = cp.execSync("osascript -l JavaScript chooseFile.applescript", {
      encoding: "utf-8"
    })
    const fileList = res.replace(/\n|\s|Path\(\"|\"\)|Path\(\'|\'\)/g, '').split(',')
    Promise.all(fileList.map(upload)).then(urlList => {
      const image = ansiEscapes.image(fs.readFileSync(fileList[0]))
      console.log('\u001b' + image);
      console.log(urlList);
    })
  } catch (error) {
    console.log('error:', error.toString());
  }
}


function upload(file) {
  const form = new FormData();
  form.append('unadjust', String(process.argv[3] || false));
  form.append('token', new Date().getTime());
  form.append('file', fs.readFileSync(file));

  return axios.post('http://vimg.idcvdian.com/upload/v3/direct?scope=img&fileType=image', form, { headers: form.getHeaders() })
    .then((body) => {
      /**
        {
          status: { code: 200, message: 'SUCCESS' },
          result: {
            key: 'img-6b84000001803f38cc080a20e35c-unadjust_64_64.png',
            state: 0,
            uploadId: '6b84000001803f38cc080a20e35c',
            url: 'https://si.geilicdn.com/img-6b84000001803f38cc080a20e35c-unadjust_64_64.png'
          }
        } 
       */
      // console.log(body.data);
      return body.data.result.url
    })
    .catch(function (err) {
      console.log(err);
    });
}

process.on("uncaughtException", () => {
  process.exit(0)
})
process.on("unhandledRejection", () => {
  process.exit(0)
})

export default main
