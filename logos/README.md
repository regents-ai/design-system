# Regent logos

Vector marks for the Regent family, drawn on a shared block grid for the near-black design
system. Three marks: the **crown** (Regents Labs, parent company), the **chart** (Autolaunch),
and the **tree** (Techtree). Geometry of the chart and tree matches the original navy marks;
all three are rendered in one technique (connected block runs, light from the top, right faces
darkest).

## Naming

`<product>-<style>-<scheme>.svg`

- **style** — `voxel` is the 3D version for hero placements (site header, landing pages,
  decks). `flat` is the 2D pixel version for favicons, avatars, and anything below ~48px.
- **scheme** — `dark` is near-white blocks on near-black; `light` is near-black blocks on white.

`regents-appicon-*.svg` are ready-made rounded-square app icons (flat crown, 96 viewBox).

## Palette

| Role | Dark scheme | Light scheme |
|---|---|---|
| Background | `#0A0A0A` | `#FFFFFF` |
| Flat blocks | `#F5F5F2` | `#141414` |
| Voxel top face | `#FFFFFF` | `#3D3D3D` |
| Voxel front face | `#F2F2EF` | `#1C1C1C` |
| Voxel right face | `#C6C6C0` | `#050505` |
| Voxel stroke | `#B3B3AC` | `#4D4D4D` |

Each SVG includes its background rect. For transparent placement on an app surface, drop the
first `<rect>` and keep the block colors.

## Raster set

`png/` holds production rasters generated from the flat crown (`make_rasters` supersampled
render, not a screenshot): icons at 16/32/180/192/512/1024 in both schemes, 1200x630 share
images, and multi-size `.ico` files (16-256). The platform ships the dark set.
`<product>-flat-<scheme>-{1024,512}.png` are straight exports of the flat Autolaunch and
Techtree masters at their native aspect ratios.

## Avatars

`<product>-avatar-dark.svg` are square 1024 compositions of the voxel marks on near-black,
padded for avatar use and safe under circular crops; all three are sized to the same optical
weight. `png/<product>-avatar-dark-{1024,512,400}.png` are the upload-ready rasters
(400 for X, 512 for Discord and most others).

## Small sizes

Use the `flat` versions for favicons and avatars. The crown and chart stay legible at 16px;
the tree is the busiest mark — prefer 32px and up where possible.
