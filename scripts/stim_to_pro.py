"""One-shot rebrand: STIM -> PRO across publisher-portal."""
import os, re

ROOT = os.path.join(
    "packages", "frontend", "public", "publisher-portal"
)

WORD_SUBS = [
    (re.compile(r"\bSTIM\b"), "PRO"),
    (re.compile(r"\bStim\b"), "Pro"),
    (re.compile(r"\bstim\b"), "pro"),
]

FILE_LINK_SUBS = [
    (re.compile(r"stim2-vps\.html"), "pro2-vps.html"),
    (re.compile(r"stim2\.html"), "pro2.html"),
    (re.compile(r"stim-documentation\.html"), "pro-documentation.html"),
]

SCAN_EXTS = (".html", ".js", ".css", ".json", ".md", ".mb")

def process(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            s = f.read()
    except UnicodeDecodeError:
        return 0
    orig = s
    for pat, rep in FILE_LINK_SUBS:
        s = pat.sub(rep, s)
    for pat, rep in WORD_SUBS:
        s = pat.sub(rep, s)
    if s != orig:
        with open(path, "w", encoding="utf-8", newline="") as f:
            f.write(s)
        return 1
    return 0

def main():
    changed = 0
    scanned = 0
    for dirpath, _, files in os.walk(ROOT):
        for name in files:
            if not name.lower().endswith(SCAN_EXTS):
                continue
            scanned += 1
            changed += process(os.path.join(dirpath, name))
    print(f"scanned={scanned} changed={changed}")

if __name__ == "__main__":
    main()
