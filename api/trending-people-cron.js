const trendingPeople = require("./trending-people");

module.exports = async function trendingPeopleCron(request, response) {
  const separator = String(request.url || "").includes("?") ? "&" : "?";
  request.url = `${request.url}${separator}cron=1`;
  return trendingPeople(request, response);
};
