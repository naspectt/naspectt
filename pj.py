#!/usr/bin/env python3

import sys
import re
import time
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from urllib.parse import urlparse

def fetch_html(url: str):
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    start = time.time()
    try:
        with urlopen(req, timeout=10) as resp:
            raw = resp.read()
            html = raw.decode('utf-8', errors='ignore')
    except (HTTPError, URLError) as e:
        print(f"[ERROR] Impossible de récupérer {url} → {e}")
        sys.exit(1)
    elapsed = time.time() - start
    return html, elapsed

def check_https(url: str):
    ok = urlparse(url).scheme == 'https'
    return "✔ HTTPS activé" if ok else "✖ HTTPS manquant"
#fait par naspect 
def check_performance(elapsed: float):
    ok = elapsed < 2.5
    status = "✔" if ok else "✖"
    return f"{status} Temps de réponse : {elapsed:.2f}s"

def check_title(html: str):
    m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    length = len(m.group(1).strip()) if m else 0
    status = "✔" if 10 <= length <= 70 else "✖"
    return f"{status} Balise <title> : {length} caractères"

def check_meta_description(html: str):
    pattern = r"<meta\s+name=['\"]description['\"]\s+content=['\"](.*?)['\"]"
    m = re.search(pattern, html, re.IGNORECASE | re.DOTALL)
    length = len(m.group(1).strip()) if m else 0
    status = "✔" if 50 <= length <= 160 else "✖"
    return f"{status} Meta description : {length} caractères"

def check_headings(html: str):
    count = len(re.findall(r'<h1\b', html, re.IGNORECASE))
    status = "✔" if count == 1 else "✖"
    return f"{status} {count} balise(s) <h1>"

def check_images_alt(html: str):
    imgs = re.findall(r'<img\b[^>]*>', html, re.IGNORECASE)
    with_alt = [img for img in imgs if re.search(r"\balt\s*=\s*['\"].*?['\"]", img, re.IGNORECASE)]
    missing = len(imgs) - len(with_alt)
    status = "✔" if missing == 0 else "✖"
    return f"{status} Images sans alt : {missing} / {len(imgs)}"

def check_viewport(html: str):
    pattern = r"<meta\s+name=['\"]viewport['\"]"
    ok = bool(re.search(pattern, html, re.IGNORECASE))
    status = "✔" if ok else "✖"
    return f"{status} Meta viewport présent"

def run_audit(url: str):
    html, elapsed = fetch_html(url)
    checks = [
        check_https(url),
        check_performance(elapsed),
        check_title(html),
        check_meta_description(html),
        check_headings(html),
        check_images_alt(html),
        check_viewport(html),
    ]
    passed = sum(1 for line in checks if line.startswith("✔"))
    total = len(checks)
    score = int(passed / total * 100)
    bar = '█' * (score // 5) + '-' * (20 - score // 5)

    print(f"\nAudit de {url} — {passed}/{total} OK — Score: {score}/100")
    print(bar, '\n')
    for line in checks:
        print(line)
    print()

def main():
    if len(sys.argv) < 2:
        url = input("Entrez l'URL du site à tester : ").strip()
    else:
        url = sys.argv[1]
    if not url:
        print("URL invalide.")
        sys.exit(1)
    run_audit(url)

if __name__ == "__main__":
    main()
