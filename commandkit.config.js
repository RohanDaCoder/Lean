const { defineConfig } = require("commandkit");

module.exports = defineConfig({
	main: "index.js",
	watch: true,
	outDir: "dist",
	minify: false,
	sourcemap: true,
	antiCrash: true
});
