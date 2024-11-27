# Invoice AI: Automated Data Extraction & Invoice Management  

## Overview  
Invoice AI is a React-based app that automates invoice data extraction from Excel, PDFs, and images, organizing the information into **Invoices**, **Products**, and **Customers** tabs with real-time data synchronization using Redux.

---

## Features  
- **File Uploads & AI Extraction**: Supports Excel, PDF, and image files with AI-based data parsing.  
- **Tabular Data Management**:  
  - **Invoices Tab**: Displays serial number, customer details, product info, tax, and total.  
  - **Products Tab**: Shows product name, quantity, price, and tax details.  
  - **Customers Tab**: Lists customer name, phone, and total purchases.  
- **Centralized State with Redux**: Real-time updates across all tabs for consistent data.  
- **Validation & Error Handling**: Validates extracted data and highlights missing fields.

---

## Setup  

### 1. Clone the Repository  
```bash  
git clone https://github.com/rishabh3562/swipe-intern-assignment.git 
cd invoice-ai  
```  

### 2. Install Dependencies  
```bash  
npm install  
```  

### 3. Set Up Environment Variables  
Create a `.env` file in the root directory and add your Google Gemini API key:  
```bash  
VITE_REACT_GOOGLE_API_KEY=Your_Google_API_Key
```  

### 4. Start the Application  
```bash  
npm run dev  
```  

The app will run at `http://localhost:5173`.  

---

## Screenshots  

### Home Page  
![File Upload Interface](https://github.com/user-attachments/assets/62dc8710-20e6-4705-a9ac-46c60b1a8e33)  

### File Upload Interface   
![Invoices Tab](https://github.com/user-attachments/assets/eae8fc70-9189-4fc8-8188-0ea9b6744f86)
