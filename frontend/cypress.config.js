module.exports = {
  e2e: {
    baseUrl: 'http://frontend-server-test:3000/discov-cursor',
    supportFile: false,
    reporter: 'junit',
    reporterOptions: {
      mochaFile: './test-results/04-frontend-e2e-junit.xml',
      toConsole: true,
      suiteTitleSeparatedBy: ' > '
    }
  }
}; 