A1 Sanskriti website — colour variants
======================================
Copy these files into the aa1 repo (overwrite), then:
  git add -A && git commit -m "Colour variants (group by style, swatch selector)" && git push

What changed:
- Products are grouped by their POS "Style/Group" name. The shop, home and
  grids now show ONE card per style with a "N colours" badge + colour dots.
- The product page shows a colour-swatch selector; picking a colour switches
  the image, price and live stock, and adds THAT colour's variant to the cart.
- Out-of-stock colours are shown crossed-out and disabled.
No env or DB changes needed — get_online_products already returns group_name + color.
