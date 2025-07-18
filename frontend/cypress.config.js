module.exports = {
  e2e: {
    baseUrl: 'http://frontend:3000',
    supportFile: false,
    reporter: 'junit',
    reporterOptions: {
      mochaFile: './test-results/frontend-e2e-junit.xml',
      toConsole: true
    }
  }
}; 