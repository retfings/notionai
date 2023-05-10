const XLSX = require('xlsx');
function writeXLSX(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    XLSX.writeFile(workbook, "new.xlsx");
  }
a = [{"name":"thisisname1","decs":"thissidecs1"},{"name":"thisisname2","decs":"thissidecs2"}];
writeXLSX(a);
// console.log(data);