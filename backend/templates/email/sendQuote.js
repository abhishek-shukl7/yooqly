// Send Quote Email Template
const { styles, helpers } = require('./styles');

function sendQuote({ quoteId, quote, approveLink, rejectLink, currencySymbol = '£' }) {
    const itemsRows = quote.quoteItems.map(item => `
        <tr>
            <td style="padding: 14px 0; border-bottom: 1px solid ${styles.colors.border.light}; color: ${styles.colors.text.primary}; font-size: 14px;">${item.itemName}</td>
            <td style="padding: 14px 0; border-bottom: 1px solid ${styles.colors.border.light}; color: ${styles.colors.text.muted}; font-size: 14px; text-align: right;">${currencySymbol}${item.unitPrice}</td>
            <td style="padding: 14px 0; border-bottom: 1px solid ${styles.colors.border.light}; color: ${styles.colors.text.primary}; font-size: 14px; font-weight: 500; text-align: right;">${currencySymbol}${item.totalPrice}</td>
        </tr>
    `).join('');

    return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 24px;">
            <span style="${helpers.badge(styles.colors.text.primary, styles.colors.background.white)} letter-spacing: 0.5px;">QUOTE #${quoteId || quote.orderId}</span>
        </div>

        <p style="${helpers.body()} text-align: center; margin-bottom: 24px;">You have received a new quote. Please review the details below.</p>

        <!-- Quote Card -->
        <div style="${helpers.card()} margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 0 0 12px; ${helpers.label()} border-bottom: 1px solid ${styles.colors.border.default};">Item</th>
                        <th style="text-align: right; padding: 0 0 12px; ${helpers.label()} border-bottom: 1px solid ${styles.colors.border.default};">Unit Price</th>
                        <th style="text-align: right; padding: 0 0 12px; ${helpers.label()} border-bottom: 1px solid ${styles.colors.border.default};">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>

            <!-- Totals -->
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid ${styles.colors.border.default};">
                <table style="width: 100%;">
                    <tr>
                        <td style="color: ${styles.colors.text.muted}; font-size: 14px;">Tax</td>
                        <td style="color: ${styles.colors.text.secondary}; font-size: 14px; text-align: right;">${quote.tax}%</td>
                    </tr>
                    <tr>
                        <td style="color: ${styles.colors.text.primary}; font-size: 16px; font-weight: 600; padding-top: 8px;">Total</td>
                        <td style="color: ${styles.colors.text.primary}; font-size: 20px; font-weight: 600; text-align: right; padding-top: 8px;">${currencySymbol}${quote.quoteTotal}</td>
                    </tr>
                </table>
            </div>

            ${quote.terms ? `
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid ${styles.colors.border.default};">
                <p style="${helpers.label()}">Terms & Conditions</p>
                <div style="color: ${styles.colors.text.secondary}; font-size: 13px; line-height: 1.5; margin: 6px 0 0;">
                    ${quote.terms.split(/\r?\n/).map(line => `<span style="display: block; margin-bottom: 4px;">${line}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>

        <!-- Action Buttons -->
        <div style="text-align: center; margin-bottom: 32px;">
            <table style="margin: 0 auto;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="padding-right: 12px;">
                        <a href="${approveLink}" style="${helpers.buttonPrimary()}">Approve Quote</a>
                    </td>
                    <td>
                        <a href="${rejectLink}" style="${helpers.buttonSecondary()}">Reject Quote</a>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="color: ${styles.colors.text.light}; font-size: 11px; line-height: 1.6; margin: 0;">
                Having trouble with the buttons? Copy and paste these links:<br>
                <span style="color: ${styles.colors.text.muted};">Approve:</span> <a href="${approveLink}" style="color: ${styles.colors.text.secondary}; text-decoration: underline;">${approveLink}</a><br>
                <span style="color: ${styles.colors.text.muted};">Reject:</span> <a href="${rejectLink}" style="color: ${styles.colors.text.secondary}; text-decoration: underline;">${rejectLink}</a>
            </p>
        </div>
    </div>
    `;
}

module.exports = sendQuote;
