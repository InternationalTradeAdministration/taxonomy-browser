if (process.env.NODE_ENV === 'production') {
  module.exports = {
    BASE_URL: "https://api.trade.gov", // To Do: update
    ACCESS_TOKEN: "access_token",
  }
} else if (process.env.NODE_ENV === 'staging') {
  module.exports = {
    BASE_URL: "https://api.govwizely.com",
    ACCESS_TOKEN: "access_token",
  }
} else {
  module.exports = {
    BASE_URL: "https://api.govwizely.com",
    ACCESS_TOKEN: "access_token",
  }
}