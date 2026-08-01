# Local inspection tools

These scripts drive a headless browser against the dev server so the rendered
site can be checked rather than guessed at. They are **not** part of the build.

Playwright is deliberately absent from `package.json` — leaving it there makes
the hosting provider download ~100 MB of browsers on every deploy. Install it
locally when you need these:

    npm i -D playwright
    npx playwright install chromium

Then, with `npm run dev` running:

    node tools/_shot.mjs  <out> <url> <width> <height> [full]   # one screenshot
    node tools/_bands.mjs <steps>                               # scroll down, shoot each screen
    node tools/_seq.mjs                                         # hero entrance, frame by frame
    node tools/_scroll.mjs                                      # report sections that never revealed
    node tools/_trim.mjs                                        # re-trim white frames from product photos
