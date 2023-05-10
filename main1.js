const { NotionAI, TOPICS, TONE, LANGUAGE } = require('@cyh0809/notionai');
const fs = require('fs');
const showdown = require('showdown');
const { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } = require('node-html-markdown');
const filePath = 'errIndex.txt';
const writeStream = fs.createWriteStream(filePath);
// const notionAI =new NotionAI('v02:user_token_or_cookies:JURwncce5rjoDO_SUONJYuGj5tfSlG-A1GECgXiTIRYvUTBWoJr3DhVxaP3dWNGKCwjz2mdUMLDlOQSUkcnNUUZa0330lqCw--cJzAhCecmluXvwB6z7gJHGmVq98jV3eXjq','32b5fe7a-8485-4cbd-b678-686a3b7ccd02')
const notionAI = new NotionAI('v02%3Auser_token_or_cookies%3AghLNDMAN1kRuevtgnq1c0VzdoJTQdmjaDpV7wZdNlo1wCLVcZsmEtqO4iReTnKefofkhY1_DiftGA31iWeiFFg0lYdo1_TgSQG6vPNH8aV2UkEostEaW9NcEN0OEM6DTGvLN', '3133fae2-38d4-481d-9fc2-3bfc3df0325e');
const nhm = new NodeHtmlMarkdown(
  /* options (optional) */ { useInlineLinks: false },
  /* customTransformers (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined
);
const converter = new showdown.Converter();
converter.setOption('tables', true);
const XLSX = require('xlsx');



const workbook = XLSX.readFile('./all.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
let datas = XLSX.utils.sheet_to_json(sheet);

let requestErrCount = 0
let requestErrNameList = []


console.log(`the length of data is ${datas.length}`);
// list 过滤
const files = fs.readdirSync('html');
// function removeDuplicates(arr) {
//   return arr.filter((item,
//   index) => arr.indexOf(item) === index);
//   }
// datas = removeDuplicates(datas)
console.log(`the length of data removeDuplicates is ${datas.length}`);

let start_i = 7950;  
let Index_end = datas.length -1;
datas = datas.slice(start_i,Index_end);
// datas
// datas.forEach((e,di) => {
//   if (files.includes(e.name.split(/[\t\r\f\n\s]*/g).join('').replaceAll("?","")+".html")){
//     datas = datas.filter(function(n,i){return i !== di})
//   }
//   // console.log(e.name.split(/[\t\r\f\n\s]*/g).join(''));
  
// })
console.log(`the length of data filter is ${datas.length}`);
console.log(`the start index is  ${start_i}`);
console.log(`the end index is  ${Index_end}`);
// i = 0
// for ( const d of datas){
//   i ++;
//   console.log(d.name);
//   if ( i >5 ){
//     break
//   }
// }
start_i = 0;

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
  let d = 20000
  if (Index_end - start_i < 5){
    return d
  }
  if (requestErrCount > 3){
    d = Math.floor((Math.random() * 50 ) + 50 ) * 1000
    return d
  }
  d = Math.floor((Math.random() * 20 ) + 10 ) * 1000
  return d
}



function limit(list,limit,name){
  console.log(`error list:${list}`);
  let count = 0;
  for(let i = 0; i < list.length; i++) {
    if(list[i] === name) {
      count++;
    }
  }
  if(count >= limit) {
    console.log(`> limit:${limit}`);
    return true
  }
  if(count < limit) {
    console.log(`< limit:${limit}`);
    return false
  }
}

async function translate(markdown, name) {

  if (start_i === Index_end-1){
    let p = new Promise(resolve => {
      setTimeout(resolve, 10 * 60 * 1000) 
    })
    p.then(() => {
      process.exit()
    })
  }

  // console.log("exec translate " + name);
  if (files.includes(`${name}.html`)){
    console.log(`has ${name}.html return`);
    return
  }
  try {
    let reqRes = await notionAI.translateText(LANGUAGE.chinese, markdown);
    // console.log("exec in await " + name);
    reqRes = reqRes.replaceAll("！", "!").replaceAll("（", "(").replaceAll("【",'[').replaceAll("）",")").replaceAll("】","]")
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
      
      // console.log(reqRes);
      let l = 10
      if (limit(requestErrNameList,l,name)){
        console.log(`${name} up ${l} retry return`);
        return
      }
      if (!limit(requestErrNameList,l,name)){
        console.log(`Not Table :exec request ${name} after ${Math.floor(lastTime / 1000)} s`);
        sleep(lastTime).then(() => {
          translate(markdown, name);
        });
      }


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


     
let d = 20000       
let errIndex = []
function myLoop() {         
  setTimeout(function() { 
    if (start_i % 10 == 0){
      console.log(`exec index: ${start_i}`); 
    }
    if ( start_i === 60){
      // 
      // d =  40000
    }  
    if (!datas[start_i].info.includes("<table>")) {
      try{
        console.log(datas[start_i].name + "check !!! has not table tag")
        errIndex.push(start_i)
        // for (let start_i = 0; start_i < errIndex.length; start_i++) {
        //   writeStream.write(errIndex[start_i] + '\n');
        // }
        console.log(errIndex);
        start_i++
      }
      catch(err){
        console.log(err);
      }
    }
    let md = htmlToMarkdown(datas[start_i].info)
    md = md.replaceAll("[ ![", "![").replaceAll(" ](javascript:void%280%29;) ", "").replaceAll("\\.", ".")
    // fs.writeFile('md/' + datas[start_i].name.split(/[\t\r\f\n\s]*/g).join('').replaceAll("?","") + '.md', md, (err) => {
    //   if (err) {
    //     console.log(err);
    //   };
    // });
    
    translate(md, datas[start_i].name.split(/[\t\r\f\n\s]*/g).join('').replaceAll("?",""));
    
    start_i ++ ;                  
    if (start_i < datas.length) {           
      myLoop();             
    }                       
  }, d)

}



myLoop();              
// console.log(datas[start_i].info)