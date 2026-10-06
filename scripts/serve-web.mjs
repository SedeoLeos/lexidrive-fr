import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".wav": "audio/wav",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let file = resolve(root, "." + decodeURIComponent(url.pathname));
      if (file !== root && !file.startsWith(root + "/")) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (file === root) file += "/index.html";
      let data;
      try {
        data = await readFile(file);
      } catch {
        if (extname(file)) throw Error("missing");
        file = root + "/index.html";
        data = await readFile(file);
      }
      res.writeHead(200, {
        "Content-Type": types[extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("Introuvable");
    }
  })
  .listen(8081, "127.0.0.1", () =>
    console.log("LexiDrive-fr : http://127.0.0.1:8081"),
  );
