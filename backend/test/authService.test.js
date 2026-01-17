// Load test setup first
require('./setup');

const { expect } = require('chai');
const sinon = require('sinon');
const authService = require('../services/authService');
const User = require('../models/usersModel');
const Company = require('../models/companyModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Auth Service', () => {
  describe('login', () => {
    let findOneStub, compareStub, findOneCompanyStub, setExStub;

    beforeEach(() => {
      findOneStub = sinon.stub(User, 'findOne');
      compareStub = sinon.stub(bcrypt, 'compare');
      findOneCompanyStub = sinon.stub(Company, 'findOne');
      setExStub = sinon.stub().resolves(true);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should throw error if user not found', async () => {
      findOneStub.resolves(null);

      try {
        await authService.login('nonexistent@example.com', 'password');
        throw new Error('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Invalid email or password.');
      }
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        name: 'Test User',
        role: ['user'],
        isSuperAdmin: false,
        companyId: 'company123'
      };

      findOneStub.resolves(mockUser);
      compareStub.resolves(false);

      try {
        await authService.login('test@example.com', 'wrongpassword');
        throw new Error('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Invalid email or password.');
      }
    });

    it('should throw error if company not found', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        name: 'Test User',
        role: ['user'],
        isSuperAdmin: false,
        companyId: 'company123'
      };

      findOneStub.resolves(mockUser);
      compareStub.resolves(true);
      findOneCompanyStub.resolves(null);

      try {
        await authService.login('test@example.com', 'correctpassword');
        throw new Error('Should have thrown');
      } catch (err) {
        expect(err.message).to.equal('Company not found.');
      }
    });

    it('should return token and user data on successful login', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        name: 'Test User',
        role: ['user'],
        isSuperAdmin: false,
        companyId: 'company123'
      };

      const mockCompany = {
        _id: 'company123',
        companyName: 'Test Company',
        companyEmail: 'company@example.com',
        currency: 'USD',
        timezone: 'UTC',
        logoUrl: 'logo.png',
        alertSettings: {}
      };

      findOneStub.resolves(mockUser);
      compareStub.resolves(true);
      findOneCompanyStub.resolves(mockCompany);

      const result = await authService.login('abhishekshukl12897@gmail.com', 'abhishek@123');

      expect(result).to.have.property('token');
      expect(result).to.have.property('user');
      expect(result).to.have.property('company');
      expect(result.user.email).to.equal('test@example.com');
      expect(result.company.companyName).to.equal('Test Company');
    });
  });
});
