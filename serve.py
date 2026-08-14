import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CleanUrlHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        clean_path = self.path.split('?')[0].split('#')[0]
        full_path = self.translate_path(clean_path)
        
        if not os.path.exists(full_path) and not os.path.splitext(clean_path)[1]:
            if os.path.exists(full_path + ".html"):
                query = self.path[len(clean_path):]
                self.path = clean_path + ".html" + query
                
        return super().do_GET()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CleanUrlHandler) as httpd:
        print(f"Serving at http://localhost:{PORT} with clean URLs enabled")
        httpd.serve_forever()
