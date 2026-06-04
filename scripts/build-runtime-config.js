const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const outputPath = path.join(rootDir, "runtime-config.js");
const distOutputPath = path.join(distDir, "runtime-config.js");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((result, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        return result;
      }

      const [key, ...valueParts] = trimmed.split("=");
      result[key.trim()] = valueParts.join("=").trim();
      return result;
    }, {});
}

const fileEnv = readEnvFile(path.join(rootDir, ".env"));
const config = {
  supabaseUrl: process.env.SUPABASE_URL || fileEnv.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || fileEnv.SUPABASE_ANON_KEY || "",
  dataSource: process.env.APP_DATA_SOURCE || fileEnv.APP_DATA_SOURCE || "local"
};

const contents = `window.__APP_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`;

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

["index.html", "styles.css", "app.js"].forEach((fileName) => {
  fs.copyFileSync(path.join(rootDir, fileName), path.join(distDir, fileName));
});

fs.writeFileSync(outputPath, contents, "utf8");
fs.writeFileSync(distOutputPath, contents, "utf8");
console.log(`Runtime config written to ${path.relative(rootDir, outputPath)}`);
console.log(`Static build written to ${path.relative(rootDir, distDir)}`);
