describe('Health Check Endpoint', () => {
  it('should return healthy status', () => {
    cy.request({
      method: 'GET',
      url: '/health',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('status', 'healthy');
      expect(response.body).to.have.property('timestamp');
      expect(response.body).to.have.property('uptime');
    });
  });
});

describe('Basic API Routes', () => {
  it('should return 200 for root endpoint', () => {
    cy.request({
      method: 'GET',
      url: '/',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.contain('Hello, World!');
    });
  });
});

describe('Rate Limiting', () => {
  it('should limit requests to 100 per 15 minutes', () => {
    // This test would need to be run in isolation to avoid interference
    // from other tests hitting the same endpoint
    const requests = Array(101).fill(null);

    // Make 101 requests to trigger rate limiting
    const promises = requests.map(() =>
      cy.request({
        method: 'GET',
        url: '/health',
        failOnStatusCode: false
      })
    );

    // Wait for all requests to complete
    cy.wrap(Promise.all(promises)).then((responses) => {
      const successResponses = responses.filter(r => r.status === 200);
      const rateLimitedResponses = responses.filter(r => r.status === 429);

      // Should have 100 successful responses and 1 rate limited response
      expect(successResponses.length).to.be.at.least(100);
      expect(rateLimitedResponses.length).to.be.at.least(1);
    });
  });
});
