// Production Completed Email Template
const { styles, helpers } = require('./styles');

function productionCompleted({ orderId, items, customerName }) {

  // Helper to render rows
  const renderRows = () => {
    return items.map(item => {
      const qty = item.fields?.Quantity || item.fields?.quantity || 'N/A';
      const completed = item.completed || 0;
      const status = 'Completed'; // Since this email is only sent when all are completed

      return `
            <tr>
                <td style="padding: 16px 12px; color: ${styles.colors.text.primary}; font-size: 14px; font-weight: 500;">
                    ${item.type}
                    ${item.lineItemId ? `<br><span style="font-size: 11px; color: ${styles.colors.text.tertiary};">${item.lineItemId}</span>` : ''}
                </td>
                <td style="padding: 16px 12px; color: ${styles.colors.text.primary}; font-size: 14px; font-weight: 500; text-align: center;">${qty}</td>
                <td style="padding: 16px 12px; text-align: right;">
                     <span style="${helpers.badge('#d1fae5', '#065f46')}">${status}</span>
                </td>
            </tr>
            `;
    }).join('');
  }

  return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="background-color: #d1fae5; color: #065f46; width: 48px; height: 48px; border-radius: 50%; display: block; margin-left: auto; margin-right: auto; margin-bottom: 16px;">
                <span style="font-size: 24px; line-height: 48px;">✓</span>
            </div>
            <h1 style="color: ${styles.colors.text.primary}; font-size: 22px; font-weight: 600; margin: 0;">Production Completed</h1>
            <p style="${helpers.value()} margin-top: 8px;">Order #${orderId}</p>
        </div>

        <!-- Success Message -->
        <div style="${helpers.card()} margin-bottom: 24px; text-align: center;">
            <p style="color: ${styles.colors.text.secondary}; font-size: 15px; line-height: 1.6; margin: 0;">
                Great news, <strong>${customerName || 'Customer'}</strong>!
                <br>
                All items in your order have been successfully produced and are ready for the next stage.
            </p>
        </div>

        <!-- Detail Table -->
        <div style="margin-bottom: 24px; border: 1px solid ${styles.colors.border.default}; border-radius: ${styles.borderRadius.lg}; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; background-color: ${styles.colors.background.white};">
                <thead>
                    <tr style="background-color: ${styles.colors.background.light}; border-bottom: 1px solid ${styles.colors.border.default};">
                        <th style="padding: 12px; text-align: left; ${helpers.label()} font-size: 11px; text-transform: uppercase;">Item</th>
                        <th style="padding: 12px; text-align: center; ${helpers.label()} font-size: 11px; text-transform: uppercase;">Qty</th>
                        <th style="padding: 12px; text-align: right; ${helpers.label()} font-size: 11px; text-transform: uppercase;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderRows()}
                </tbody>
            </table>
        </div>

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="${helpers.footerText()}">This is an automated notification.</p>
        </div>
    </div>
    `;
}

module.exports = productionCompleted;
