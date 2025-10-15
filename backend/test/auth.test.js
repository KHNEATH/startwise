// Basic backend tests for CI/CD pipeline
describe('Backend Setup', () => {
  it('should load environment variables', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should validate basic app structure', () => {
    const fs = require('fs');
    expect(fs.existsSync('./server.js')).toBe(true);
    expect(fs.existsSync('./package.json')).toBe(true);
  });

  it('should load required modules', () => {
    expect(() => require('express')).not.toThrow();
    expect(() => require('cors')).not.toThrow();
    expect(() => require('bcryptjs')).not.toThrow();
  });
});
