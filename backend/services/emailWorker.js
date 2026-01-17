const nodemailer = require('nodemailer');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // true for port 465, false for 587
    connectionTimeout: 10000,
    tls: {
        ciphers: 'SSLv3',
    },
    auth: {
        user: 'testclient@hackersdaddy.com',
        pass: 'Qj1aUNlK|5',
    },
    logger: true,
    debug: true,
});

/**
 * Send an email using the configured transporter.
 * @param {Object} options
 * @param {string} options.from - Sender email address
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body (HTML)
 * @returns {Promise<Object>} - Nodemailer response
 */
async function sendEmail({ from = process.env.EMAIL_USER_FROM, to, subject, html }) {
    try {
        const info = await transporter.sendMail({ from, to, subject, html });
        return info;
    } catch (error) {
        throw error;
    }
}

module.exports = { sendEmail };
