const { execSync } = require("child_process");

try {
  console.log("🔧 Checking SWC dependencies...");
  execSync("npm install --save-optional @next/swc-win32-x64-msvc @next/swc-linux-x64-gnu @next/swc-linux-arm64-gnu @next/swc-darwin-arm64 @next/swc-darwin-x64", { stdio: "inherit" });
  console.log("✅ SWC dependencies installed");
} catch (err) {
  console.error("⚠️ Failed installing SWC deps:", err);
}
