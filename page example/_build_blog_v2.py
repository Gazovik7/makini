"""Builds blog-v2.html: the blog listing in the editorial style (big featured photo, underline tabs
with counts, search on the same row, photo cards). Real posts only, no pills.

    python -I -X utf8 "page example/_build_blog_v2.py"
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from _ct_shell import page  # noqa: E402

SEARCH = '<svg class="bv-sic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'

MAIN = """
<section class="bv-wrap" data-bt data-pal="b" data-pat="amb">
  <div class="m-container">
    <div class="bv-hero">
      <nav class="bv-crumbs" aria-label="Breadcrumb"><a href="https://www.makini.io/">Home</a><span>/</span><a href="blog-v2.html" aria-current="page">Blog</a></nav>
      <span class="bv-eyebrow">Blog</span>
      <h1 class="bv-h1">Guides, releases and news from Makini</h1>
      <p class="bv-lead">Everything about connecting industrial systems: setup guides, product announcements and company news.</p>
    </div>
    <div class="bv-feature" id="bv-feature" aria-roledescription="carousel" aria-label="Featured posts"></div>
    <div class="bv-lower">
    <div class="bv-bar">
      <div class="bv-total" id="bv-total"></div>
      <div class="bv-tabs" id="bv-tabs" role="tablist"></div>
      <div class="bv-tools">
        <div class="bv-find">
          <label class="bv-search">%s<input id="bv-q" type="search" placeholder="Search posts or platforms..." aria-label="Search posts or platforms" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="bv-sugg"><button type="button" class="bv-qclear" id="bv-qclear" aria-label="Clear search"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></label>
          <div class="bv-sugg" id="bv-sugg" role="listbox" aria-label="Platforms" hidden></div>
        </div>
      </div>
    </div>
    <div class="bv-grid" id="bv-grid"></div>
    <div class="bv-empty" id="bv-empty" hidden><p>No posts match your search.</p><button type="button" class="ct-btn ghost" id="bv-clear">Clear filters</button></div>
    <div class="bv-more" id="bv-more"><button type="button" class="ct-btn ghost" id="bv-morebtn">Load more</button></div>
    <p class="bv-count" id="bv-count"></p>
    </div>
  </div>
</section>
""" % SEARCH

HEAD = '<link href="./assets/content/ct-blocks.css" rel="stylesheet" type="text/css"><link href="./assets/content/blog-v2.css?v=9" rel="stylesheet" type="text/css"><link href="./assets/content/blog-theme.css?v=9" rel="stylesheet" type="text/css"><link href="./assets/content/blog-brand.css?v=11" rel="stylesheet" type="text/css"><link href="./assets/content/blog-site.css?v=2" rel="stylesheet" type="text/css"><script src="./assets/content/blog-style.js?v=1"></script><link href="./assets/content/blog-add.css?v=9" rel="stylesheet" type="text/css">'
TAIL = '<script src="./assets/content/blog-data.js?v=9"></script><script src="./assets/content/blog-live.js?v=9"></script><script src="./assets/content/blog-full-data.js?v=2"></script><script src="./assets/content/blog-review.js?v=6"></script><script src="./assets/content/blog-v2.js?v=15"></script><script src="./assets/content/blog-theme.js?v=9"></script>'

if __name__ == "__main__":
    out = page("Blog | Makini review", MAIN, head_extra=HEAD, tail_extra=TAIL)
    with open(os.path.join(HERE, "blog-v2.html"), "w", encoding="utf-8", newline="") as f:
        f.write(out)
    print("wrote blog-v2.html", len(out))
