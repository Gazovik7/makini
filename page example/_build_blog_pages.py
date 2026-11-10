"""Builds the two blog review pages from scratch (idempotent):
    blog.html        listing, block id "blog-listing" (variants A/B/C)
    blog-post.html   post template, block id "post-layout" (variants A/B/C)

Run from "page example/":  python -I -X utf8 _build_blog_pages.py

Dynamic parts (cards, filters, related posts) come from assets/content/blog-data.js and blog.js.
The post body is the REAL ServiceTitan guide, copied verbatim from the live page; only the markup
around the text is restructured into the new components (checklist, steps, callouts, figure frames,
accordion, resource tiles).
"""
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from _ct_shell import page  # noqa: E402

CSS = '<link href="./assets/content/blog.css" rel="stylesheet" type="text/css">'
JS = '<script src="./assets/content/blog-data.js"></script><script src="./assets/content/blog-live.js"></script><script src="./assets/content/blog.js"></script>'

# ------------------------------------------------------------------ icons (stroke 1.6, currentColor)
def svg(path, cls=""):
    return '<svg viewBox="0 0 24 24" aria-hidden="true"%s>%s</svg>' % ((' class="%s"' % cls) if cls else "", path)

IC = {
    "search": svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    "x": svg('<path d="M6 6l12 12M18 6 6 18"/>'),
    "arrow": svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    "ext": svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    "link": svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    "empty": svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8.5 11h5"/>'),
    "chev": svg('<path d="m6 9 6 6 6-6"/>'),
    "check": svg('<path d="m5 12 4.5 4.5L19 7"/>'),
    "filter": svg('<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>'),
    "warn": svg('<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4M12 17.4v.1"/>'),
    "list": svg('<path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>'),
    "plug": svg('<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4"/>'),
    "book": svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M19 19v2H6"/>'),
    "mail": svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    "play": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
    "help": svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.1"/>'),
}

COVER_FALLBACK = "./assets/use-cases/processed/spectrum/22-pump-service.webp"
VIDEO_POSTER = "./assets/use-cases/processed/spectrum/03-forklift-racking.webp"
POST_TITLE = "ServiceTitan - How do I connect via API Authentication?"
POST_DECK = ("This guide walks you through registering a Makini app in the ServiceTitan Developer Portal, connecting it to your "
             "ServiceTitan installation, and retrieving the credentials needed to complete your Makini integration.")
AUTHOR = "Roman Kinyakin"
AUTHOR_INI = "RK"
AUTHOR_ROLE = "CTO"
AUTHOR_PHOTO = "./assets/content/people/roman.jpg"
AV = '<img class="bl-av is-photo" src="%s" alt="">' % AUTHOR_PHOTO
DATE_HUMAN = "May 12, 2026"
READ = "5 min read"


def switch(items):
    return ('<div class="ct-switch" role="group" aria-label="Design variant">%s</div>' %
            "".join('<button type="button" data-v="%s"><b>%s</b><span>%s</span></button>' % (k, k.upper(), n) for k, n in items))


def anno(name, cms):
    return '<div class="ct-anno"><em>New</em> %s <span>CMS: %s</span></div>' % (name, cms)


def codes(*names):
    return " ".join("<code>%s</code>" % n for n in names)


# ------------------------------------------------------------------ LISTING
def search_box(placeholder, lg=False, extra_cls=""):
    return ('<label class="bl-search%s%s">%s<span class="ct-sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Search the blog</span>'
            '<input type="search" data-bl-q placeholder="%s" autocomplete="off" spellcheck="false">'
            '<button type="button" class="bl-x" data-bl-clearq aria-label="Clear search" hidden>%s</button></label>'
            % (" is-lg" if lg else "", (" " + extra_cls) if extra_cls else "", IC["search"], placeholder, IC["x"]))


def result_bar(copy=True):
    return ('<div class="bl-bar"><div class="bl-bar-l"><strong class="bl-count" data-bl-count aria-live="polite"></strong>'
            '<div class="bl-pills" data-bl-active hidden></div></div>%s</div>' %
            ('<button type="button" class="bl-linkbtn" data-bl-copy>%s<span>Copy link to this view</span></button>' % IC["link"] if copy else ""))


def empty_state():
    return ('<div class="bl-empty" data-bl-empty hidden><span class="ct-ico">%s</span><h3>No posts match your search</h3>'
            '<p>Try a different keyword, or remove one of the filters.</p>'
            '<button type="button" class="ct-btn ghost" data-bl-reset>Clear all filters</button></div>' % IC["empty"])


def more(v):
    return ('<div class="bl-more" data-bl-more-wrap="%s" hidden><button type="button" class="ct-btn ghost" data-bl-more>Load more</button>'
            '<span class="bl-showing" data-bl-showing></span></div>' % v)


def news(compact=False):
    return ('<section class="ct-card g-violet bl-news%s" aria-label="Newsletter"><div><h3>Get new guides and releases in your inbox</h3>'
            '<p>One email when something new is published. No spam.</p></div>'
            '<form data-bl-news>%s<button type="submit" class="ct-btn primary">Subscribe</button></form></section>' %
            (" is-compact" if compact else "",
             '<label class="bl-search"><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Email address</span>'
             '<input type="email" required placeholder="Enter your email" autocomplete="email"></label>'))


def listing_a():
    return '''
<div class="ct-v" data-v="a">
  %(anno)s
  <div class="m-container">
    <header class="bl-hero">
      <nav class="bl-crumb" aria-label="Breadcrumb"><a href="./index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>
      <h1 class="s1-h1 bl-h1">Guides, releases and news from Makini</h1>
      <p class="bl-lead">Setup guides for every platform, product updates, customer stories and ideas on connecting AI agents to industrial systems.</p>
      %(search)s
      <div class="bl-chips" data-bl-chips role="group" aria-label="Filter by type"></div>
      <div class="bl-selects">
        <label class="bl-sel">Platform <select data-bl-select="platform" aria-label="Filter by platform"></select></label>
        <label class="bl-sel">Agent <select data-bl-select="agent" aria-label="Filter by agent"></select></label>
      </div>
    </header>
    %(bar)s
    <div data-bl-body>
      <div class="bl-featgrid" data-bl-feat></div>
      <h2 class="h2 bl-h2" data-bl-gridhead>Latest posts</h2>
      <div class="bl-grid" data-bl-grid="a"></div>
      %(more)s
    </div>
    %(empty)s
    %(news)s
  </div>
  <div style="height:88px"></div>
</div>''' % dict(
        anno=anno("Blog listing: search, filters, featured post",
                  codes("Type", "Platform", "Agent", "Summary", "Cover", "Featured") + " fields on every post, filtered in the browser, state kept in the URL"),
        search=search_box("Search guides, platforms, authors", lg=True), bar=result_bar(), more=more("a"), empty=empty_state(), news=news())


def listing_b():
    return '''
<div class="ct-v" data-v="b">
  %(anno)s
  <div class="m-container">
    <header class="bl-hero is-compact">
      <nav class="bl-crumb" aria-label="Breadcrumb"><a href="./index.html">Home</a><span aria-hidden="true">/</span><span aria-current="page">Blog</span></nav>
      <h1 class="s1-h1 bl-h1">Blog</h1>
      <p class="bl-lead">Search, or filter by type, platform and AI agent.</p>
    </header>
    <div class="bl-layout">
      <aside class="bl-filters" aria-label="Filters">
        <div class="bl-filters-h"><span>Filters</span><button type="button" class="bl-x" data-bl-drawer-close aria-label="Close filters">%(x)s</button></div>
        <div class="bl-fgroup">%(search)s</div>
        <div class="bl-fgroup"><h2 class="bl-flabel">Type</h2><div data-bl-checks></div></div>
        <div class="bl-fgroup"><h2 class="bl-flabel">Platform</h2>
          <div class="bl-pf">
            <button type="button" class="bl-pf-btn" data-bl-pfbtn aria-expanded="false"><span data-bl-pflabel>All platforms</span>%(chev)s</button>
            <div class="bl-pf-panel">
              <label class="bl-search">%(sicon)s<input type="search" data-bl-pfq placeholder="Search platforms" autocomplete="off" aria-label="Search platforms"></label>
              <ul class="bl-pf-list" data-bl-pflist></ul>
            </div>
          </div>
        </div>
        <div class="bl-fgroup"><h2 class="bl-flabel">Agent</h2><div class="bl-agents" data-bl-agents></div></div>
        <div class="bl-filters-f"><button type="button" class="bl-linkbtn" data-bl-reset>Clear all</button>
          <button type="button" class="ct-btn primary bl-apply" data-bl-drawer-close data-bl-show>Show posts</button></div>
      </aside>
      <div class="bl-backdrop" data-bl-act data-bl-drawer-close></div>
      <div class="bl-results">
        <div class="bl-mob-only">
          <button type="button" class="bl-filter-btn" data-bl-drawer-open aria-expanded="false">%(filter)s Filters <b data-bl-fcount hidden></b></button>
        </div>
        <div class="bl-mob-only">%(msearch)s</div>
        %(bar)s
        <div data-bl-body>
          <div class="bl-rows" data-bl-list="b"></div>
          %(more)s
        </div>
        %(empty)s
        %(news)s
      </div>
    </div>
  </div>
</div>''' % dict(
        anno=anno("Blog listing: sidebar filters",
                  codes("Type", "Platform", "Agent") + " as multi-select facets with live counts, platform list has its own search"),
        x=IC["x"], chev=IC["chev"], sicon=IC["search"], filter=IC["filter"],
        search=search_box("Search posts"), msearch=search_box("Search posts"), bar=result_bar(), more=more("b"), empty=empty_state(), news=news(True))


def listing_c():
    sug = "".join('<button type="button" class="bl-sug" data-bl-suggest="%s">%s</button>' % (s, s)
                  for s in ["MaintainX", "Claude", "release notes", "ServiceTitan"])
    return '''
<div class="ct-v" data-v="c">
  %(anno)s
  <div class="m-container">
    <header class="bl-hero">
      <h1 class="s1-h1 bl-h1">Find a guide, release or idea</h1>
      <div class="bl-cmd" role="search">
        <label class="bl-cmd-in">%(sicon)s<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Search the blog</span>
          <input type="search" data-bl-q placeholder="Search posts, platforms, agents" autocomplete="off" spellcheck="false">
          <button type="button" class="bl-x" data-bl-clearq aria-label="Clear search" hidden>%(x)s</button>
          <span class="bl-keys" aria-hidden="true"><kbd>/</kbd><kbd>Esc</kbd></span></label>
        <div class="bl-quick" data-bl-quick hidden></div>
        <div class="bl-cmd-f"><span class="bl-try">Try</span>%(sug)s</div>
      </div>
    </header>
    <div class="bl-tabwrap"><div class="bl-tabs" role="tablist" aria-label="Topics" data-bl-topics></div></div>
    <div class="bl-filterline">
      <div class="bl-selects">
        <label class="bl-sel">Platform <select data-bl-select="platform" aria-label="Filter by platform"></select></label>
        <label class="bl-sel">Agent <select data-bl-select="agent" aria-label="Filter by agent"></select></label>
      </div>
      <button type="button" class="bl-linkbtn" data-bl-copy>%(link)s<span>Copy link to this view</span></button>
    </div>
    <div class="bl-bar" style="padding-top:0"><div class="bl-bar-l"><strong class="bl-count" data-bl-count aria-live="polite"></strong><div class="bl-pills" data-bl-active hidden></div></div></div>
    <div data-bl-body>
      <div data-bl-list="c"><div class="bl-bigrow" data-bl-big></div><div class="bl-minis" data-bl-minis></div></div>
      %(more)s
    </div>
    %(empty)s
    %(news)s
  </div>
  <div style="height:88px"></div>
</div>''' % dict(
        anno=anno("Blog listing: command search and topic tabs",
                  codes("Type", "Platform", "Agent") + " plus a Topic grouping of types, counts under each tab, top matches while typing"),
        sicon=IC["search"], x=IC["x"], sug=sug, link=IC["link"], more=more("c"), empty=empty_state(), news=news())


def build_listing():
    sec = '''
<section class="ct-sec bl-sec ct-glow-tl ct-block" id="blog-listing" data-ct-block="blog-listing" data-active="a">
  %s
  %s%s%s
</section>''' % (switch([("a", "Editorial grid"), ("b", "Sidebar filters"), ("c", "Command search")]), listing_a(), listing_b(), listing_c())
    return page(
        "Blog | Makini", sec, body_class="ct-listing",
        head_extra=CSS, tail_extra=JS,
        description="Guides, releases and news from Makini. Search by type, platform and AI agent.")


# ------------------------------------------------------------------ POST BODY (verbatim copy, new markup)
BODY = r'''<div class="post-text w-richtext"><h2><strong>Prerequisites</strong></h2><ul role="list"><li>An active ServiceTitan account with admin access</li><li>Access to <a href="https://developer.servicetitan.io/">ServiceTitan Developer Portal</a></li></ul><p>‍</p><h2><strong>Setup Steps</strong></h2><h3><strong>Step 1: Register the App in the Developer Portal</strong></h3><ol role="list"><li>Go to <a href="https://developer.servicetitan.io/">https://developer.servicetitan.io/</a> and click <strong>Sign In &amp; Register Apps</strong>.</li><li>Click <strong>Sign In as Production Environment User</strong>.</li><li>Enter your ServiceTitan user credentials.</li><li>If a Terms of Use page appears, read and click <strong>Accept</strong>.</li><li>Click <strong>Register and Manage Applications</strong>.</li><li>Click <strong>Register New App</strong>.</li><li>When prompted <em>&quot;Who will be accessing the API endpoints/webhooks?&quot;</em>, select <strong>Our organization</strong>.</li><li>Fill in the registration form with the following details:<ul role="list"><li><strong>Organization</strong>: Makini</li><li><strong>Organization/App Website:</strong> https://www.makini.io</li><li><strong>Email Address: </strong>support@makini.io</li><li><strong>App Name: </strong>Makini</li><li><strong>Description: </strong>Integration Provider</li><li><strong>App Category:</strong> Analytics, Reporting, BI Tool</li></ul></li><li>Click <strong>Add Scopes</strong> and select <strong>Select All</strong> for each of the following categories:<ul role="list"><li><strong>Accounting</strong> <em>(required if you plan to sync invoices)</em></li><li><strong>CRM</strong></li><li><strong>Dispatch</strong></li><li><strong>Forms</strong></li><li><strong>Job Booking</strong></li><li><strong>Job Planning and Management</strong></li><li><strong>Marketing</strong></li><li><strong>Pricebook</strong> <em>(required if you plan to sync invoices)</em></li><li><strong>Settings</strong></li><li><strong>Timesheets</strong></li></ul></li><li>The <strong>Tenant ID</strong> field should be pre-populated with your organization ID.</li><li>Click <strong>Register App</strong>.</li><li>Once the app is saved, copy the <strong>Application Key</strong></li></ol><p>❗️<strong>Important:</strong> Save the Application Key in a secure location. You will need this value to complete the integration.</p><figure class="w-richtext-align-normal w-richtext-figure-type-image"><div><img alt="" src="https://cdn.prod.website-files.com/6075c27838665ca2d239fd8b/69eab6165934079fdd8f0b05_image.png" loading="lazy"/></div></figure><h3><strong>Step 2: Connect the App to Your ServiceTitan Installation</strong></h3><ol role="list"><li>Go to <a href="https://go.servicetitan.com/">https://go.servicetitan.com/</a> and log in with your credentials.</li><li>Open <strong>Settings</strong> and navigate to <strong>Integrations → API Application Access</strong>.</li><li>Click <strong>Connect New App</strong>.</li><li>Find and select <strong>Makini</strong>, then click <strong>Connect</strong>.</li><li>Click <strong>Allow Access</strong>.</li><li>Read and accept the terms of use.</li></ol><h3><strong>Step 3: Retrieve Your Client Credentials</strong></h3><ol role="list"><li>Go back to <a href="https://developer.servicetitan.io/">https://developer.servicetitan.io/</a> and log in again if your session has expired.</li><li> In the application list, locate <strong>Makini</strong> and click the <strong>App Connections</strong> button (the second icon on the right, with a chain link icon).</li><li>A list of connections will open — there should be exactly one entry.</li></ol><figure class="w-richtext-align-normal w-richtext-figure-type-image"><div><img alt="continue-ol-4" src="https://cdn.prod.website-files.com/6075c27838665ca2d239fd8b/69eab69a26e053aec33ff900_image.png" loading="lazy"/></div></figure><ol role="list"><li>Copy the <strong>Tenant ID</strong> and <strong>Client ID</strong>.</li></ol><figure class="w-richtext-align-normal w-richtext-figure-type-image"><div><img alt="continue-ol-5" src="https://cdn.prod.website-files.com/6075c27838665ca2d239fd8b/69eab76dd694c3bb0fbd5e17_image.png" loading="lazy"/></div></figure><ol role="list"><li>Under <strong>Client Secret</strong>, click <strong>Generate</strong>, then confirm by clicking <strong>Yes, continue</strong></li><li>Copy the <strong>Client Secret</strong> and close the window.</li></ol><p>❗️<strong>Important:</strong> Copy and save the Client Secret immediately. It cannot be viewed again after closing this window.</p><figure class="w-richtext-align-normal w-richtext-figure-type-image"><div><img alt="" src="https://cdn.prod.website-files.com/6075c27838665ca2d239fd8b/69eab78ebd7b2b604575553c_image.png" loading="lazy"/></div></figure><h3><strong>Step 4: Complete Connection in Makini Link</strong></h3><p>Submit these credentials in <strong>Makini Link</strong> to finalize your ServiceTitan integration.</p><p>In the Makini Link connection interface, provide the following credentials:</p><ul role="list"><li><strong>Client ID:</strong> From the App Connections page (Step 3)</li><li><strong>Client Secret:</strong> Generated on the App Connections page (Step 3)</li><li><strong>Application Key:</strong> From the Developer Portal, after registering the app (Step 1)</li><li><strong>Tenant ID:</strong> From the App Connections page (Step 3)</li></ul><figure class="w-richtext-align-center w-richtext-figure-type-image"><div><img alt="" src="https://cdn.prod.website-files.com/6075c27838665ca2d239fd8b/69eab7a4d612553074e7e278_image.png" loading="lazy"/></div></figure><p>If you encounter any issues during this process, contact <a href="mailto:support@makini.io">support@makini.io</a>.</p><h2><strong>Connection Verification</strong></h2><p>After completing the setup, Makini Link will attempt to establish a connection with your ServiceTitan account. A successful connection will be indicated in the Makini Link dashboard and you will be issued a respective API token.</p><h2><strong>Troubleshooting</strong></h2><h3><strong>Common Issues</strong></h3><p><strong>Connection Failure</strong></p><ul role="list"><li>Verify that all four credentials (Client ID, Client Secret, Application Key, Tenant ID) are entered correctly</li><li>Ensure the app is in an <strong>Enabled</strong> state in the Developer Portal</li><li>Check that the app has been connected and access allowed in ServiceTitan Settings (Step 2)</li></ul><p><strong>Permission Errors</strong></p><ul role="list"><li>Confirm that all required API scopes were selected during app registration</li><li>Ensure the ServiceTitan user has admin access</li></ul><p><strong>Client Secret Issues</strong></p><ul role="list"><li>Client secrets can only be viewed once when generated — if lost, generate a new one from the App Connections page</li><li>Make sure you&#x27;re using the secret for the correct tenant connection</li></ul><h2><strong>Need Additional Help?</strong></h2><p>If you continue to experience issues with your ServiceTitan connection, please contact Makini support at <a href="mailto:support@makini.io">support@makini.io</a></p><h2><strong>Additional Resources</strong></h2><ul role="list"><li><a href="https://developer.servicetitan.io/">ServiceTitan Developer Portal</a></li><li><a href="https://developer.servicetitan.io/docs/">ServiceTitan API Documentation</a></li><li><a href="https://docs.makini.io/">Makini Documentation</a></li></ul></div>'''


def strip_tags(s):
    return re.sub(r"<[^>]+>", "", s).replace("&amp;", "&").strip()


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def blocks(inner):
    out = []
    for m in re.finditer(r"<(h2|h3|p|ul|ol|figure)\b.*?</\1>", inner, flags=re.S):
        out.append((m.group(1), m.group(0)))
    return out


def figure(html):
    img = re.search(r"<img\b[^>]*>", html).group(0)
    img = img.replace("/>", ">")
    return ('<figure class="bl-fig"><div class="bl-fig-bar" aria-hidden="true"><i></i><i></i><i></i><span></span></div>%s</figure>' % img)


def article(pfx):
    """Return (html, toc) for one variant; ids are prefixed so the three copies never collide."""
    inner = re.sub(r'^\s*<div class="post-text w-richtext">', "", BODY.strip())
    inner = re.sub(r"</div>\s*$", "", inner)
    # markup-only: inline code for literal values, list roles
    inner = inner.replace("</strong> https://www.makini.io</li>", "</strong> <code>https://www.makini.io</code></li>")
    inner = inner.replace("</strong>support@makini.io</li>", "</strong><code>support@makini.io</code></li>")
    inner = inner.replace('<ul role="list"><li><strong>Organization</strong>', '<ul class="bl-kv"><li><strong>Organization</strong>')
    inner = inner.replace('<ul role="list"><li><strong>Accounting</strong>', '<ul class="bl-scopes"><li><strong>Accounting</strong>')
    inner = inner.replace('<ul role="list"><li><strong>Client ID:</strong>', '<ul class="bl-kv"><li><strong>Client ID:</strong>')
    inner = inner.replace('<ol role="list">', '<ol class="bl-ol">')
    inner = inner.replace('<ul role="list">', '<ul class="bl-ul">')

    bl = [b for b in blocks(inner) if strip_tags(b[1]).replace("‍", "").strip() or b[0] == "figure"]
    toc = []
    out = []
    step_open = False
    i = 0

    def close_step(last=False):
        nonlocal step_open
        if step_open:
            out.append("</div></section>")
            step_open = False

    while i < len(bl):
        tag, h = bl[i]
        if tag == "h2":
            close_step()
            text = strip_tags(h)
            hid = "%s-%s" % (pfx, slugify(text))
            if text == "Prerequisites":
                ul = bl[i + 1][1]
                out.append('<section class="ct-card bl-pre" id="%s" data-toc><div class="bl-pre-h"><span class="ct-ico">%s</span><h2>%s</h2></div>%s</section>' % (hid, IC["list"], text, ul))
                i += 2
                toc.append((hid, text, 2))
                continue
            if text == "Connection Verification":
                p = re.sub(r"^<p>|</p>$", "", bl[i + 1][1])
                out.append('<aside class="bl-call is-ok" id="%s" data-toc><span class="bl-call-i">%s</span><div><h2>%s</h2><p>%s</p></div></aside>' % (hid, IC["check"], text, p))
                i += 2
                toc.append((hid, text, 2))
                continue
            if text == "Need Additional Help?":
                p = re.sub(r"^<p>|</p>$", "", bl[i + 1][1])
                out.append('<section class="ct-card g-pink bl-help" id="%s" data-toc><div><h2>%s</h2><p>%s</p></div>'
                           '<div class="bl-help-a"><a class="ct-btn primary" href="mailto:support@makini.io">%s Email support</a>'
                           '<a class="ct-btn ghost" href="https://docs.makini.io/" target="_blank" rel="noopener">%s Read the docs</a></div></section>'
                           % (hid, text, p, IC["mail"], IC["book"]))
                i += 2
                toc.append((hid, text, 2))
                continue
            if text == "Additional Resources":
                ul = bl[i + 1][1]
                ul = re.sub(r'<li><a href="([^"]+)">([^<]+)</a></li>',
                            lambda m: '<li><a href="%s" target="_blank" rel="noopener"><span>%s</span>%s</a></li>' % (m.group(1), m.group(2), IC["ext"]), ul)
                ul = ul.replace('<ul class="bl-ul">', '<ul class="bl-res">')
                out.append('<h2 id="%s" data-toc style="margin-top:56px">%s</h2>%s' % (hid, text, ul))
                i += 2
                toc.append((hid, text, 2))
                continue
            out.append('<h2 id="%s" data-toc>%s</h2>' % (hid, text))
            toc.append((hid, text, 2))
            i += 1
            continue
        if tag == "h3":
            text = strip_tags(h)
            m = re.match(r"Step (\d+): (.*)", text)
            if m:
                close_step()
                sid = "%s-step-%s" % (pfx, m.group(1))
                out.append('<section class="bl-step" id="%s" data-toc><div class="bl-step-h"><span class="ct-num" aria-hidden="true">%s</span>'
                           '<h3><span class="bl-step-k">Step %s:</span> %s</h3></div><div class="bl-step-b">' % (sid, m.group(1), m.group(1), m.group(2)))
                step_open = True
                toc.append((sid, text, 3))
                i += 1
                continue
            out.append("<h3 style=\"margin:36px 0 14px\">%s</h3>" % text)
            i += 1
            # troubleshooting groups: <p><strong>Title</strong></p> + <ul>
            if text == "Common Issues":
                acc = []
                while i + 1 < len(bl) and bl[i][0] == "p" and bl[i + 1][0] == "ul" and re.fullmatch(r"<p><strong>[^<]+</strong></p>", bl[i][1]):
                    t = strip_tags(bl[i][1])
                    acc.append('<details%s><summary>%s</summary><div class="bl-acc-b">%s</div></details>' % (" open" if not acc else "", t, bl[i + 1][1]))
                    i += 2
                out.append('<div class="bl-acc">%s</div>' % "".join(acc))
            continue
        if tag == "p":
            if "❗" in h:
                body = h.replace("❗️", "").replace("❗", "")
                body = re.sub(r"^<p>\s*", "", body)
                body = re.sub(r"</p>$", "", body)
                out.append('<div class="bl-call is-warn" role="note"><span class="bl-call-i">%s</span><p>%s</p></div>' % (IC["warn"], body))
            else:
                out.append(h)
            i += 1
            continue
        if tag == "figure":
            out.append(figure(h))
            i += 1
            continue
        out.append(h)
        i += 1
    close_step()
    # the last step has no connector line
    idx = [m.start() for m in re.finditer(r'<section class="bl-step"', "".join(out))]
    html = "".join(out)
    if idx:
        k = idx[-1]
        html = html[:k] + html[k:].replace('class="bl-step"', 'class="bl-step is-last"', 1)
    return html, toc


def video():
    return ('<figure class="bl-video"><img src="%s" alt="" loading="lazy">'
            '<button type="button" class="bl-video-play" aria-label="Play video guide (demo)">%s</button>'
            '<figcaption class="bl-video-cap"><span><span class="bl-video-k">Video guide</span><span class="bl-video-t">Screencast of this guide</span></span>'
            '</figcaption></figure>' % (VIDEO_POSTER, IC["play"]))


def toc_list(toc, only_h2=False, cls=""):
    items = []
    for hid, text, lvl in toc:
        if only_h2 and lvl != 2:
            continue
        items.append('<li%s><a href="#%s">%s</a></li>' % (' class="is-sub"' if lvl == 3 else "", hid, text))
    return "".join(items)


def crumb():
    return ('<nav class="bl-crumb" aria-label="Breadcrumb"><a href="./index.html">Home</a><span aria-hidden="true">/</span>'
            '<a href="./blog-v2.html">Blog</a><span aria-hidden="true">/</span><a href="./blog-v2.html?type=guides">Guide</a></nav>')


def byline():
    return ('<div class="bl-by">%s<div class="bl-by-n"><b>%s</b>'
            '<div class="bl-by-i"><span>%s</span><span><time datetime="2026-05-12">%s</time></span><span>%s</span></div></div></div>' % (AV, AUTHOR, AUTHOR_ROLE, DATE_HUMAN, READ))


def tags_row():
    return ('<div class="bl-tagrow"><span>Tags</span><a class="bl-kind" href="./blog-v2.html?type=guides">Guide</a>'
            '<a class="bl-plat" href="./blog.html?platform=servicetitan">ServiceTitan</a></div>')


def author_box():
    return ('<div class="ct-card g-violet bl-authorbox">%s<div><small>Written by</small><b>%s</b><span class="bl-role">%s, Makini</span>'
            '<p>Author of 4 connection setup guides on the Makini blog.</p>'
            '<a class="ct-link" href="./blog-v2.html?q=Roman%%20Kinyakin">More from %s %s</a></div></div>' % (AV, AUTHOR, AUTHOR_ROLE, AUTHOR, IC["arrow"]))


def cta_band():
    return ('<section class="ct-card hov bl-ctaband" aria-label="Connect ServiceTitan"><div><h3>Connect ServiceTitan to Makini</h3>'
            '<p>Start a free trial and follow this guide with your own account.</p></div><div class="bl-ctaband-a">'
            '<a class="ct-btn primary" href="https://app.makini.io/register" target="_blank" rel="noopener">Start free trial</a>'
            '<a class="ct-btn ghost" href="https://docs.makini.io/" target="_blank" rel="noopener">Read the docs</a></div></section>')


def related(style, heading="Related by platform"):
    cls = {"a": "bl-rel-g", "b": "bl-rel-g is-rows", "c": "bl-rel-g is-two"}[style]
    return ('<section class="bl-rel" aria-label="%s"><div class="m-container"><div class="bl-rel-in%s"><h2 class="h2 bl-h2">%s</h2><div class="%s" data-bl-related="%s"></div></div></div></section>'
            % (heading, " is-b" if style == "b" else "", heading, cls, style))


def post_a(art, toc):
    return '''
<div class="ct-v" data-v="a">
  %(anno)s
  <header class="bl-ph is-a"><div class="m-container">
    %(crumb)s
    <div class="bl-tags"><span class="bl-kind">Guide</span></div>
    <h1 class="s1-h1">%(title)s</h1>
    <p class="bl-deck">%(deck)s</p>
    %(by)s
    <div class="bl-plats"><span class="bl-plat">ServiceTitan</span></div>
  </div></header>
  <div class="m-container"><div class="bl-cover-wide"><img src="%(cover)s" alt="" data-bl-cover></div></div>
  <div class="m-container"><div class="bl-a-grid">
    <aside class="bl-a-toc"><nav class="bl-toc" aria-label="On this page"><p class="bl-toc-l">On this page</p><ol>%(toc)s</ol></nav></aside>
    <div class="bl-a-main">
      <details class="bl-toc-m"><summary>On this page</summary><nav class="bl-toc" aria-label="On this page"><ol>%(toc)s</ol></nav></details>
      <article class="bl-prose" data-bl-article>%(video)s%(art)s</article>
      <div class="bl-endrow">%(tags)s%(author)s</div>
    </div>
  </div></div>
  <div class="m-container" style="padding-top:56px">%(cta)s</div>
  %(rel)s
</div>''' % dict(
        anno=anno("Post layout: editorial with sticky contents",
                  codes("Type", "Platform", "Author", "Date", "Read time", "Body (rich text)") + ", contents built from the H2 and H3 headings"),
        crumb=crumb(), title=POST_TITLE, deck=POST_DECK, by=byline(), cover=COVER_FALLBACK, toc=toc_list(toc),
        video=video(), art=art, tags=tags_row(), author=author_box(), cta=cta_band(), rel=related("a"))


def post_b(art, toc):
    return '''
<div class="ct-v" data-v="b">
  %(anno)s
  <div class="m-container">
    <header class="bl-b-hero">
      <div class="bl-ph" style="padding:0">
        %(crumb)s
        <div class="bl-tags" style="margin-bottom:20px"><span class="bl-kind">Guide</span></div>
        <h1 class="s1-h1" style="text-align:left">%(title)s</h1>
        <p class="bl-deck">%(deck)s</p>
        %(by)s
        <div class="bl-plats"><span class="bl-plat">ServiceTitan</span></div>
      </div>
      <div class="bl-b-cover"><img src="%(cover)s" alt="" data-bl-cover></div>
    </header>
    <nav class="bl-chipnav" aria-label="On this page"><span>On this page</span>%(chips)s</nav>
    <div class="bl-b-grid">
      <div>
        <article class="bl-prose" data-bl-article>%(video)s%(art)s</article>
        <div class="bl-endrow">%(tags)s%(author)s</div>
      </div>
      <aside class="ct-card g-violet bl-connect" aria-label="Connect ServiceTitan">
        <span class="ct-ico">%(plug)s</span>
        <h3>Connect ServiceTitan</h3>
        <p>Start a free trial and follow this guide with your own account.</p>
        <a class="ct-btn primary" href="https://app.makini.io/register" target="_blank" rel="noopener">Start free trial</a>
        <div class="bl-connect-l">
          <a href="https://docs.makini.io/" target="_blank" rel="noopener">%(book)s<span>Makini documentation</span></a>
          <a href="mailto:support@makini.io">%(mail)s<span>support@makini.io</span></a>
        </div>
      </aside>
    </div>
  </div>
  %(rel)s
</div>''' % dict(
        anno=anno("Post layout: split hero and sticky connect card",
                  codes("Platform.connect_url", "Platform.docs_url", "Platform.support_email") + " feed the card, contents chips from the H2 headings"),
        crumb=crumb(), title=POST_TITLE, deck=POST_DECK, by=byline(), cover=COVER_FALLBACK,
        chips="".join('<a href="#%s">%s</a>' % (h, t) for h, t, l in toc if l == 2),
        video=video(), art=art, tags=tags_row(), author=author_box(), plug=IC["plug"], book=IC["book"], mail=IC["mail"], rel=related("b"))


def post_c(art, toc):
    rail = "".join('<li%s><a href="#%s"><span>%s</span></a></li>' % (' class="is-sub"' if l == 3 else "", h, t) for h, t, l in toc)
    return '''
<div class="ct-v" data-v="c">
  %(anno)s
  <div class="bl-progress" aria-hidden="true"><i></i></div>
  <nav class="bl-rail bl-toc-rail" aria-label="On this page"><ul>%(rail)s</ul></nav>
  <header class="bl-ph is-c"><div class="bl-ph-bg" aria-hidden="true"><img src="%(cover)s" alt="" data-bl-cover></div><div class="m-container">
    %(crumb)s
    <div class="bl-tags" style="margin-bottom:22px"><span class="bl-kind">Guide</span></div>
    <h1 class="s1-h1" style="text-align:left">%(title)s</h1>
    <p class="bl-deck">%(deck)s</p>
    %(by)s
    <div class="bl-plats"><span class="bl-plat">ServiceTitan</span></div>
  </div></header>
  <div class="m-container">
    <div class="bl-c-main">
      <article class="bl-prose is-lg" data-bl-article>%(video)s%(art)s</article>
      <div class="bl-endrow">%(tags)s%(author)s</div>
    </div>
    <div style="max-width:1000px;margin:24px auto 0">%(cta)s</div>
  </div>
  %(rel)s
</div>''' % dict(
        anno=anno("Post layout: immersive with progress bar and contents rail",
                  codes("Type", "Platform", "Cover", "Body (rich text)") + ", reading progress and rail are generated from the page"),
        rail=rail, cover=COVER_FALLBACK, crumb=crumb(), title=POST_TITLE, deck=POST_DECK, by=byline(),
        video=video(), art=art, tags=tags_row(), author=author_box(), cta=cta_band(), rel=related("c"))


def build_post():
    art_a, toc_a = article("a")
    art_b, toc_b = article("b")
    art_c, toc_c = article("c")
    sec = '''
<section class="ct-sec bl-sec ct-glow-tr ct-block" id="post-layout" data-ct-block="post-layout" data-active="a">
  %s
  %s%s%s
</section>''' % (switch([("a", "Editorial"), ("b", "Split hero"), ("c", "Immersive")]),
                 post_a(art_a, toc_a), post_b(art_b, toc_b), post_c(art_c, toc_c))
    return page(
        POST_TITLE + " | Makini", sec, body_class="ct-post",
        head_extra=CSS, tail_extra=JS, description=POST_DECK)


def main():
    for name, html in (("blog.html", build_listing()), ("blog-post.html", build_post())):
        with open(os.path.join(HERE, name), "w", encoding="utf-8", newline="\n") as f:
            f.write(html)
        print("wrote", name, len(html))


if __name__ == "__main__":
    main()
