// User Registered Email Template
const { styles, helpers } = require('./styles');

function userRegistered({ userName, companyName, loginUrl }) {
  return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Content -->
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="${helpers.title()} margin-bottom: 8px;">Welcome, ${userName}!</h1>
            <p style="${helpers.body()} margin-bottom: 24px;">
                You have been registered to <strong style="color: ${styles.colors.text.primary};">${companyName}</strong>.
            </p>
            <a href="${loginUrl || '#'}" style="${helpers.buttonPrimary()}">Login to Get Started</a>
        </div>

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="${helpers.footerText()}">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
    </div>
    `;
}

module.exports = userRegistered;
