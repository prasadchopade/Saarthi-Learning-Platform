import html2pdf from 'html2pdf.js';
import { toast } from 'react-hot-toast';

export const exportAsPDF = async (content, title = 'Document') => {
  try {
    toast.loading('Preparing PDF export...');
    
    // Create a temporary container with the HTML content
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;
    tempContainer.className = 'pdf-container';
    
    // Create a wrapper div for proper positioning and styling
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 210mm;
      padding: 15mm;
      background-color: white;
      z-index: -9999;
      visibility: hidden;
    `;
    wrapper.appendChild(tempContainer);
    
    // Add styles for better PDF formatting
    const style = document.createElement('style');
    style.textContent = `
      .pdf-container {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      /* Handle Tailwind classes */
      .text-xl {
        font-size: 1.25rem; /* 20px */
        line-height: 1.75rem; /* 28px */
      }
      
      .font-bold {
        font-weight: 700;
      }
      
      .text-text-100 {
        color: #333;
      }
      
      .mt-1 {
        margin-top: 0.25rem; /* 4px */
      }
      
      .-mb-0\\.5 {
        margin-bottom: -0.125rem; /* -2px */
      }
      
      .whitespace-normal {
        white-space: normal;
      }
      
      .break-words {
        overflow-wrap: break-word;
      }
      
      .list-disc {
        list-style-type: disc;
      }
      
      .space-y-1\\.5 > * + * {
        margin-top: 0.375rem; /* 6px */
      }
      
      .pl-7 {
        padding-left: 1.75rem; /* 28px */
      }
      
      /* General element styling */
      pre {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 12px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        white-space: pre-wrap;
        word-wrap: break-word;
        margin: 10px 0;
        overflow-x: auto;
        page-break-inside: avoid;
      }
      
      code {
        font-family: 'Courier New', monospace;
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 90%;
      }
      
      blockquote {
        border-left: 4px solid #3b82f6;
        margin: 10px 0;
        padding: 10px 20px;
        background-color: #f8fafc;
        font-style: italic;
        page-break-inside: avoid;
      }
      
      blockquote b, blockquote strong {
        font-weight: bold;
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin: 20px 0 10px 0;
        font-weight: bold;
        page-break-after: avoid;
        page-break-inside: avoid;
      }
      
      h1 { font-size: 24px; }
      h2 { font-size: 20px; }
      h3 { font-size: 18px; }
      h4 { font-size: 16px; }
      h5 { font-size: 14px; }
      h6 { font-size: 12px; }
      
      p {
        margin: 10px 0;
      }
      
      strong {
        font-weight: bold;
      }
      
      ul, ol {
        margin: 10px 0;
        padding-left: 20px;
      }
      
      li {
        margin: 5px 0;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 15px 0;
        page-break-inside: avoid;
      }
      
      table, th, td {
        border: 1px solid #ddd;
      }
      
      th, td {
        padding: 8px;
        text-align: left;
      }
      
      th {
        background-color: #f2f2f2;
      }
      
      img {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(wrapper);
    
    // Process content for better PDF rendering
    const processContent = () => {
      // Clean up Tailwind classes that might interfere with PDF rendering
      const cleanTailwindClasses = (element) => {
        if (!element || !element.classList) return;
        
        // Keep essential classes, remove complex Tailwind selectors
        const classesToKeep = [
          'text-xl', 'font-bold', 'whitespace-normal', 'break-words', 
          'list-disc', 'pl-7', 'space-y-1.5'
        ];
        
        const currentClasses = Array.from(element.classList);
        currentClasses.forEach(cls => {
          // Remove complex Tailwind selectors with brackets and colons
          if (cls.includes('[') || cls.includes(']') || cls.includes(':')) {
            element.classList.remove(cls);
          }
        });
      };
      
      // Process all elements recursively
      const processElement = (element) => {
        if (!element) return;
        
        // Process this element
        cleanTailwindClasses(element);
        
        // Process children
        Array.from(element.children).forEach(child => {
          processElement(child);
        });
      };
      
      // Start processing from the container
      processElement(tempContainer);
      
      // Handle emojis
      const textNodes = [];
      const walk = document.createTreeWalker(tempContainer, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while (node = walk.nextNode()) {
        textNodes.push(node);
      }
      
      textNodes.forEach(textNode => {
        // Check if text contains emoji
        if (/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}]/u.test(textNode.nodeValue)) {
          const span = document.createElement('span');
          span.style.fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
          span.textContent = textNode.nodeValue;
          textNode.parentNode.replaceChild(span, textNode);
        }
      });
    };
    
    processContent();
    
    // Configure html2pdf options
    const opt = {
      margin: [15, 15, 20, 15], // [top, left, bottom, right]
      filename: `${title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      enableLinks: true,
      pagebreak: { mode: 'avoid-all' },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
        
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
    
    // Generate PDF
    try {
      const result = await html2pdf()
        .from(tempContainer)
        .set(opt)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          return pdf;
        })
        .save();
      
      // Clean up
      document.body.removeChild(wrapper);
      document.head.removeChild(style);
      
      toast.dismiss();
      toast.success('PDF exported successfully');
      
      return true;
    } catch (pdfError) {
      console.error('Error during PDF generation:', pdfError);
      throw pdfError;
    }
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    toast.dismiss();
    toast.error('Failed to export PDF: ' + error.message);
    
    return false;
  }
};