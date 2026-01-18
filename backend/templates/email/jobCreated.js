// Job Created Email Template
const { styles, helpers } = require('./styles');

function jobCreated({ job, customer }) {
  // Extract job details
  const orderId = job.orderId || 'N/A';
  const priority = job.priority || 'Medium';
  const quantity = job.quantity || 0;
  const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Not set';
  const requirements = job.requirements || '';
  const comments = job.comments || '';

  // Format job details (type, subType, fields)
  const jobDetails = job.jobDetails || [];

  // Generate job items HTML
  const jobItemsHtml = jobDetails.map((item) => {
    const type = item.type || 'Unknown';
    const subType = item.subType || '';
    const fields = item.fields || {};

    // Format fields into readable key-value pairs
    const fieldsHtml = Object.entries(fields)
      .filter(([key, value]) => value && key !== '_id')
      .map(([key, value]) => `
                <tr>
                    <td style="padding: 8px 0; color: ${styles.colors.text.muted}; font-size: 13px; width: 40%;">${key}</td>
                    <td style="padding: 8px 0; color: ${styles.colors.text.primary}; font-size: 13px; font-weight: 500;">${value}</td>
                </tr>
            `).join('');

    return `
        <div style="background-color: ${styles.colors.background.light}; border: 1px solid ${styles.colors.border.default}; border-radius: ${styles.borderRadius.lg}; padding: 20px; margin-bottom: 16px;">
            <div style="margin-bottom: 12px;">
                <p style="margin: 0; color: ${styles.colors.text.primary}; font-size: 15px; font-weight: 600;">${type}</p>
                ${subType ? `<p style="margin: 4px 0 0; color: ${styles.colors.text.muted}; font-size: 13px;">${subType}</p>` : ''}
            </div>
            ${fieldsHtml ? `
            <table style="width: 100%; border-collapse: collapse;">
                ${fieldsHtml}
            </table>
            ` : ''}
        </div>
        `;
  }).join('');

  // Priority color mapping
  const priorityColors = {
    'Low': { bg: styles.colors.accent.emerald.bg, text: styles.colors.accent.emerald.text },
    'Medium': { bg: styles.colors.accent.blue.bg, text: styles.colors.accent.blue.text },
    'High': { bg: styles.colors.accent.amber.bg, text: styles.colors.accent.amber.text },
    'Urgent': { bg: styles.colors.accent.red.bg, text: styles.colors.accent.red.text }
  };
  const priorityStyle = priorityColors[priority] || priorityColors['Medium'];

  return `
    <div style="${helpers.container()}">
        <!-- Logo Header -->
        ${helpers.logoHeader()}

        <!-- Title -->
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: ${styles.colors.text.primary}; font-size: 22px; font-weight: 600; margin: 0 0 8px;">New Job Created</h1>
            <span style="${helpers.badge(styles.colors.background.muted, styles.colors.text.muted)}">Order #${orderId}</span>
        </div>

        <!-- Stats Row -->
        <table style="width: 100%; margin-bottom: 24px; border-collapse: collapse;">
            <tr>
                <td style="width: 33%; text-align: center; padding: 16px; background-color: ${styles.colors.background.light}; border-radius: ${styles.borderRadius.lg} 0 0 ${styles.borderRadius.lg}; border: 1px solid ${styles.colors.border.default}; border-right: none;">
                    <p style="${helpers.label()}">Priority</p>
                    <span style="${helpers.badge(priorityStyle.bg, priorityStyle.text)}">${priority}</span>
                </td>
                <td style="width: 33%; text-align: center; padding: 16px; background-color: ${styles.colors.background.light}; border: 1px solid ${styles.colors.border.default}; border-right: none;">
                    <p style="${helpers.label()}">Quantity</p>
                    <p style="color: ${styles.colors.text.primary}; font-size: 18px; font-weight: 600; margin: 4px 0 0;">${quantity}</p>
                </td>
                <td style="width: 33%; text-align: center; padding: 16px; background-color: ${styles.colors.background.light}; border-radius: 0 ${styles.borderRadius.lg} ${styles.borderRadius.lg} 0; border: 1px solid ${styles.colors.border.default};">
                    <p style="${helpers.label()}">Deadline</p>
                    <p style="color: ${styles.colors.text.primary}; font-size: 14px; font-weight: 500; margin: 4px 0 0;">${deadline}</p>
                </td>
            </tr>
        </table>

        <!-- Job Items -->
        <div style="margin-bottom: 24px;">
            <p style="${helpers.label()} margin-bottom: 12px;">Job Items</p>
            ${jobItemsHtml}
        </div>

        <!-- Comments -->
        ${comments ? `
        <div style="background-color: ${styles.colors.accent.amber.bg}; border: 1px solid ${styles.colors.border.default}; border-radius: ${styles.borderRadius.lg}; padding: 20px; margin-bottom: 24px;">
            <p style="${helpers.label()}">Comments</p>
            <p style="color: ${styles.colors.accent.amber.text}; font-size: 14px; line-height: 1.6; margin: 8px 0 0;">${comments}</p>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="${helpers.footer()}">
            <p style="${helpers.footerText()}">This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
    `;
}

module.exports = jobCreated;
