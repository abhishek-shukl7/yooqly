// Customer Joined Email Template
const { styles, helpers } = require('./styles');

function customerJoined({ customerName, companyName }) {
  return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Content -->
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="${helpers.title()} margin-bottom: 8px;">Welcome, ${customerName}!</h1>
            <p style="${helpers.body()}">
                Thank you for joining <strong style="color: ${styles.colors.text.primary};">${companyName}</strong>.
                We're excited to have you onboard.
            </p>
        </div>

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="${helpers.footerText()}">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
    </div>
    `;
}

module.exports = customerJoined;
