"""Builds blog-article-elements.html: one long article that shows every element a blog post can contain, one after another,
drawn with the production article styles. No captions, no specs, just the elements.

    python -I -X utf8 "page example/_build_blog_elements.py"
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import _build_blog_article as A  # noqa: E402
from _ct_shell import page  # noqa: E402


def h2(idn, n, text):
    return '<h2 id="%s">%s</h2>' % (idn, text)


SECS = [
    ("headings", "Headings", [("third-level", "A third level heading")]),
    ("text", "Text and links", []),
    ("lists", "Lists", []),
    ("quote", "Quote", []),
    ("callouts", "Callouts", []),
    ("code", "Code", []),
    ("table", "Table", []),
    ("media", "Images and video", []),
    ("faq", "Questions and answers", []),
    ("next", "What to do next", []),
]

ARTICLE = (
    '<p class="ba-lead">A short opening paragraph sets up the whole post. It is set larger than the text below it and tells the reader what they will get.</p>'
    '<p>The paragraph after it is regular text. It runs at a comfortable line length, with enough space between lines to read for a long time without tiring.</p>'

    + '<p><strong>Real articles in this design:</strong></p>'
    + '<ul><li><a href="blog-v2.html">Blog listing, version A (current)</a></li>'
      '<li><a href="blog-v2.html?v=full">Blog listing, version B (all live posts)</a></li>'
      '<li><a href="blog-article-direct-vs-third-party.html">Direct vs. third-party MCP servers: the industrial edition</a></li>'
      '<li><a href="blog-article-servicetitan.html">ServiceTitan - How do I connect via API Authentication?</a></li>'
      '<li><a href="blog-article-fishbowl.html">Fishbowl Advanced - How do I connect via API Authentication?</a></li>'
      '<li><a href="blog-article.html">How to connect your CMMS to your ERP without losing data on the way</a></li></ul>'

    + h2("headings", 1, "Headings")
    + '<p>A post is split into sections, and each section opens with a title like the one above.</p>'
    + '<h3 id="third-level">A third level heading</h3>'
    + '<p>A smaller title splits a long section into parts that a reader can scan.</p>'
    + '<h4>A fourth level heading</h4>'
    + '<p>The smallest title names a short group inside a part.</p>'

    + h2("text", 2, "Text and links")
    + '<p>Most of a post is plain paragraphs like this one. Keep them short, three to five sentences, so a reader sees a new paragraph before they lose their place.</p>'
    + '<p>Inside a paragraph you can use <strong>bold text</strong> for the thing that matters most, <em>italics</em> for a term or a title, '
      'a <a href="blog-v2.html">link to another page</a>, and <code>inline code</code> for a value, a field name or a command. '
      'A long web address such as '
      '<a href="https://developer.example.com/portal/applications/register/new/application">https://developer.example.com/portal/applications/register/new/application</a> '
      'wraps inside the column and never pushes the page sideways.</p>'

    + h2("lists", 3, "Lists")
    + '<p>A bullet list is for items that are equal and have no order.</p>'
    + '<ul><li>Each item is a full phrase that makes sense on its own.</li>'
      '<li>Items stay short, one or two lines each.</li>'
      '<li>The list is never nested inside another list.</li></ul>'
    + '<p>A numbered list is for steps that follow one another.</p>'
    + '<ol class="ba-steps"><li><b>Open the settings.</b> Start with the first screen the reader will see.</li>'
      '<li><b>Fill in the details.</b> A step can have a bold lead-in and a sentence after it. It can also hold a short list:'
      '<ul><li>A bullet inside a step.</li><li>A second bullet inside the same step.</li></ul></li>'
      '<li><b>Confirm.</b> Each step is one action.</li></ol>'
    + '<p>A checklist is for things the reader goes through before moving on.</p>'
    + '<ul class="ba-check">'
    + "".join('<li><i>%s</i><span>%s</span></li>' % (A.IC["check"], t) for t in (
        "One short sentence for each thing to check.", "Items that are actions start with a verb.", "Eight items at most, so it stays a list."))
    + '</ul>'

    + h2("quote", 4, "Quote")
    + '<p>A quote pulls out a sentence worth reading twice.</p>'
    + '<blockquote class="ba-quote"><p>A good integration is the one nobody on the floor has to think about.</p><cite>Name of the speaker, role</cite></blockquote>'
    + '<p>The text continues after the quote as usual.</p>'

    + h2("callouts", 5, "Callouts")
    + '<p>A callout is a bordered block with a small label. It is used for a tip, a warning or a summary.</p>'
    + '<aside class="ba-note"><span class="ba-note-t">Tip</span><p>Keep the text to two or three lines. If it needs more, it belongs in the body.</p></aside>'
    + '<aside class="ba-note is-warn"><span class="ba-note-t">Important</span><p>A warning names the mistake and, when there is room, how to avoid it.</p></aside>'
    + '<aside class="ba-note is-keys"><span class="ba-note-t">Key takeaways</span><ul class="ba-ticks">'
      '<li>The first point the reader should keep.</li><li>The second point, in the same form.</li><li>The third point.</li></ul></aside>'

    + h2("code", 6, "Code")
    + '<p>Code goes in a block with a file name and a Copy button.</p>'
    + A.code("example.json", '{\n  "event": "record.updated",\n  "id": "REC-1042",\n  "status": "closed",\n  "items": [ { "sku": "A-100", "qty": 2 } ]\n}')
    + A.code("request.sh", 'curl -X POST https://api.example.com/records \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{ "status": "closed" }\'')

    + h2("table", 7, "Table")
    + '<p>A table compares things across a few columns.</p>'
    + '<div class="ba-table"><table><thead><tr><th>Field</th><th>Type</th><th>Direction</th><th>Rule</th></tr></thead><tbody>'
      '<tr><td>Identifier</td><td>Text</td><td>Source to target</td><td>Keep the source value unchanged.</td></tr>'
      '<tr><td>Status</td><td>List</td><td>Both ways</td><td>The owner of the record wins.</td></tr>'
      '<tr><td>Updated at</td><td>Timestamp</td><td>Source to target</td><td>Store in UTC.</td></tr></tbody></table></div>'

    + h2("media", 8, "Images and video")
    + '<p>An image runs the full width of the text, with a caption underneath.</p>'
    + '<figure class="ba-fig"><img src="%s" alt="" loading="lazy"><figcaption>A caption says what to look at in the image.</figcaption></figure>' % A.FIG
    + '<p>A video sits in the same place and plays with its own controls.</p>'
    + '<figure class="ba-video"><video controls preload="none" poster="./assets/content/corrigopro-poster.jpg"><source src="./Makini_CorrigoPro_to_AI_1080p.mp4" type="video/mp4"></video>'
      '<figcaption>The caption of a video says what it shows.</figcaption></figure>'

    + h2("faq", 9, "Questions and answers")
    + '<div class="ba-faq"><details open><summary>What does a question look like?</summary><p>A question is a full sentence that ends with a question mark. The answer is short and can hold a link.</p></details>'
      '<details><summary>How many questions can there be?</summary><p>Up to eight. More than that is a page of its own.</p></details>'
      '<details><summary>Do they work without scripts?</summary><p>Yes. Each one opens and closes on its own.</p></details></div>'

    + h2("next", 10, "What to do next")
    + '<div class="ba-cta"><div><h3>A call to action names the next step</h3><p>One sentence explains what the reader gets.</p></div>'
      '<div class="ba-cta-b"><a class="ba-btn is-solid" href="https://app.makini.io/register">Primary action</a></div></div>'
)

def build():
    toc = A.toc("ba-toc-l", SECS)
    main = A.make_main(
        title="All article elements",
        deck="Headings, text, lists, quotes, callouts, code, tables, images, video and more, one after another.",
        cover=A.SP + "17-conveyor-line.webp" if os.path.exists(os.path.join(HERE, "assets/use-cases/processed/spectrum/17-conveyor-line.webp")) else A.COVER,
        article=ARTICLE, toc=toc, toc_in=toc,
        date_iso="2026-11-03", date_h="Nov 3, 2026", read="3 min read",
        crumb="Guides", crumb_href="blog-v2.html", type_label="Guide",
        author="George Surovtsev", role="CEO", photo="george.jpg", bio="",
        news_text="One short email when a new post is published.")
    out = page("Article elements | Makini review", main, head_extra=A.HEAD, tail_extra=A.TAIL)
    with open(os.path.join(HERE, "blog-article-elements.html"), "w", encoding="utf-8", newline="") as f:
        f.write(out)
    print("wrote blog-article-elements.html", len(out))


if __name__ == "__main__":
    build()
