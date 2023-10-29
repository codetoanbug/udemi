const DEPLOY_ENV = process.env.DEPLOY_ENV || "local";

const monolithPublicEndpoints = {
  local: "https://monolith.devs-useast1.dev-ud.com",
  // only needed to enable pre-rendering pages in CI
  dev: "https://monolith.devs-useast1.dev-ud.com",
  // only needed to enable pre-rendering pages in CI
  prod: "https://www.udemy.com",
};

const monolithInternalUrls = {
  local: "https://monolith.devs-useast1.dev-ud.com",
  dev: "http://monolith.egress.svc.cluster.local",
  prod: "http://monolith.egress.svc.cluster.local",
};

const graphQLPublicEndpoints = {
  local: "https://monolith.devs-useast1.dev-ud.com/api/2022-03/graphql/",
  // only needed to enable pre-rendering pages in CI
  dev: "https://monolith.devs-useast1.dev-ud.com/api/2022-03/graphql/",
  // only needed to enable pre-rendering pages in CI
  prod: "https://www.udemy.com/api/2022-03/graphql/",
};

const graphQLInternalEndpoints = {
  local: "https://monolith.devs-useast1.dev-ud.com/api/2022-03/graphql/",
  dev: "http://api-platform-graphql.api-platform.svc.cluster.local/graphql/",
  prod: "http://api-platform-graphql.api-platform.svc.cluster.local/graphql/",
};

module.exports = {
  internalConfig: {
    GRAPHQL_URL:
      process.env.INTERNAL_GRAPHQL_URL ?? graphQLInternalEndpoints[DEPLOY_ENV],
    MONOLITH_URL:
      process.env.INTERNAL_MONOLITH_URL ?? monolithInternalUrls[DEPLOY_ENV],
  },
  publicConfig: {
    GRAPHQL_URL:
      process.env.NEXT_PUBLIC_GRAPHQL_URL ?? graphQLPublicEndpoints[DEPLOY_ENV],
    MONOLITH_URL:
      process.env.NEXT_PUBLIC_MONOLITH_URL ??
      monolithPublicEndpoints[DEPLOY_ENV],
  },
};
