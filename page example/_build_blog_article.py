"""Builds blog-article.html: the article page of the new blog (same palettes and backgrounds as blog-v2.html).

The text is filler written for layout review ("fish"). It makes no product claims. Every component of a
long read is present: lead, numbered sections, lists, steps, table, quote, figure, video, code, callouts,
checklist, FAQ, call to action, tags, author, previous/next, related posts.

    python -I -X utf8 "page example/_build_blog_article.py"
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from _ct_shell import page  # noqa: E402

SP = "./assets/use-cases/processed/spectrum/"
COVER = SP + "21-parts-warehouse.webp"
FIG = SP + "13-rf-scanning.webp"

TITLE = "How to connect your CMMS to your ERP without losing data on the way"
DECK = ("Two systems of record only stay in agreement if a handful of decisions are made early: who owns each record, "
        "how access is granted, how fields map, and how failures are noticed. This guide walks through them in the order they usually come up.")

IC = {
    "link": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    "in": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9.5v8M6.5 6.2v.1M11 17.5v-5a2.5 2.5 0 0 1 5 0v5M11 12v5.5"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>',
    "x": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19"/></svg>',
    "check": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    "arrow": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "back": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
}

SECTIONS = [("why", "Why integrations break after go-live"), ("data-model", "Start with the data model"),
            ("access", "Grant access like for a new hire"), ("mapping", "Map fields by meaning"),
            ("sync", "Sync without duplicates"), ("monitoring", "Monitor the gap"),
            ("checklist", "A rollout checklist"), ("faq", "Questions"), ("wrap", "Putting it together")]


def toc(cls, secs=None):
    def item(x):
        kids = x[2] if len(x) > 2 else []
        sub = ('<ol class="ba-toc-s">%s</ol>' % "".join(item(k) for k in kids)) if kids else ""
        return '<li><a href="#%s">%s</a>%s</li>' % (x[0], x[1], sub)
    return '<ol class="%s">%s</ol>' % (cls, "".join(item(x) for x in (secs or SECTIONS)))


JSON_SAMPLE = """{
  "event": "work_order.updated",
  "id": "WO-10492",
  "status": "closed",
  "asset": { "id": "A-2231", "name": "Packaging line 3 conveyor" },
  "parts": [ { "sku": "BRG-6204", "qty": 2 } ],
  "updated_at": "2026-11-03T09:14:22Z"
}"""

CURL_SAMPLE = """curl -X POST https://erp.example.com/api/maintenance-orders \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Idempotency-Key: WO-10492-closed-1" \\
  -H "Content-Type: application/json" \\
  -d '{ "source_id": "WO-10492", "status": "closed", "hours": 3.5 }'"""


def _hl_json(t):
    t = re.sub(r'("[^"]*")(\s*:)', r'<span class="k">\1</span>\2', t)
    t = re.sub(r'(:\s*)("[^"]*")', r'\1<span class="s">\2</span>', t)
    t = re.sub(r'(:\s*)(-?\d+(?:\.\d+)?)', r'\1<span class="n">\2</span>', t)
    return re.sub(r'(\[\s*)("[^"]*")', r'\1<span class="s">\2</span>', t)


def _hl_sh(t):
    def f(m):
        g = m.group(0)
        if g[0] in "\"'":
            return '<span class="s">%s</span>' % g
        if g == "curl":
            return '<span class="k">curl</span>'
        return '<span class="f">%s</span>' % g
    return re.sub(r'"[^"]*"|\'[^\']*\'|(?<![\w-])curl(?![\w-])|(?<=\s)-[A-Za-z]\b', f, t)


def code(name, body):
    esc = body.replace("&", "&amp;").replace("<", "&lt;")
    esc = _hl_json(esc) if name.endswith(".json") else _hl_sh(esc)
    return ('<div class="ba-code"><div class="ba-code-h"><span>%s</span><button type="button" class="ba-copy" data-copy>Copy</button></div>'
            '<pre><code>%s</code></pre></div>') % (name, esc)


def h2(idn, n, text):
    return '<h2 id="%s">%s</h2>' % (idn, text)


ARTICLE = (
    '<p class="ba-lead">Most integration projects do not fail on the day they go live. They fail six weeks later, when a technician closes '
    'a work order in the CMMS and the purchase order in the ERP still shows the part as missing.</p>'
    + h2("why", 1, "Why integrations break after go-live, not before") +
    '<p>The first demo almost always works. A record is created on one side and appears on the other, everyone nods, and the project moves '
    'to the next milestone. What the demo does not show is what happens when records are edited, merged, cancelled or created twice by two '
    'people at the same time. Those cases are rare on any single day and constant over a quarter.</p>'
    '<p>This guide walks through the decisions that keep two systems of record in agreement. It is written for the people who will own the '
    'integration after the project team has moved on: maintenance managers, ERP administrators and the engineers who get the alert at night.</p>'
    '<aside class="ba-note is-keys"><span class="ba-note-t">Key takeaways</span><ul class="ba-ticks">'
    '<li>Decide which system owns each record before writing any mapping.</li>'
    '<li>Use a stable identifier from the source system in both places.</li>'
    '<li>Treat every write as something that can fail and be retried.</li>'
    '<li>Monitor the difference between the two systems, not only the API calls.</li></ul></aside>'
    + h2("data-model", 2, "Start with the data model, not the API") +
    '<p>It is tempting to open the API reference first. Resist it. An endpoint list tells you what is possible, not what is sensible. A better '
    'first hour is spent with a whiteboard and a short list of the records that must agree between the two systems.</p>'
    '<h3>Name an owner for every record</h3>'
    '<p>For each record type, one system is the owner. The owner creates the record, assigns its identifier and has the final word when two '
    'versions disagree. The other system holds a copy that it may enrich with its own fields but should not overwrite the owner\'s.</p>'
    '<ul><li>Assets and equipment usually belong to the system that finance trusts, most often the ERP.</li>'
    '<li>Work orders usually belong to the CMMS, where the people doing the work can change them quickly.</li>'
    '<li>Parts and materials belong to whichever system controls purchasing and stock levels.</li>'
    '<li>People and cost centers are read only everywhere except the directory they came from.</li></ul>'
    '<h3>Keep one identifier alive in both systems</h3>'
    '<p>Every record that crosses the boundary should carry the identifier of its owner in a dedicated field on the other side. Do not rely on '
    'names, descriptions or locations to match records. People rename things, and a match on text turns every rename into a duplicate.</p>'
    '<figure class="ba-fig"><img src="%s" alt="" loading="lazy"><figcaption>A handheld scan at the shelf and a work order closed at the machine should end up as one consistent record in both systems.</figcaption></figure>'
    '<p>Write the ownership table down and put it where the next engineer will find it. In practice, a surprising share of integration '
    'incidents trace back to a record that two systems both believed they owned.</p>' % FIG
    + h2("access", 3, "Grant access the way you would for a new employee") +
    '<p>A service account with full administrator rights is the fastest way to finish a demo and the slowest way to pass a security review. '
    'Create a dedicated integration user and give it only the permissions the mapping needs.</p>'
    '<ol class="ba-steps">'
    '<li><b>Create a dedicated integration user</b> in each system, named after the integration and not after a person.</li>'
    '<li><b>Grant read access</b> to the records the other side owns, and write access only to the ones it is allowed to change.</li>'
    '<li><b>Store the credentials</b> in a secrets manager and rotate them on a schedule that someone owns.</li>'
    '<li><b>Restrict network access</b> to the addresses the integration actually runs from.</li>'
    '<li><b>Record who approved</b> the access and when, so the next audit does not start from zero.</li></ol>'
    '<h3>Verify before you build</h3>'
    '<p>Before mapping a single field, make one authenticated read call against each system and confirm that the response contains what you '
    'expect. It is a five minute check that saves an afternoon of guessing later.</p>'
    + code("sample-response.json", JSON_SAMPLE) +
    '<aside class="ba-note"><span class="ba-note-t">Tip</span><p>Keep a small test record in each system that nobody else edits. It gives you '
    'something safe to read, write and delete while you are still learning how the systems behave.</p></aside>'
    + h2("mapping", 4, "Map fields by meaning, and write the rules down") +
    '<p>A field mapping is a contract. It says what a value means, which system may change it, and what happens when the two sides disagree. '
    'A spreadsheet with two columns and a row per field is a good start, as long as every row also answers the questions in the table below.</p>'
    '<div class="ba-table"><table><thead><tr><th>CMMS field</th><th>ERP field</th><th>Direction</th><th>Rule</th></tr></thead><tbody>'
    '<tr><td>Work order ID</td><td>Maintenance order</td><td>CMMS to ERP</td><td>Keep the source ID in both systems.</td></tr>'
    '<tr><td>Asset</td><td>Equipment master</td><td>ERP to CMMS</td><td>The ERP owns the master record.</td></tr>'
    '<tr><td>Part</td><td>Material</td><td>ERP to CMMS</td><td>Never create parts from the CMMS.</td></tr>'
    '<tr><td>Labour hours</td><td>Time confirmation</td><td>CMMS to ERP</td><td>Post when the order closes, not on every edit.</td></tr>'
    '<tr><td>Cost center</td><td>Cost center</td><td>ERP to CMMS</td><td>Read only on the CMMS side.</td></tr></tbody></table></div>'
    '<blockquote class="ba-quote"><p>An integration is only as good as its worst edge case, and the worst edge case is always the one nobody wrote down.</p>'
    '<cite>Placeholder quote for layout review</cite></blockquote>'
    '<h3>Plan for units, time zones and empty values</h3>'
    '<p>Three small differences cause most of the arguments after go-live. Units of measure differ between systems, usually where a part is '
    'ordered in boxes and consumed in pieces. Timestamps are stored in different time zones, and a work order closed at 23:50 lands on the wrong '
    'day. Empty values mean different things: one system leaves a field blank, the other writes a zero.</p>'
    '<ul><li>Convert units at the boundary and store the original value next to the converted one.</li>'
    '<li>Store and transmit time in UTC, and convert only when displaying.</li>'
    '<li>Decide whether a blank means unknown, not applicable or zero, and apply the rule in both directions.</li></ul>'
    + h2("sync", 5, "Sync without creating duplicates") +
    '<p>Sooner or later the same event is delivered twice. A network call times out, the sender retries, and the receiver processes both '
    'attempts. If creating a record twice creates two records, you have a duplicate. If it creates one, you have an idempotent integration.</p>'
    '<h3>Make every write safe to repeat</h3>'
    '<p>Send a unique key with each write and have the receiving side remember it for a reasonable period. A second request with the same key '
    'returns the result of the first instead of creating something new.</p>'
    + code("close-work-order.sh", CURL_SAMPLE) +
    '<figure class="ba-video"><video controls preload="none" poster="./assets/content/corrigopro-poster.jpg"><source src="./Makini_CorrigoPro_to_AI_1080p.mp4" type="video/mp4"></video>'
    '<figcaption>Video: connecting a platform through Makini Link, from sign-in to the first successful read.</figcaption></figure>'
    '<h3>Prefer events, fall back to polling</h3>'
    '<p>Webhooks deliver changes within seconds, but they can be missed. A scheduled poll that asks for everything changed since the last '
    'successful run is slower and far more forgiving. The reliable pattern is both: react to events, and let the poll catch whatever the events missed.</p>'
    '<aside class="ba-note is-warn"><span class="ba-note-t">Common mistake</span><p>Moving the last synced marker forward before the records have been '
    'written. If the run fails halfway, the missing records are never requested again.</p></aside>'
    + h2("monitoring", 6, "Monitor the gap, not just the calls") +
    '<p>A dashboard full of green API calls tells you the integration is running. It does not tell you the two systems agree. Add a small '
    'reconciliation job that compares counts and totals between the systems every night, and alert on the difference.</p>'
    '<h3>What to alert on</h3>'
    '<ul><li>Records waiting in a retry queue for longer than an hour.</li>'
    '<li>A difference in open work orders between the two systems.</li>'
    '<li>Authentication failures, which usually mean an expired credential.</li>'
    '<li>A sudden drop in the number of records processed per day.</li></ul>'
    '<h3>Give failures a home</h3>'
    '<p>Every failed write should end up somewhere a person can look at it, with the payload, the error message and a way to retry. A failure '
    'that only exists in a log file is a failure nobody will fix.</p>'
    + h2("checklist", 7, "A rollout checklist") +
    '<p>Use this list before switching the integration on for the first site, and again before the second.</p>'
    '<ul class="ba-check">'
    + "".join('<li><i>%s</i><span>%s</span></li>' % (IC["check"], t) for t in (
        "Ownership of every record type is written down and agreed.",
        "Integration users exist in both systems with the smallest useful permissions.",
        "Credentials are stored in a secrets manager and have a named owner.",
        "The field mapping covers units, time zones and empty values.",
        "Every write carries a unique key and can be repeated safely.",
        "Failed records land in a queue that a person reviews daily.",
        "A nightly reconciliation compares counts between the systems.",
        "There is a documented way to switch the integration off without losing data.")) +
    '</ul>'
    + h2("faq", 8, "Frequently asked questions") +
    '<div class="ba-faq">'
    '<details open><summary>Do we need real-time sync?</summary><p>Rarely. Most maintenance and finance processes tolerate a delay of a few minutes. Start with events plus a regular poll, and tighten the interval only where a process truly needs it.</p></details>'
    '<details><summary>Can we change the mapping after go-live?</summary><p>Yes, but treat it like a release. Version the mapping, test it against the small test records, and plan how already synced records will be corrected.</p></details>'
    '<details><summary>Who should own the integration?</summary><p>One named person or team on the business side, with a technical contact. An integration owned by the project team stops being owned the day the project closes.</p></details>'
    '<details><summary>What if the two systems disagree?</summary><p>The owner of the record wins. The difference should be logged and shown to a person, not silently overwritten.</p></details>'
    '</div>'
    + h2("wrap", 9, "Putting it together") +
    '<p>Nothing here is exotic. Name an owner for every record, keep one identifier alive in both places, make writes safe to repeat, and watch '
    'the gap between the systems. Teams that do these four things spend their time improving the process instead of repairing the data.</p>'
    '<div class="ba-cta"><div><h3>Connect your first platform</h3><p>Start with one system and one record type, and grow from there.</p></div>'
    '<div class="ba-cta-b"><a class="ba-btn is-solid" href="https://app.makini.io/register">Start free trial</a></div></div>'
)

RELATED = [
    ("expert opinion", "Mar 9, 2023", "Differentiate with EAM/ERP/WMS integrations", "Why EAM, ERP and WMS integrations help you stand out.", "03-forklift-racking.webp", "3 min read"),
    ("guide", "Aug 6, 2024", "CMMS vs EAM: Differences and Overlaps", "The differences and overlaps between CMMS and EAM systems.", "30-gearbox-service.webp", "8 min read"),
    ("expert opinion", "Jun 27, 2024", "iPaaS solutions for enterprise integrations", "iPaaS solutions for enterprise integrations.", "15-automated-storage.webp", "10 min read"),
]


def rel_card(t):
    return ('<a class="ba-rc" href="blog-article.html"><div class="ba-rc-i"><img src="%s%s" alt="" loading="lazy"></div>'
            '<div class="ba-rc-b"><div class="ba-rc-t"><span>%s</span><time>%s</time></div><h3>%s</h3><p>%s</p><span class="ba-rc-r">%s</span></div></a>'
            % (SP, t[4], t[0], t[1], t[2], t[3], t[5]))


MAIN_T = """
<div class="ba-progress" aria-hidden="true"><i></i></div>
<section class="ba-wrap" data-bt data-pal="b" data-pat="amb">
  <div class="m-container">
    <nav class="ba-crumbs" aria-label="Breadcrumb"><a href="blog-v2.html">Blog</a><span>/</span><a href="%(crumb_href)s">%(crumb)s</a></nav>
    <header class="ba-head">
      <span class="ba-type">%(type_label)s</span>
      <h1 class="ba-h1">%(title)s</h1>
      <p class="ba-deck">%(deck)s</p>
      <div class="ba-meta">
        <div class="ba-by"><img class="ba-av" src="./assets/content/people/%(photo)s" alt=""><span><b>%(author)s</b><i>%(role)s</i></span></div>
        <div class="ba-meta-i"><i>Published</i><time datetime="%(date_iso)s">%(date_h)s</time></div>
        <div class="ba-meta-i"><i>Reading time</i><span>%(read)s</span></div>
        %(plats_meta)s
      </div>
    </header>
    <figure class="ba-cover"><img src="%(cover)s" alt=""></figure>
    <div class="ba-main">
      <div class="ba-grid">
        <aside class="ba-toc" aria-label="On this page"><span class="ba-toc-t">On this page</span>%(toc)s</aside>
        <article class="ba-sheet">
          <details class="ba-toc-in"><summary>On this page</summary>%(toc_in)s</details>
          <div class="ba-prose">%(article)s</div>
          %(tags)s
          <div class="ba-author"><img src="./assets/content/people/%(photo)s" alt=""><div><b>%(author)s</b><i>%(role)s</i>
            %(bio_p)s</div></div>
        </article>
        <aside class="ba-side">
          <div class="ba-box"><span class="ba-box-t">Share</span><div class="ba-share">
            <button type="button" class="ba-sh" data-copylink aria-label="Copy link">%(ic_link)s<span>Copy link</span></button>
            <a class="ba-sh" href="https://www.linkedin.com/" aria-label="Share on LinkedIn">%(ic_in)s<span>LinkedIn</span></a>
            <a class="ba-sh" href="https://x.com/" aria-label="Share on X">%(ic_x)s<span>X</span></a></div></div>
          %(side_box)s
          <div class="dm dm-side" data-demo="side"></div>
        </aside>
      </div>
      %(pn)s
      <section class="ba-rel"><div class="ba-rel-h"><h2>Keep reading</h2><a href="blog-v2.html">All posts %(ic_arrow)s</a></div>
        <div class="ba-rel-g">%(rel)s</div></section>
    </div>
  </div>
</section>
"""

TAGS_FISH = ('<div class="ba-tags"><span>Topics</span><a href="blog-v2.html?q=cmms">CMMS</a><a href="blog-v2.html?q=erp">ERP</a>'
             '<a href="blog-v2.html">Integration design</a><a href="blog-v2.html">Data mapping</a><a href="blog-v2.html">Best practices</a></div>')
PLATS_FISH = '<li><a href="#">SAP S/4HANA</a></li><li><a href="#">Microsoft Dynamics 365</a></li><li><a href="#">NetSuite</a></li><li><a href="#">Odoo</a></li>'
BIO = "Roman writes about integration design, data models and the engineering behind connecting industrial systems."


def pn(prev, nxt):
    return ('<nav class="ba-pn" aria-label="More posts">'
            '<a href="blog-article.html"><span>%s Previous</span><b>%s</b></a>'
            '<a href="blog-article.html" class="is-next"><span>Next %s</span><b>%s</b></a></nav>') % (IC["back"], prev, IC["arrow"], nxt)


def make_main(**c):
    d = dict(title=TITLE, deck=DECK, cover=COVER, toc=toc("ba-toc-l"), toc_in=toc("ba-toc-l"), article=ARTICLE,
             date_iso="2026-11-03", date_h="Nov 3, 2026", read="9 min read", plats="CMMS, ERP", tags=TAGS_FISH, bio=BIO,
             side_plats=PLATS_FISH, pn=pn("CMMS vs EAM: Differences and Overlaps", "iPaaS solutions for enterprise integrations"),
             ic_link=IC["link"], ic_in=IC["in"], ic_x=IC["x"], ic_back=IC["back"], ic_arrow=IC["arrow"],
             rel="".join(rel_card(t) for t in RELATED))
    d.update(c)
    d.setdefault("crumb", "Guides")
    d.setdefault("crumb_href", "blog-v2.html?type=guides")
    d.setdefault("type_label", "Guide")
    d.setdefault("author", "Roman Kinyakin")
    d.setdefault("role", "CTO")
    d.setdefault("photo", "roman.jpg")
    d.setdefault("news_text", "One short email when a new guide is published.")
    d.setdefault("plats_meta", '<div class="ba-meta-i"><i>Platforms</i><span>%s</span></div>' % d["plats"] if d.get("plats") else "")
    d.setdefault("bio_p", "<p>%s</p>" % d["bio"] if d.get("bio") else "")
    d.setdefault("side_box", '<div class="ba-box"><span class="ba-box-t">Platforms in this guide</span><ul class="ba-plats">%s</ul></div>' % d["side_plats"] if d.get("side_plats") else "")
    return MAIN_T % d


MAIN = make_main()

HEAD = ('<link href="./assets/content/ct-blocks.css" rel="stylesheet" type="text/css">'
        '<link href="./assets/content/blog-article.css?v=9" rel="stylesheet" type="text/css">'
        '<link href="./assets/content/blog-theme.css?v=9" rel="stylesheet" type="text/css">'
        '<link href="./assets/content/blog-brand.css?v=12" rel="stylesheet" type="text/css"><link href="./assets/content/blog-site.css?v=2" rel="stylesheet" type="text/css"><script src="./assets/content/blog-style.js?v=1"></script>'
        '<link href="./assets/content/blog-add.css?v=9" rel="stylesheet" type="text/css">')
TAIL = '<script src="./assets/content/blog-article.js?v=9"></script><script src="./assets/content/blog-review.js?v=6"></script><script src="./assets/content/blog-theme.js?v=9"></script>'

if __name__ == "__main__":
    out = page("Article | Makini review", MAIN, head_extra=HEAD, tail_extra=TAIL)
    with open(os.path.join(HERE, "blog-article.html"), "w", encoding="utf-8", newline="") as f:
        f.write(out)
    print("wrote blog-article.html", len(out))
