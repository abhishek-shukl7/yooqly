// Quote Status Email Template
const { styles, helpers } = require('./styles');

function quoteStatus({ quoteId, status, reason }) {
    const isApproved = status === 'approved';

    return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Content -->
        <div style="text-align: center; margin-bottom: 24px;">
            <span style="${helpers.badge(styles.colors.background.muted, styles.colors.text.muted)} margin-bottom: 12px;">Quote #${quoteId}</span>
            <h1 style="${helpers.title()} margin-top: 12px;">${isApproved ? 'Quote Approved' : 'Quote Rejected'}</h1>
            <p style="${helpers.body()} margin-top: 12px;">
                ${isApproved
            ? 'Great news! Your quote has been approved and is ready to proceed.'
            : 'Unfortunately, your quote was not approved.'}
            </p>
        </div>

        ${!isApproved && reason ? `
        <div style="background-color: ${styles.colors.accent.red.bg}; border: 1px solid #fecaca; border-radius: ${styles.borderRadius.lg}; padding: 16px; margin-bottom: 24px;">
            <p style="${helpers.label()}">Reason</p>
            <div style="color: ${styles.colors.accent.red.text}; font-size: 14px; line-height: 1.5; margin: 6px 0 0;">
                ${reason.split(/\r?\n/).map(line => `<span style="display: block; margin-bottom: 4px;">${line}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="${helpers.footerText()}">This is an automated notification.</p>
        </div>
    </div>
    `;
}

module.exports = quoteStatus;
