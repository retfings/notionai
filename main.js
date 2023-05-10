const { NotionAI, TOPICS, TONE, LANGUAGE } = require('@cyh0809/notionai');
const fs = require('fs');
const showdown = require('showdown');
const { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = require('node-html-markdown');
const filePath = 'errIndex.txt';
const writeStream = fs.createWriteStream(filePath);
// const notionAI =new NotionAI('v02%3Auser_token_or_cookies%3AJURwncce5rjoDO_SUONJYuGj5tfSlG-A1GECgXiTIRYvUTBWoJr3DhVxaP3dWNGKCwjz2mdUMLDlOQSUkcnNUUZa0330lqCw--cJzAhCecmluXvwB6z7gJHGmVq98jV3eXjq','32b5fe7a-8485-4cbd-b678-686a3b7ccd02')
const notionAI = new NotionAI('v02%3Auser_token_or_cookies%3AghLNDMAN1kRuevtgnq1c0VzdoJTQdmjaDpV7wZdNlo1wCLVcZsmEtqO4iReTnKefofkhY1_DiftGA31iWeiFFg0lYdo1_TgSQG6vPNH8aV2UkEostEaW9NcEN0OEM6DTGvLN', '3133fae2-38d4-481d-9fc2-3bfc3df0325e');
const nhm = new NodeHtmlMarkdown(
  /* options (optional) */ { useInlineLinks: false },
  /* customTransformers (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined
);
const converter = new showdown.Converter();
converter.setOption('tables', true);
const XLSX = require('xlsx');
const { assert, log } = require('console');
const workbook1 = XLSX.readFile('Wikiaitools(1).xlsx');
const sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
const datas1 = XLSX.utils.sheet_to_json(sheet1);

const workbook2 = XLSX.readFile('Wikiaitools(2).xlsx');
const sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
const datas2 = XLSX.utils.sheet_to_json(sheet2);

let requestErrCount = 0
let requestErrNameList = []
console.log(`the length of data1 is ${datas1.length}`);
console.log(`the length of data2 is ${datas2.length}`);
let datas = datas1.concat(datas2) 
console.log(`the length of data is ${datas.length}`);
// list 过滤
const files = fs.readdirSync('html');
function removeDuplicates(arr) {
  return arr.filter((item,
  index) => arr.indexOf(item) === index);
  }
datas = removeDuplicates(datas)
console.log(`the length of data removeDuplicates is ${datas.length}`);



// datas = datas.slice(10000,datas.length - 1)
// datas.forEach((e,di) => {
//   if (files.includes(e.name.split(/[\t\r\f\n\s]*/g).join('').replaceAll("?","")+".html")){
//     datas = datas.filter(function(n,i){return i !== di})
//   }
//   // console.log(e.name.split(/[\t\r\f\n\s]*/g).join(''));
  
// })
console.log(`the length of data filter is ${datas.length}`);
i = 0
for ( const d of datas){
  i ++;
  console.log(d.name);
  if ( i >5 ){
    break
  }
}


function writeXLSX(data) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, "new.xlsx");
}

function MarkdownTohtml(markdown) {
  return converter.makeHtml(markdown);
}

function htmlToMarkdown(html) {
  return nhm.translate(html);
}



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function delay(){
  if (requestErrCount > 10){
    return ( Math.floor((Math.random()*1000)+1)   +  (Math.floor((Math.random()*10000)+1) + 1)  * 1000 + Math.floor((Math.random()*100000)+1))
  }
  return ((( requestErrCount + 1 ) * (requestErrCount + 1) ) * 10000 + Math.floor((Math.random()*1000000)+1))
}

async function translate(markdown, name) {
  // console.log("exec translate " + name);
  if (files.includes(`${name}.html`)){
    console.log(`has ${name}.html return`);
    return
  }
  try {
    let reqRes = await notionAI.translateText(LANGUAGE.chinese, markdown);
    // console.log("exec in await " + name);
    reqRes = reqRes.replaceAll("！", "!").replaceAll("", "")
    reqRes = MarkdownTohtml(reqRes)
    if (reqRes.includes("table")) {
      // let s = {}
      // s['name'] = name
      // s['info_cn'] = reqRes
      // xlsxData.push(s)
      // console.log(xlsxData.length);

      // writeXLSX(xlsxData);
      if (requestErrNameList.includes(name)){
        requestErrNameList.pop(name)
        if (requestErrCount < 0) {requestErrCount = 0}
        requestErrCount -= 1
      }

      fs.writeFile('html/' + name + '.html', reqRes, (err) => {
        if (err){
          console.log(err);
        }
        else{
          console.log(`${name} has been saved`);
        }

        
      });

    }
    if (!reqRes.includes("table")){

      if (!requestErrNameList.includes(name)){
        requestErrNameList.push(name)
        requestErrCount += 1
      }

      
      let lastTime = delay()
      console.log(`Not Table :exec request ${name} after ${Math.floor(lastTime / 1000)} s`);
      console.log(reqRes);
      sleep(lastTime).then(() => {
        translate(markdown, name);
      });
    }

  } catch (err) {
    // if ();
    // console.log(err);
    // console.log(name + ' faild, try request ' );
    if (!requestErrNameList.includes(name)){
      requestErrNameList.push(name)
      requestErrCount += 1
    }
    let lastTime = delay()
    console.log(`With Err : ${err} \n exec request ${name} after ${Math.floor(lastTime / 1000)} s`);
    sleep(lastTime).then(() => {
      translate(markdown, name);
    });
  }
}

function loopdelay(){
  let s = 1000
  let requestDelay = delay()
  if (requestDelay < 10 * s){
    return 3 * s
  }
  if (10 * s  < requestDelay < 50 * s ){
    return 6 * s
  }
  if (50 * s  < requestDelay < 500 * s ){
    return 9 * s
  }
  if (500 * s  < requestDelay < 5000 * s ){
    return 12 * s
  }
  if (500 * s  < requestDelay < 5000 * s ){
    return 15 * s
  }
  if (5000 * s  < requestDelay < 50000 * s ){
    return 18 * s
  }
  return 21 * s
}


var i = 0;       
let d = 1500           
errIndex = []
function myLoop() {         
  setTimeout(function() { 
    if (i % 100 == 0){
      console.log(`exec index: ${i}`); 
    }
    if ( i === 60){
      // 
      // d =  40000
    }  
    if (!datas[i].info.includes("table")) {
      try{
        console.log(datas[i].name + "check !!! has not table tag")
        errIndex.push(i)
        for (let i = 0; i < errIndex.length; i++) {
          writeStream.write(errIndex[i] + '\n');
        }
        i++
      }
      catch(err){
        console.log(err);
      }
    }
    let md = htmlToMarkdown(datas[i].info)
    md = md.replaceAll("[ ![", "![").replaceAll(" ](javascript:void%280%29;) ", "").replaceAll("\\.", ".")
    // fs.writeFile('md/' + datas[i].name.split(/[\t\r\f\n\s]*/g).join('').replaceAll("?","") + '.md', md, (err) => {
    //   if (err) {
    //     console.log(err);
    //   };
    // });
    sleep(1000).then(() => {
      translate(md, datas[i].name.split(/[\t\r\f\n\s]*/g).join('').replaceAll("?",""));
    });
    i ++ ;                  
    if (i < datas.length) {           
      myLoop();             
    }                       
  }, d)
}



myLoop();                   