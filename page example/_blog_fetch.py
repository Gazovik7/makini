"""Parses the saved live post pages (makini.io/blog/<slug>) into _blog_full.json: the complete content of the live blog.

    python -I -X utf8 "page example/_blog_fetch.py" <folder with <slug>.html files>

For each post: title, author (+ photo), date text, read time, category, deck, cover image, and the verbatim body HTML."""
import json
import os
import re
import sys
import html as H

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1]
OUT = os.path.join(HERE, "_blog_full.json")


def balanced(h, start):
    """h[start] is the '<' of a <div ...>. Returns the inner HTML up to its matching </div>."""
    i = h.index(">", start) + 1
    depth, pos = 1, i
    for m in re.finditer(r"<(/?)div\b", h[i:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            return h[i:i + m.start()]
    raise ValueError("unbalanced")


def grab(h, pat):
    m = re.search(pat, h, re.S)
    return H.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip() if m else ""


out = []
for f in sorted(os.listdir(SRC)):
    if not f.endswith(".html") or f == "blog.html":
        continue
    h = open(os.path.join(SRC, f), encoding="utf-8").read()
    slug = f[:-5]
    i = h.index('<div class="post-text w-richtext">')
    body = balanced(h, i)
    cover = re.search(r'<img alt="[^"]*" loading="lazy" src="([^"]+)"[^>]*class="post-title-img"', h)
    reads = re.findall(r'<div class="post-author-data">([^<]*)</div>', h)
    out.append(dict(
        slug=slug,
        title=grab(h, r'<h1 class="post-h1">(.*?)</h1>'),
        author=grab(h, r'<div class="post-author-name">(.*?)</div>'),
        author_img=(re.search(r'<img[^>]+src="([^"]+)"[^>]*class="post-author-img"', h) or [None, ""])[1],
        date=reads[0].strip() if reads else "",
        read=reads[1].strip() if len(reads) > 1 else "",
        category=grab(h, r'<div class="category">(.*?)</div>'),
        deck=grab(h, r'<div class="post-subheading">(.*?)</div>'),
        cover=cover.group(1) if cover else "",
        body=body))
json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for p in out:
    print(p["slug"][:48].ljust(48), "|", p["author"], "|", p["date"], "|", p["read"], "|", p["category"], "| body", len(p["body"]), "| cover", bool(p["cover"]))
