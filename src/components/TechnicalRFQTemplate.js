// import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import pdfMake from "pdfmake/build/pdfmake";
import { useCounterStore } from "../store/piniaStore"
import pinia from "../store/store";
const stores = useCounterStore(pinia);
import robotoitalic from '../assets/fonts/Roboto-Italic.ttf';
import robotomedium from '../assets/fonts/Roboto-Medium.ttf';
import robotomediumitalic from '../assets/fonts/Roboto-MediumItalic.ttf';
import robotoregular from '../assets/fonts/Roboto-Regular.ttf';
import htmlToPdfmake from "html-to-pdfmake";

pdfMake.fonts = {
    Roboto: {
      normal: robotoregular,
      bold: robotomedium,
      italics: robotoitalic,
      bolditalics: robotomediumitalic
    },
  }

function exportPdfTemplate(companyOverview, projectDescription, scopeofWorkTechnical, expirationDate, expirationTimeFrame) {
    scopeofWorkTechnical = htmlToPdfmake(scopeofWorkTechnical, {
        tableAutoSize:true, ignoreStyles:['margin-left']
      });

      companyOverview = htmlToPdfmake(companyOverview, {
        tableAutoSize:true, ignoreStyles:['margin-left']
      });

      projectDescription = htmlToPdfmake(projectDescription, {
        tableAutoSize:true, ignoreStyles:['margin-left']
      });
    let docDefinition = {
        content: [
            {
                image: 'snow',
                width: 150,
                height: 50,
                margin: [0, 0, 0, 25],
                alignment: 'right'
            },

            {
                text: [
                    'Dear Sir/Madam,\n',
                ]
            },
            {
                text: ' We write further to your pre-qualification as Technical & Commercial Consultants for energy projects that InfraCredit guarantees from time to time; and hereby request for a quotation to provide Technical & Commercial Due Diligence Services in connection with a proposed transaction.',
                margin: [0, 15, 0, 25],
            },

            {
                text: 'Company Overview',
                bold: true
            },
            companyOverview,

            {
                text: 'Project Description',
                bold: true
            },
           projectDescription,

            {
                text: 'Scope of Work',
                bold: true
            },
            scopeofWorkTechnical,

            {
                text: 'Please note:',
                margin: [0, 5, 0, 15],
                bold: true
            },
            {
                ul: [
                    'Your quote shall be simple and economical, providing a straightforward and concise description of the fees you propose to charge to provide the Technical & Commercial Due Diligence Services. Your fees should be within the range submitted to InfraCredit in connection with your prequalification as Technical & Commercial Due Diligence Consultants. All quotes will become the property of InfraCredit and will not be returned.',
                    'The issue of this RfQ does not imply that InfraCredit is bound to select an Applicant or to appoint the Selected Applicant for the Services and InfraCredit reserves the right to reject all or any of the Quotations without assigning any reasons whatsoever.',
                    'InfraCredit reserves the right to select the appropriate service provider(s) based on its requirements, which will, barring extenuating circumstances, be made on a least-cost basis. The decision of the evaluation panel will be final.',
                    'At any time during the validity of the quotation, no price variation due to escalation, inflation, fluctuation in exchange rates, or any other market factors shall be accepted by InfraCredit after it has received the quotation.'
                ],
                alignment: 'justify'
            },
            {
                text: 'Submission of quotes\n',
                margin: [0, 20],
                bold: true
            },

            {
                text: `Kindly upload your quote on your portal by close of business in ${expirationDate} ${expirationTimeFrame.substring(0, expirationTimeFrame.length - 1)}(s) time.\n`,
                alignment: 'justify'
            },


            {
                text: `Thank you.`,
                margin: [0, 15],

            },
        ],
        images: {
            snow: 'https://infracredit.blob.core.windows.net/infracredit/InfraCredit.jpg',
          },

        defaultStyle:{
            font: 'Roboto'
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'right',
                margin: [0, 190, 0, 80]
            },
            subheader: {
                fontSize: 14
            },
            superMargin: {
                margin: [20, 0, 40, 0],
                fontSize: 15
            },
            'html-span':{
                color:'black' // it will add a yellow background to all <STRONG> elements
              }
        }

    };
    pdfMake.createPdf(docDefinition).getDataUrl(function (url) {
        stores.testDocument3 = url

    })

}


function exportPdfDownload(rfqNo, companyOverview, projectDescription, scopeofWorkTechnical, expirationDate) {
    const newdate = new Date(expirationDate);
    scopeofWorkTechnical = htmlToPdfmake(scopeofWorkTechnical, {
        tableAutoSize: true, ignoreStyles: ['margin-left']
      });

      companyOverview = htmlToPdfmake(companyOverview, {
        tableAutoSize: true, ignoreStyles: ['margin-left']
      });

      projectDescription = htmlToPdfmake(projectDescription, {
        tableAutoSize: true, ignoreStyles: ['margin-left']
      });
    let docDefinition = {
        content: [
            {
                image: 'snow',
                width: 150,
                height: 50,
                margin: [0, 0, 0, 25],
                alignment: 'right'
            },
            {
                text: [
                    'Dear Sir/Madam,\n',
                ]
            },
            {
                text: ' We write further to your pre-qualification as Technical & Commercial Consultants for energy projects that InfraCredit guarantees from time to time; and hereby request for a quotation to provide Technical & Commercial Due Diligence Services in connection with a proposed transaction.',
                margin: [0, 15, 0, 25],
            },

            {
                text: 'Company Overview',
                bold: true
            },
            companyOverview,
            {
                text: 'Project Description',
                bold: true
            },
            projectDescription,

            {
                text: 'Scope of Work',
                bold: true
            },
            scopeofWorkTechnical,

            {
                text: 'Please note:',
                margin: [0, 5, 0, 15],
                bold: true
            },
            {
                ul: [
                    'Your quote shall be simple and economical, providing a straightforward and concise description of the fees you propose to charge to provide the Technical & Commercial Due Diligence Services. Your fees should be within the range submitted to InfraCredit in connection with your prequalification as Technical & Commercial Due Diligence Consultants. All quotes will become the property of InfraCredit and will not be returned.',
                    'The issue of this RfQ does not imply that InfraCredit is bound to select an Applicant or to appoint the Selected Applicant for the Services and InfraCredit reserves the right to reject all or any of the Quotations without assigning any reasons whatsoever.',
                    'InfraCredit reserves the right to select the appropriate service provider(s) based on its requirements, which will, barring extenuating circumstances, be made on a least-cost basis. The decision of the evaluation panel will be final.',
                    'At any time during the validity of the quotation, no price variation due to escalation, inflation, fluctuation in exchange rates, or any other market factors shall be accepted by InfraCredit after it has received the quotation.'
                ],
                alignment: 'justify'
            },
            {
                text: 'Submission of quotes\n',
                margin: [0, 20],
                bold: true
            },

            {
                text: `Kindly upload your quote on your portal by close of business on ${newdate}.\n`,
                alignment: 'justify'
            },


            {
                text: `Thank you.`,
                margin: [0, 15],

            },
        ],
        images: {
            snow: 'https://infracredit.blob.core.windows.net/infracredit/InfraCredit.jpg',
          },
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'right',
                margin: [0, 190, 0, 80]
            },
            subheader: {
                fontSize: 14
            },
            superMargin: {
                margin: [20, 0, 40, 0],
                fontSize: 15
            },
            'html-span':{
                color:'black' // it will add a yellow background to all <STRONG> elements
              }
        }

    };
    pdfMake.createPdf(docDefinition).download(rfqNo)


}

export default {
    exportPdfTemplate,
    exportPdfDownload
}