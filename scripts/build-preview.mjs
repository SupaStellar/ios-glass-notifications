import * as esbuild from "esbuild"
import { readFileSync, writeFileSync } from "node:fs"

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8")

const result = await esbuild.build({
  stdin: {
    contents: `import { createRoot } from "react-dom/client"
import App from "./src/App.jsx"
createRoot(document.getElementById("root")).render(<App />)
`,
    resolveDir: new URL("..", import.meta.url).pathname,
    loader: "jsx",
  },
  bundle: true,
  format: "iife",
  jsx: "automatic",
  minify: true,
  write: false,
  loader: { ".svg": "dataurl" },
  logLevel: "warning",
})

const js = result.outputFiles[0].text

writeFileSync(
  new URL("../preview.html", import.meta.url),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>iOS glass notifications</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${js}
    </script>
  </body>
</html>
`
)

console.log("wrote preview.html")
