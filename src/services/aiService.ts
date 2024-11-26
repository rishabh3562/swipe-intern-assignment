import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_REACT_GOOGLE_API_KEY || '');
const parseGeminiResponse = (responseText: string): any => {
  try {
    // Remove the surrounding markdown formatting
    const jsonString = responseText.replace(/```json\n|\n```/g, '');
    
    // Parse the JSON string
    const jsonObject = JSON.parse(jsonString);
    
    return jsonObject;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw error;
  }
};

export const extractDataFromImage = async (file: File): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const imageData = await file.arrayBuffer();
    const uint8Array = new Uint8Array(imageData);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64Image = btoa(binary);
    
    const response = await model.generateContent([
      'Extract the following information from this invoice image in JSON format: serial number, customer name, product details (name, quantity, unit price), tax amount, total amount, and date. Format the response as valid JSON.',
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image,
        },
      },
    ]);

    const resultText = await response.response.text();
    console.log('API Response:', resultText); // Log the response text
    const result = parseGeminiResponse(resultText); // Parse the response text
    console.log('Parsed Result:', result); // Log the parsed result
    return result;
  } catch (error) {
    console.error('Error extracting data from image:', error);
    throw error;
  }
};



export const extractDataFromPDF = async (file: File): Promise<any> => {
  // Similar to image extraction but with PDF-specific processing
  // Implementation would depend on the PDF processing library chosen
  return extractDataFromImage(file); // Fallback to image processing for now
};

export const processExcelData = async (data: any[]): Promise<any> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
  const response = await model.generateContent(`
    Process this Excel data and format it into proper invoice, product, and customer data:
    ${JSON.stringify(data)}
    Return the result as valid JSON with three arrays: invoices, products, and customers.
  `);

  const result = await response.response.text();
  return JSON.parse(result);
};