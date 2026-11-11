// Metro config for a pnpm/Turborepo monorepo.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Always resolve React / React Native from this app, so the bundle never
// contains two React instances (classic "Invalid hook call" / "useMemo of null").
const SINGLETONS = ['react', 'react-native'];
const appOrigin = path.join(projectRoot, 'package.json');
const previous = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = SINGLETONS.some((n) => moduleName === n || moduleName.startsWith(`${n}/`));
  const ctx = isSingleton ? { ...context, originModulePath: appOrigin } : context;
  return (previous ?? context.resolveRequest)(ctx, moduleName, platform);
};

module.exports = config;
