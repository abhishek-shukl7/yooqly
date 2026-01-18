// Production Update Email Template
const { styles, helpers } = require('./styles');

function productionUpdate({ jobName, updateDetails, lineItemId, status, completed, quantity, deadline }) {
    const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

    // Status color mapping (Tailwind to Hex)
    const statusLower = (status || '').toLowerCase();
    const statusColors = {
        'urgent': { bg: '#fee2e2', text: '#991b1b' }, // red-100 red-800
        'high': { bg: '#fee2e2', text: '#991b1b' },
        'queued': { bg: '#f1f5f9', text: '#1e293b' }, // slate-100 slate-800
        'not started': { bg: '#f1f5f9', text: '#1e293b' }, // map 'not started' to queued style if needed
        'in-production': { bg: '#dbeafe', text: '#1e40af' }, // blue-100 blue-800
        'in progress': { bg: '#dbeafe', text: '#1e40af' }, // consistent with in-production
        'ready for dispatch': { bg: '#fef3c7', text: '#92400e' }, // amber-100 amber-800
        'completed': { bg: '#d1fae5', text: '#065f46' }, // emerald-100 emerald-800
        'paused': { bg: '#ffedd5', text: '#9a3412' } // orange-100 orange-800
    };
    const sStyle = statusColors[statusLower] || statusColors['queued'];

    return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: ${styles.colors.text.primary}; font-size: 22px; font-weight: 600; margin: 0;">Production Update</h1>
            <p style="${helpers.value()} margin-top: 8px;">${jobName}</p>
            ${lineItemId ? `<span style="${helpers.badge(styles.colors.background.muted, styles.colors.text.muted)} margin-top: 8px;">${lineItemId}</span>` : ''}
        </div>

        <!-- Detail Table -->
        <div style="margin-bottom: 24px; border: 1px solid ${styles.colors.border.default}; border-radius: ${styles.borderRadius.lg}; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; background-color: ${styles.colors.background.white};">
                <thead>
                    <tr style="background-color: ${styles.colors.background.light}; border-bottom: 1px solid ${styles.colors.border.default};">
                        <th style="padding: 12px; text-align: left; ${helpers.label()} font-size: 11px; text-transform: uppercase;">Quantity</th>
                        <th style="padding: 12px; text-align: center; ${helpers.label()} font-size: 11px; text-transform: uppercase;">Completed</th>
                        <th style="padding: 12px; text-align: right; ${helpers.label()} font-size: 11px; text-transform: uppercase;">Deadline</th>
                        <th style="padding: 12px; text-align: right; ${helpers.label()} font-size: 11px; text-transform: uppercase;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 16px 12px; color: ${styles.colors.text.primary}; font-size: 14px; font-weight: 500;">${quantity}</td>
                        <td style="padding: 16px 12px; color: ${styles.colors.text.primary}; font-size: 14px; font-weight: 500; text-align: center;">${completed}</td>
                        <td style="padding: 16px 12px; color: ${styles.colors.text.primary}; font-size: 14px; font-weight: 500; text-align: right;">${formattedDeadline}</td>
                        <td style="padding: 16px 12px; text-align: right;">
                            <span style="${helpers.badge(sStyle.bg, sStyle.text)}">${status}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Update Details (Moved below table for better flow, or keep above? Keeping structure but table is highlighted) -->
         <div style="${helpers.card()} margin-bottom: 24px; text-align: center;">
            <p style="${helpers.label()}">Update Details</p>
            <div style="color: ${styles.colors.text.secondary}; font-size: 14px; line-height: 1.6; margin: 6px 0 0;">
                ${updateDetails.split(/\r?\n/).map(line => `<span style="display: block; margin-bottom: 4px;">${line}</span>`).join('')}
            </div>
        </div>

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="${helpers.footerText()}">This is an automated notification.</p>
        </div>
    </div>
    `;
}

module.exports = productionUpdate;
