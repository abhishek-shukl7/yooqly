// Production Update Email Template
const { styles, helpers } = require('./styles');

function productionUpdate({ jobName, updateDetails }) {
  return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: ${styles.colors.text.primary}; font-size: 22px; font-weight: 600; margin: 0;">Production Update</h1>
        </div>

        <!-- Content Card -->
        <div style="${helpers.card()} margin-bottom: 24px;">
            <p style="${helpers.label()}">Job</p>
            <p style="${helpers.value()} margin-bottom: 16px;">${jobName}</p>

            <p style="${helpers.label()}">Update</p>
            <p style="color: ${styles.colors.text.secondary}; font-size: 14px; line-height: 1.6; margin: 6px 0 0;">${updateDetails}</p>
        </div>

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="${helpers.footerText()}">This is an automated notification.</p>
        </div>
    </div>
    `;
}

module.exports = productionUpdate;
