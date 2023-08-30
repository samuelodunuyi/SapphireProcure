// import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { useCounterStore } from "../store/piniaStore"
import pinia from "../store/store";
import htmlToPdfmake from "html-to-pdfmake";
const stores = useCounterStore(pinia);

pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
  },
}

function exportPdfDownload(htmlTemplateLegal) {
  htmlTemplateLegal = htmlToPdfmake(htmlTemplateLegal, {tableAutoSize: true});
  let docDefinition = {
    content: [
      {
        image: 'snow',
        width: 150,
        height: 50,
        margin: [0, 0, 0, 25],
        alignment: 'right'
    },
    htmlTemplateLegal
    ],
    pageBreakBefore: function(currentNode) {
      return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
    }, 
    images: {
      snow: 'https://infracredit.blob.core.windows.net/infracredit/InfraCredit.jpg',
    },
    defaultStyle: {
      font: 'Roboto'
    },
  };
  let ps = pdfMake.createPdf(docDefinition).getBlob((blob)=> {
    stores.storesBlob = blob
    console.log(blob)
  })  
}


export default {
  exportPdfDownload
}