import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid, Platform } from 'react-native';

export const generatePDF = async (admissionData: any) => {
  const today = new Date();
  const date = today.toLocaleDateString('en-GB');
  const fileName = `${admissionData.studentName.replace(/\s/g, "_")}_${date.replace(/\//g, "-")}`;

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { color: #539486; text-align: center; }
          .section { margin-top: 20px; }
          .label { font-weight: bold; color: #539486; }
          .value { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h2>PRATAP LIBRARY</h2>
        <p><b>Date:</b> ${date}</p>
        <p><b>Student:</b> ${admissionData.studentName}</p>
        <p><b>Father:</b> ${admissionData.fatherName}</p>
        <p><b>Seat:</b> ${admissionData.seatNo}</p>
        <p><b>Shift:</b> ${admissionData.shift}</p>
        <p><b>Room:</b> ${admissionData.room}</p>
        <p><b>Amount:</b> ₹${admissionData.amount}</p>
        <p><b>Duration:</b> ${admissionData.duration} months</p>
      </body>
    </html>
  `;

  if (Platform.OS === 'android') {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
  }

  const pdf = await RNHTMLtoPDF.convert({
    html,
    fileName,
    directory: 'Download', // Ensures it saves to Downloads
  });

  return pdf.filePath; // like: /storage/emulated/0/Download/StudentName_05-07-2025.pdf
};
