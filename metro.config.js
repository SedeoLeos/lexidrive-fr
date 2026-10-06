const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const fs = require("fs");
const path = require("path");
const config = getDefaultConfig(__dirname);
// Optional local test adapter. Absent from a normal npm installation.
const adapter = path.join(__dirname, "node_modules/.lexidrive-local-deps.json");
if (fs.existsSync(adapter)) {
  config.watchFolders = JSON.parse(
    fs.readFileSync(adapter, "utf8"),
  ).watchFolders;
  config.resolver.nodeModulesPaths = [path.join(__dirname, "node_modules")];
  config.resolver.disableHierarchicalLookup = true;
}
module.exports = withNativeWind(config, { input: "./global.css" });
