"""Builds both article pages of the new blog:

    blog-article.html              the filler article ("fish"), every component of a long read
    blog-article-servicetitan.html a REAL article, the ServiceTitan guide, text copied verbatim from the old post template
                                   (_build_blog_pages.py, which got it from the live blog) and re-marked up for this design

    python -I -X utf8 "page example/_build_blog_articles.py"
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import _build_blog_article as A  # noqa: E402
from _ct_shell import page  # noqa: E402

# ---------------------------------------------------------------- the real text
src = open(os.path.join(HERE, "_build_blog_pages.py"), encoding="utf-8").read()
BODY = re.search(r"BODY = r'''(.*?)'''", src, re.S).group(1).strip()
BODY = re.sub(r'^<div class="post-text w-richtext">', "", BODY)
BODY = re.sub(r"</div>$", "", BODY)
BODY = BODY.replace("<p>‍</p>", "")

TITLE = "ServiceTitan - How do I connect via API Authentication?"
DECK = ("This guide walks you through registering a Makini app in the ServiceTitan Developer Portal, connecting it to your ServiceTitan "
        "installation, and retrieving the credentials needed to complete your Makini integration.")
COVER = A.SP + "22-pump-service.webp"


def plain(h):
    return re.sub(r"<[^>]+>", "", h).replace("&amp;", "&").strip()


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def top_li(ol_html):
    depth, n = 0, 0
    for m in re.finditer(r"</?(ul|ol|li)\b[^>]*>", ol_html):
        tag, closing = m.group(1), m.group(0).startswith("</")
        if tag in ("ul", "ol"):
            depth += -1 if closing else 1
        elif tag == "li" and not closing and depth == 1:
            n += 1
    return n


def prep(b):
    """Markup that only some live posts have: spacer paragraphs, quotes, tables."""
    b = b.replace("<p>‍</p>", "")
    # an "Important" note written as a blockquote becomes the same callout as the paragraph version
    b = re.sub(r"<blockquote>\s*(?:<p>)?❗️?<strong>([^<]*?):</strong>\s*(.*?)(?:</p>)?\s*</blockquote>",
               lambda m: "<p>❗️<strong>%s:</strong> %s</p>" % (m.group(1), m.group(2)), b, flags=re.S)
    # a quote, with the line right after it (<sub>Name</sub>) as its source
    def quote(m):
        inner = re.sub(r"^<p>(.*)</p>$", lambda k: k.group(1), m.group(1).strip(), flags=re.S)
        cite = m.group(2)
        return '<blockquote class="ba-quote"><p>%s</p>%s</blockquote>' % (inner, "<cite>%s</cite>" % cite if cite else "")
    b = re.sub(r"<blockquote>(.*?)</blockquote>(?:<p><sub>(.*?)</sub></p>)?", quote, b, flags=re.S)
    # tables: drop the inline styling, first row of th cells becomes the head, wrap for sideways scroll
    def table(m):
        t = re.sub(r"\s(?:style|width|border|cellspacing|cellpadding)=\"[^\"]*\"", "", m.group(0))
        t = re.sub(r"<tr>\s*((?:<th>.*?</th>\s*)+)</tr>", lambda k: "<thead><tr>%s</tr></thead><tbody>" % k.group(1), t, count=1, flags=re.S)
        t = t.replace("</table>", "</tbody></table>") if "<tbody>" in t else t
        return '<div class="ba-table">%s</div>' % t
    return re.sub(r"<table\b.*?</table>", table, b, flags=re.S)


def convert(body):
    body = prep(body)
    parts = re.split(r"(<h2>.*?</h2>|<h3>.*?</h3>)", body, flags=re.S)
    out, secs, h2n, running, used = [], [], 0, 0, set()

    def uid(t):
        base, n, i = slug(t), 1, slug(t)
        while i in used:
            n += 1
            i = "%s-%d" % (base, n)
        used.add(i)
        return i
    for part in parts:
        if part.startswith("<h2>"):
            t = plain(part)
            h2n += 1
            running = 0
            i = uid(t)
            secs.append((i, t, []))
            out.append('<h2 id="%s">%s</h2>' % (i, t))
            continue
        if part.startswith("<h3>"):
            t = plain(part)
            running = 0
            i = uid(t)
            if secs:
                secs[-1][2].append((i, t))
            else:
                secs.append((i, t, []))  # a post that opens with an H3: it leads the contents list
            out.append('<h3 id="%s">%s</h3>' % (i, t))
            continue
        x = part
        # numbered lists keep counting across the figures, as in the live post
        def ol(m):
            nonlocal running
            html = m.group(0)
            start = running
            running += top_li(html)
            style = ' style="counter-reset:s %d"' % start if start else ""
            return re.sub(r'^<ol( role="list")?>', '<ol class="ba-steps"%s>' % style, html, count=1)
        x = re.sub(r'<ol(?: role="list")?>.*?</ol>(?=<|$)', ol, x, flags=re.S)
        x = x.replace('<ul role="list">', "<ul>")
        # "Important" paragraphs become callouts
        x = re.sub(r"<p>❗️?<strong>([^<]*?):</strong>\s*(.*?)</p>",
                   lambda m: '<aside class="ba-note is-warn"><span class="ba-note-t">%s</span><p>%s</p></aside>' % (m.group(1), m.group(2)), x, flags=re.S)
        # figures
        def fig2_out(alt, src):
            alt = "" if alt.startswith("continue-ol") else alt
            return '<figure class="ba-fig"><img src="%s" alt="%s" loading="lazy"></figure>' % (src, alt)
        def fig2(m):
            img = m.group(1)
            alt, src = re.search(r'alt="([^"]*)"', img), re.search(r'src="([^"]+)"', img)
            return fig2_out(alt.group(1) if alt else "", src.group(1))
        x = re.sub(r'<figure[^>]*>\s*<div>\s*(<img[^>]*>)\s*</div>\s*</figure>', fig2, x)
        # bold-only paragraphs are small headings
        x = re.sub(r"<p><strong>([^<]+)</strong></p>", r"<h4>\1</h4>", x)
        out.append(x)
    return "".join(out), secs


ARTICLE_REAL, SECS = convert(BODY)

RELATED = [
    ("guide", "Aug 7, 2024", "Odoo - How do I connect via API Authentication?", "How to connect Odoo to Makini with API authentication.", "18-automotive-line.webp", "6 min read"),
    ("guide", "May 20, 2025", "NetSuite - How do I link via Machine to Machine (M2M) setup", "How to link NetSuite to Makini with a Machine to Machine (M2M) setup.", "13-rf-scanning.webp", "7 min read"),
    ("guide", "Jun 20, 2026", "Fishbowl Advanced - How do I connect via API Authentication?", "How to connect Fishbowl Advanced to Makini with API authentication.", "07-pallet-stock.webp", "4 min read"),
]
TAGS = ('<div class="ba-tags"><span>Topics</span><a href="blog-v2.html?q=servicetitan">ServiceTitan</a>'
        '<a href="blog-v2.html">API authentication</a><a href="blog-v2.html?type=guides">Connection guides</a></div>')
HELP = ('<div class="ba-box"><span class="ba-box-t">Need help?</span><p class="ba-help-p">Contact Makini support at '
        '<a href="mailto:support@makini.io">support@makini.io</a></p></div>')


def real_page():
    html = A.make_main(
        title=TITLE, deck=DECK, cover=COVER, article=ARTICLE_REAL,
        toc=A.toc("ba-toc-l", SECS), toc_in=A.toc("ba-toc-l", SECS),
        date_iso="2026-05-12", date_h="May 12, 2026", read="5 min read", plats="ServiceTitan",
        tags=TAGS, bio=A.BIO,
        side_plats='<li><a href="#">ServiceTitan</a></li>',
        pn=A.pn("Odoo - How do I connect via API Authentication?", "Fishbowl Advanced - How do I connect via API Authentication?"),
        rel="".join(A.rel_card(t) for t in RELATED))
    # a real post has a help box with the support address from the copy, before the newsletter
    return html.replace('<div class="ba-box ba-box-n">', HELP + '<div class="ba-box ba-box-n">', 1)


# ---------------------------------------------------------------- real article 2: an opinion piece, text only
D_TITLE = "Direct vs. third-party MCP servers: the industrial edition"
D_COVER = A.SP + "23-terminal-agv.webp"


def direct_body():
    """Live text of the post, words untouched. Structure only: the first paragraph becomes the deck, the second the lead,
    the four bold-title paragraphs become h3 + p, empty spacer paragraphs go."""
    b = open(os.path.join(HERE, "_blog_src_direct.html"), encoding="utf-8").read().strip()
    b = re.sub(r'^<div class="post-text w-richtext">', "", b)
    b = re.sub(r"</div>$", "", b)
    b = b.replace("<p>‍</p>", "")
    paras = re.findall(r"<p>.*?</p>", b[: b.index("<h2>")], flags=re.S)
    deck = plain(paras[0])
    b = b.replace(paras[0], "", 1)
    b = b.replace("<p>", '<p class="ba-lead">', 1)
    b = re.sub(r"<p><strong>([^<]+)</strong><br\s*/?>(.*?)</p>", r"<h3>\1</h3><p>\2</p>", b, flags=re.S)
    return deck, b


def direct_page():
    deck, body = direct_body()
    html_, secs = convert(body)
    rel = [
        ("announcement", "Jun 24, 2026", "Introducing Makini MCP: your agent can finally touch the real world", "Makini MCP connects any AI agent to industrial systems through one connection.", "09-autonomous-pallet.webp", "4 min read"),
        ("expert opinion", "Jun 27, 2024", "iPaaS solutions for enterprise integrations", "iPaaS solutions for enterprise integrations.", "15-automated-storage.webp", "10 min read"),
        ("expert opinion", "Mar 9, 2023", "Differentiate with EAM/ERP/WMS integrations", "Why EAM, ERP and WMS integrations help you stand out.", "03-forklift-racking.webp", "3 min read"),
    ]
    tags = ('<div class="ba-tags"><span>Topics</span><a href="blog-v2.html?q=mcp">MCP servers</a>'
            '<a href="blog-v2.html?type=opinion">Expert opinion</a><a href="blog-v2.html?q=agents">AI agents</a></div>')
    return A.make_main(
        title=D_TITLE, deck=deck, cover=D_COVER, article=html_,
        toc=A.toc("ba-toc-l", secs), toc_in=A.toc("ba-toc-l", secs),
        date_iso="2026-07-01", date_h="Jul 1, 2026", read="5 min read", plats="",
        tags=tags, bio="", side_plats="", crumb="Expert opinion", crumb_href="blog-v2.html?type=opinion",
        type_label="Expert opinion", author="George Surovtsev", role="CEO", photo="george.jpg",
        news_text="One short email when a new post is published.",
        pn=A.pn("iPaaS solutions for enterprise integrations", "Introducing Makini MCP: your agent can finally touch the real world"),
        rel="".join(A.rel_card(t) for t in rel))


# ---------------------------------------------------------------- real article 3: a connection guide (Fishbowl Advanced)
F_TITLE = "Fishbowl Advanced - How do I connect via API Authentication?"
F_DECK = ("This guide walks you through preparing your Fishbowl Advanced server, approving Makini as an Integrated App, "
          "and submitting the credentials needed to complete your Makini integration.")


def fishbowl_page():
    b = open(os.path.join(HERE, "_blog_src_fishbowl.html"), encoding="utf-8").read().strip()
    b = re.sub(r'^<div class="post-text w-richtext">', "", b)
    b = re.sub(r"</div>$", "", b)
    html_, secs = convert(b)
    rel = [
        ("guide", "May 12, 2026", "ServiceTitan - How do I connect via API Authentication?", "How to connect ServiceTitan to Makini with API authentication.", "22-pump-service.webp", "5 min read"),
        ("guide", "Aug 7, 2024", "Odoo - How do I connect via API Authentication?", "How to connect Odoo to Makini with API authentication.", "18-automotive-line.webp", "6 min read"),
        ("guide", "May 20, 2025", "NetSuite - How do I link via Machine to Machine (M2M) setup", "How to link NetSuite to Makini with a Machine to Machine (M2M) setup.", "13-rf-scanning.webp", "7 min read"),
    ]
    tags = ('<div class="ba-tags"><span>Topics</span><a href="blog-v2.html?q=fishbowl">Fishbowl Advanced</a>'
            '<a href="blog-v2.html">API authentication</a><a href="blog-v2.html?type=guides">Connection guides</a></div>')
    return A.make_main(
        title=F_TITLE, deck=F_DECK, cover=A.SP + "07-pallet-stock.webp", article=html_,
        toc=A.toc("ba-toc-l", secs), toc_in=A.toc("ba-toc-l", secs),
        date_iso="2026-06-20", date_h="Jun 20, 2026", read="4 min read", plats="Fishbowl Advanced",
        tags=tags, bio=A.BIO, side_plats='<li><a href="#">Fishbowl Advanced</a></li>',
        pn=A.pn("ServiceTitan - How do I connect via API Authentication?", "Odoo - How do I connect via API Authentication?"),
        rel="".join(A.rel_card(t) for t in rel))


if __name__ == "__main__":
    for name, main in (("blog-article.html", A.MAIN), ("blog-article-servicetitan.html", real_page()),
                       ("blog-article-direct-vs-third-party.html", direct_page()),
                       ("blog-article-fishbowl.html", fishbowl_page())):
        out = page("Article | Makini review", main, head_extra=A.HEAD, tail_extra=A.TAIL)
        with open(os.path.join(HERE, name), "w", encoding="utf-8", newline="") as f:
            f.write(out)
        print("wrote", name, len(out))
