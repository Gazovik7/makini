"""Version B of the blog: the complete content of the live makini.io/blog moved into the new design.

All 15 live posts become real article pages (blog-full-<slug>.html) with the live text word for word, the live cover and
every image of the post. The listing (blog-v2.html, switch "B") reads assets/content/blog-full-data.js made here.

    python -I -X utf8 "page example/_blog_fetch.py" <folder with the saved live pages>     # once, makes _blog_full.json
    python -I -X utf8 "page example/_build_blog_full.py"                                  # pages + listing data
"""
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import _build_blog_article as A  # noqa: E402
from _build_blog_articles import convert, plain  # noqa: E402
from _ct_shell import page  # noqa: E402

LIVE_DIR = os.path.join(HERE, "assets", "content", "live")
PEOPLE_DIR = os.path.join(HERE, "assets", "content", "people")
POSTS = json.load(open(os.path.join(HERE, "_blog_full.json"), encoding="utf-8"))

# titles, types, platforms, ISO dates and read times of the live posts: the data layer of the current blog
META = {p["slug"]: p for p in json.loads(subprocess.check_output(
    ["node", "-e", "global.window={};require('./assets/content/blog-data.js');console.log(JSON.stringify(window.BLOG_DATA.posts))"], cwd=HERE, encoding="utf-8"))
    if not p.get("sample")}

TYPE_TAB = {"announcement": "releases", "product-update": "releases", "guide": "guides", "agent-guide": "guides",
            "opinion": "insights", "company-news": "company", "partnership": "company", "case-study": "customers"}
TYPE_LABEL = {"announcement": "Announcement", "guide": "Guide", "opinion": "Expert opinion", "company-news": "Company news",
              "partnership": "Partnership", "product-update": "Product update", "agent-guide": "Agent guide", "case-study": "Case study"}
ROLE = {"George Surovtsev": ("george.jpg", "CEO"), "Roman Kinyakin": ("roman.jpg", "CTO")}
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def fmt(iso):
    y, m, d = iso.split("-")
    return "%s %d, %s" % (MONTHS[int(m) - 1], int(d), y)


def fetch(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())


def _spectrum():
    """Article and related-card covers use the Spectrum set from blog-live.js (soft Makini palette), the live covers are too contrasty."""
    t = open(os.path.join(HERE, "assets", "content", "blog-live.js"), encoding="utf-8").read()
    return dict(re.findall(r"'([a-z0-9-]+)':'(\./assets/use-cases/processed/spectrum/[^']+)'", t))


SPECTRUM = _spectrum()


def local_img(url):
    """Downloads a CDN image once into assets/content/live and returns the relative path the pages use."""
    path = urllib.parse.urlparse(url).path
    stem, ext = os.path.splitext(urllib.parse.unquote(path.rsplit("/", 1)[-1]))
    name = re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower()[:60] + ext.lower()
    os.makedirs(LIVE_DIR, exist_ok=True)
    fetch(url, os.path.join(LIVE_DIR, name))
    return "./assets/content/live/" + name


def localize(html):
    return re.sub(r'src="(https://cdn\.prod\.website-files\.com/[^"]+)"', lambda m: 'src="%s"' % local_img(m.group(1)), html)


def author_photo(p):
    if p["author"] in ROLE:
        return ROLE[p["author"]]
    name = re.sub(r"[^a-z]+", "-", p["author"].lower()).strip("-") + ".webp"
    if p["author_img"]:
        fetch(p["author_img"], os.path.join(PEOPLE_DIR, name))
    return name, ""


def tag_links(m, p):
    tabs = TYPE_TAB.get(m["type"], "all")
    t = ['<a href="blog-v2.html?type=%s">%s</a>' % (tabs, TYPE_LABEL[m["type"]])]
    t += ['<a href="blog-v2.html?q=%s">%s</a>' % (urllib.parse.quote(x), x) for x in m["platforms"]]
    return '<div class="ba-tags"><span>Topics</span>%s</div>' % "".join(t)


def vkeep(html):
    """Links back to the listing keep the chosen version: ?v=full."""
    return re.sub(r'href="blog-v2\.html(\?[^"]*)?"', lambda m: 'href="blog-v2.html%sv=full"' % ((m.group(1) + "&") if m.group(1) else "?"), html)


def build():
    order = sorted(POSTS, key=lambda p: META[p["slug"]]["date"], reverse=True)
    info = {}
    for p in order:
        m = META[p["slug"]]
        info[p["slug"]] = dict(href="blog-full-%s.html" % p["slug"], cover=SPECTRUM.get(p["slug"]) or local_img(p["cover"]), meta=m, title=p["title"])
    out_posts = []
    for n, p in enumerate(order):
        m, s = META[p["slug"]], p["slug"]
        body = localize(p["body"])
        deck = p["deck"]
        if not deck:  # the live post has no subheading: its first paragraph is the deck, as on the Direct vs. third-party page
            first = re.search(r"<p>(.*?)</p>", body, re.S)
            deck = plain(first.group(1))
            body = body.replace(first.group(0), "", 1)
        art, secs = convert(body)
        photo, role = author_photo(p)
        toc = A.toc("ba-toc-l", secs) if secs else ""
        prev_p, next_p = order[(n - 1) % len(order)], order[(n + 1) % len(order)]
        rel = [q for q in order if q["slug"] != s and META[q["slug"]]["type"] == m["type"]][:3]
        rel += [q for q in order if q["slug"] != s and q not in rel][:3 - len(rel)]

        def card(q):
            i, mm = info[q["slug"]], META[q["slug"]]
            return ('<a class="ba-rc" href="%s"><div class="ba-rc-i"><img src="%s" alt="" loading="lazy"></div>'
                    '<div class="ba-rc-b"><div class="ba-rc-t"><span>%s</span><time>%s</time></div><h3>%s</h3><p>%s</p><span class="ba-rc-r">%s min read</span></div></a>'
                    % (i["href"], i["cover"], TYPE_LABEL[mm["type"]].lower(), fmt(mm["date"]), q["title"], mm["summary"], mm["read"]))
        pn = ('<nav class="ba-pn" aria-label="More posts"><a href="%s"><span>%s Previous</span><b>%s</b></a>'
              '<a href="%s" class="is-next"><span>Next %s</span><b>%s</b></a></nav>'
              % (info[prev_p["slug"]]["href"], A.IC["back"], prev_p["title"], info[next_p["slug"]]["href"], A.IC["arrow"], next_p["title"]))
        plats = ", ".join(m["platforms"])
        main = A.make_main(
            title=p["title"], deck=deck, cover=info[s]["cover"], article=art, toc=toc, toc_in=toc,
            date_iso=m["date"], date_h=fmt(m["date"]), read="%d min read" % m["read"], plats=plats,
            tags=tag_links(m, p), bio="", pn=pn, rel="".join(card(q) for q in rel),
            crumb=TYPE_LABEL[m["type"]], crumb_href="blog-v2.html?type=%s" % TYPE_TAB.get(m["type"], "all"), type_label=TYPE_LABEL[m["type"]],
            author=p["author"], role=role, photo=photo,
            side_box=('<div class="ba-box"><span class="ba-box-t">%s</span><ul class="ba-plats">%s</ul></div>' % (
                "Platforms in this guide" if m["type"] == "guide" else "Platforms",
                "".join('<li><a href="blog-v2.html?q=%s">%s</a></li>' % (urllib.parse.quote(x), x) for x in m["platforms"]))) if m["platforms"] else "",
            news_text="One short email when a new post is published.")
        if not secs:  # no headings in the post: no contents list, keep the grid column empty
            main = re.sub(r'<aside class="ba-toc".*?</aside>', '<aside class="ba-toc" aria-hidden="true"></aside>', main, count=1, flags=re.S)
            main = re.sub(r'<details class="ba-toc-in">.*?</details>', "", main, count=1, flags=re.S)
        main = vkeep(main)
        html = page(p["title"] + " | Makini review", main, head_extra=A.HEAD, tail_extra=A.TAIL)
        with open(os.path.join(HERE, info[s]["href"]), "w", encoding="utf-8", newline="") as f:
            f.write(html)
        out_posts.append(dict(slug=s, title=p["title"], type=m["type"], platforms=m["platforms"], agents=[], author=p["author"], date=m["date"],
                              read=m["read"], summary=m["summary"], cover=info[s]["cover"], href=info[s]["href"], feat=m.get("feat", 0) or 0))
        print("wrote", info[s]["href"], len(html), "| sections", len(secs), "| imgs", art.count("<img"))
    people = {k: dict(photo="./assets/content/people/" + v[0], role=v[1]) for k, v in ROLE.items()}
    for p in POSTS:
        if p["author"] not in people:
            people[p["author"]] = dict(photo="./assets/content/people/" + author_photo(p)[0], role="")
    js = "/* Version B of the blog: all live posts. Made by _build_blog_full.py, do not edit by hand. */\nwindow.BLOG_FULL=%s;\n" % json.dumps(
        dict(posts=out_posts, people=people), ensure_ascii=False, indent=1)
    with open(os.path.join(HERE, "assets", "content", "blog-full-data.js"), "w", encoding="utf-8", newline="") as f:
        f.write(js)


if __name__ == "__main__":
    build()
