module.exports = {
  ci: {
    collect: {
      settings: {chromeFlags: '--no-sandbox'},
      staticDistDir: './_site',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};