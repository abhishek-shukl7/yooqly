// Shared styles for web pages (matching email aesthetics)
const styles = {
  colors: {
    background: '#f1f5f9',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      heading: '#0f172a',
      footer: '#94a3b8'
    },
    container: 'white',
    border: '#e2e8f0',
    footerBg: '#f8fafc'
  },
  fonts: {
    primary: "'Inter', system-ui, -apple-system, sans-serif"
  }
};

/**
 * Renders a styled HTML page for Magic Link interactions
 * @param {string} title - Page title
 * @param {string} content - HTML content for the body
 * @param {string} themeColor - Primary color for buttons/accents (default: blue)
 * @returns {string} Full HTML string
 */
function renderStyledPage(title, content, themeColor = '#2563eb') {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: ${styles.fonts.primary}; background-color: ${styles.colors.background}; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; color: ${styles.colors.text.primary}; }
            .container { background: ${styles.colors.container}; width: 100%; max-width: 480px; margin: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden; }
            .content { padding: 40px 32px; text-align: center; }
            h1 { font-size: 24px; font-weight: 600; margin: 0 0 12px 0; color: ${styles.colors.text.heading}; }
            p { font-size: 15px; line-height: 1.6; color: ${styles.colors.text.secondary}; margin: 0 0 24px 0; }
            .btn { display: inline-block; background-color: ${themeColor}; color: white; padding: 12px 32px; border-radius: 8px; font-weight: 500; text-decoration: none; font-size: 15px; border: none; cursor: pointer; transition: opacity 0.2s; }
            .btn:hover { opacity: 0.9; }
            .footer { background-color: ${styles.colors.footerBg}; padding: 16px; text-align: center; font-size: 12px; color: ${styles.colors.text.footer}; border-top: 1px solid ${styles.colors.border}; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Yooqly. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
}

module.exports = renderStyledPage;
