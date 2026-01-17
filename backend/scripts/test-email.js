const emailWorker = require('../services/emailWorker');

async function testEmail() {
  try {
    console.log('Attempting to send test email...');
    await emailWorker.sendEmail({
      from: "TestClient <testclient@hackersdaddy.com>",
      to: 'ajith.d19@gmail.com', // Sending to self for test
      subject: 'SMTP Connection Test',
      html: '<h1>Connection Successful</h1><p>The email worker is correctly configured.</p>'
    });
    console.log('✓ Email sent successfully!');
  } catch (error) {
    console.error('⨯ Email failed to send:', error);
  }
}

testEmail();
