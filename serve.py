#!/usr/bin/env python3
import re
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

PORT = 8877
ROOT = Path(__file__).resolve().parent
LOCAL_ASSET = re.compile(r"""((?:href|src)=)(["'])(\./[^"']+)\2""")


class NoCacheHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def translate_path(self, path):
        return super().translate_path(path.split("?", 1)[0])

    def _strip_conditional(self):
        for key in ("If-Modified-Since", "If-None-Match"):
            if key in self.headers:
                del self.headers[key]

    def do_HEAD(self):
        self._strip_conditional()
        super().do_HEAD()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ("/", "/index.html"):
            self.serve_index()
            return
        self._strip_conditional()
        super().do_GET()

    def serve_index(self):
        stamp = str(int(time.time() * 1000))
        html = (ROOT / "index.html").read_text(encoding="utf-8")

        def bust(match):
            attr, quote, url = match.group(1), match.group(2), match.group(3)
            rel = url.split("?", 1)[0]
            file = ROOT / rel[2:]
            version = str(int(file.stat().st_mtime * 1000)) if file.exists() else stamp
            return f"{attr}{quote}{rel}?v={version}{quote}"

        html = LOCAL_ASSET.sub(bust, html)
        data = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    ThreadingHTTPServer.allow_reuse_address = True
    server = ThreadingHTTPServer(("127.0.0.1", PORT), NoCacheHandler)
    print(f"http://127.0.0.1:{PORT}/")
    server.serve_forever()
