"CRAFTED BY PAT MIAZGA" FOOTER CREDIT — WHAT'S IN THIS ZIP
=============================================================

WHAT WAS DONE
- Cropped the artwork tight to the lettering + trinity knot (removed the
  excess black canvas around it) so the mark reads clearly even at small
  footer size.
- Exported at 900px wide (2x the display size) so it stays crisp/sharp
  when the browser scales it down — no softness or loss of the engraved
  texture.
- Saved as WebP (34KB, primary) with a PNG fallback (472KB) for any
  browser that doesn't support WebP. The <picture> tag in index.html
  automatically serves whichever the visitor's browser supports.
- Added a small "site-credit" section directly below your existing
  footer, on its own dark (ink) background so the artwork's black
  backdrop blends in seamlessly rather than sitting in a visible box.
- The image has hover feedback (subtle brighten/scale) for desktop
  visitors — a nice small touch, invisible on mobile.

FILES
- index.html                          → replaces your current homepage file
- images/crafted-by-pat-miazga.webp   → primary logo (small file size)
- images/crafted-by-pat-miazga.png    → fallback logo (older browsers)

HOW TO UPLOAD (GitHub Desktop)
1. Copy images/crafted-by-pat-miazga.webp and .png into the "images"
   folder of your patmiazga.com repo (create the folder if it doesn't
   already exist there).
2. Replace your existing index.html with the one in this zip.
   (Only the <head> styles and the very bottom of the page — right
   after </footer> — changed. Nothing else in your homepage was
   touched.)
3. Drag the repo folder into GitHub Desktop → commit → push, same as
   always.

ADDING IT TO YOUR OTHER PAGES / SITES
This zip only updates index.html (the file you sent me). To put the
same credit on other pages of patmiazga.com, or on anarchistliving.ca,
osoyoosliving.ca, and southokanaganmove.ca, the same two image files
work everywhere — just paste this block right after the closing
</footer> tag on each page, and make sure the <style> block from the
<head> of this index.html is present too (or move it into style.css
once, so every page can use it without repeating the <style> tag):

  <div class="site-credit">
    <picture>
      <source srcset="images/crafted-by-pat-miazga.webp" type="image/webp" />
      <img src="images/crafted-by-pat-miazga.png" alt="Crafted by Pat Miazga"
           width="900" height="434" loading="lazy" />
    </picture>
  </div>

Just double-check the "images/" path is correct relative to each page
(some of your pages may sit in subfolders).
