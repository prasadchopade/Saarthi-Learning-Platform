const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const MarkdownIt = require('markdown-it');

/**
 * Generates a PDF from markdown content using Puppeteer
 * @param {Object} options - PDF generation options
 * @param {string} options.title - The title of the document
 * @param {string} options.subtitle - The subtitle of the document
 * @param {string} options.date - The date string to display
 * @param {string} options.content - The markdown content to render
 * @returns {Promise<Buffer>} - The generated PDF as a buffer
 */
const generatePdfFromMarkdown = async ({ title, subtitle, date, content }) => {
  // Create a temporary HTML file
  const tempDir = os.tmpdir();
  const tempHtmlPath = path.join(tempDir, `${Date.now()}_pdf_content.html`);
  
  // Convert markdown to HTML
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        h2 {
          font-size: 20px;
          color: #555;
          margin-bottom: 5px;
        }
        .date {
          color: #777;
          font-size: 14px;
          margin-bottom: 30px;
        }
        h3 {
          font-size: 18px;
          margin-top: 25px;
          margin-bottom: 10px;
          color: #444;
        }
        h4 {
          font-size: 16px;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #555;
        }
        p {
          margin-bottom: 16px;
        }
        ul, ol {
          margin-bottom: 16px;
          padding-left: 25px;
        }
        li {
          margin-bottom: 8px;
        }
        code {
          font-family: 'Courier New', monospace;
          background-color: #f5f5f5;
          padding: 2px 5px;
          border-radius: 3px;
          font-size: 14px;
        }
        pre {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          margin-bottom: 20px;
        }
        pre code {
          background-color: transparent;
          padding: 0;
        }
        a {
          color: #2563eb;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        blockquote {
          border-left: 4px solid #ddd;
          padding-left: 15px;
          margin-left: 0;
          color: #666;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 20px;
        }
        table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
        hr {
          border: 0;
          height: 1px;
          background-color: #ddd;
          margin: 20px 0;
        }
        img {
          max-width: 100%;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <h2>${subtitle}</h2>
        <div class="date">Date: ${date}</div>
      </div>
      <div class="content">
        ${convertMarkdownToHtml(content)}
      </div>
    </body>
    </html>
  `;

  // Write the HTML to the temporary file
  fs.writeFileSync(tempHtmlPath, htmlContent);

  // Launch puppeteer with proper configuration.
  // Chrome is not installed on hosts that set PUPPETEER_SKIP_DOWNLOAD, and it
  // needs more memory than a small instance has, so surface that as a clear
  // error rather than a stack trace the caller cannot interpret.
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
  } catch (launchError) {
    fs.unlinkSync(tempHtmlPath);
    const error = new Error('PDF_BROWSER_UNAVAILABLE');
    error.cause = launchError;
    throw error;
  }
  
  try {
    const page = await browser.newPage();
    await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '30px',
        right: '30px',
        bottom: '30px',
        left: '30px'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width: 100%; text-align: center; font-size: 10px; color: #777;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `
    });

    return pdfBuffer;
  } finally {
    await browser.close();
    
    // Clean up the temporary file
    try {
      fs.unlinkSync(tempHtmlPath);
    } catch (err) {
      console.error('Error deleting temporary HTML file:', err);
    }
  }
};

/**
 * Convert markdown to HTML using markdown-it
 * @param {string} markdown - The markdown content to convert
 * @returns {string} - The HTML content
 */
function convertMarkdownToHtml(markdown) {
  if (!markdown) return '';
  
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });
  
  return md.render(markdown);
}

module.exports = {
  generatePdfFromMarkdown
};
