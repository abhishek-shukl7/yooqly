// Email Template Design System
// Based on provided UI settings for consistent, minimal email design

// Logo URL - update this to your hosted logo URL in production
const LOGO_URL = 'https://crm.api.hackersdaddy.com/images/logo.png';

const styles = {
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fallback: "Arial, sans-serif"
  },
  colors: {
    text: {
      primary: "#18181b",
      secondary: "#52525b",
      muted: "#71717a",
      light: "#a1a1aa"
    },
    background: {
      white: "#ffffff",
      light: "#fafafa",
      muted: "#f4f4f5"
    },
    border: {
      default: "#e4e4e7",
      light: "#f4f4f5",
      muted: "#d4d4d8"
    },
    status: {
      draft: { background: "#f1f5f9", text: "#334155" },
      sent: { background: "#dbeafe", text: "#1e40af" },
      approved: { background: "#d1fae5", text: "#065f46" },
      rejected: { background: "#fee2e2", text: "#991b1b" },
      warning: { background: "#fef3c7", text: "#92400e" }
    },
    accent: {
      emerald: { bg: "#d1fae5", text: "#065f46", solid: "#10b981" },
      blue: { bg: "#dbeafe", text: "#1e40af", solid: "#3b82f6" },
      amber: { bg: "#fef3c7", text: "#92400e", solid: "#f59e0b" },
      purple: { bg: "#ede9fe", text: "#5b21b6", solid: "#8b5cf6" },
      red: { bg: "#fee2e2", text: "#991b1b", solid: "#ef4444" }
    }
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    "4xl": "40px"
  },
  borderRadius: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px"
  }
};

// Helper functions for generating inline styles
const helpers = {
  container: () => `
        font-family: ${styles.fonts.primary};
        max-width: 560px;
        margin: 0 auto;
        padding: 40px 24px;
        background-color: ${styles.colors.background.white};
    `,

  // Logo header - minimal design
  logoHeader: () => `
        <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid ${styles.colors.border.light};">
            <img src="${LOGO_URL}" alt="BigDaddy Prints" width="80" height="80" style="border-radius: 50%;">
        </div>
    `,

  card: () => `
        background-color: ${styles.colors.background.light};
        border: 1px solid ${styles.colors.border.default};
        border-radius: ${styles.borderRadius.xl};
        padding: 24px;
    `,

  title: () => `
        color: ${styles.colors.text.primary};
        font-size: 24px;
        font-weight: 600;
        line-height: 1.3;
        margin: 0;
    `,

  subtitle: () => `
        color: ${styles.colors.text.primary};
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        margin: 0;
    `,

  body: () => `
        color: ${styles.colors.text.secondary};
        font-size: 15px;
        font-weight: 400;
        line-height: 1.6;
        margin: 0;
    `,

  label: () => `
        color: ${styles.colors.text.muted};
        font-size: 11px;
        font-weight: 500;
        line-height: 1.4;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        margin: 0 0 4px;
    `,

  value: () => `
        color: ${styles.colors.text.primary};
        font-size: 15px;
        font-weight: 500;
        line-height: 1.5;
        margin: 0;
    `,

  badge: (bgColor, textColor) => `
        display: inline-block;
        background-color: ${bgColor};
        color: ${textColor};
        padding: 4px 10px;
        border-radius: ${styles.borderRadius.sm};
        font-size: 12px;
        font-weight: 500;
    `,

  buttonPrimary: () => `
        display: inline-block;
        background-color: ${styles.colors.text.primary};
        color: ${styles.colors.background.white};
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 10px;
        font-weight: 500;
        font-size: 14px;
    `,

  buttonSecondary: () => `
        display: inline-block;
        background-color: ${styles.colors.background.white};
        color: ${styles.colors.text.primary};
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 10px;
        font-weight: 500;
        font-size: 14px;
        border: 1px solid ${styles.colors.border.default};
    `,

  buttonSuccess: () => `
        display: inline-block;
        background-color: ${styles.colors.accent.emerald.solid};
        color: ${styles.colors.background.white};
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 10px;
        font-weight: 500;
        font-size: 14px;
    `,

  buttonDanger: () => `
        display: inline-block;
        background-color: ${styles.colors.accent.red.solid};
        color: ${styles.colors.background.white};
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 10px;
        font-weight: 500;
        font-size: 14px;
    `,

  footer: () => `
        border-top: 1px solid ${styles.colors.border.default};
        padding-top: 24px;
        text-align: center;
    `,

  footerText: () => `
        color: ${styles.colors.text.light};
        font-size: 12px;
        margin: 0;
    `
};

module.exports = { styles, helpers, LOGO_URL };
