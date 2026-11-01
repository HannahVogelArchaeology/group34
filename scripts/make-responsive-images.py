#!/usr/bin/env python3
"""Create smaller WebP copies of the exhibition photos so each screen downloads only the size it needs.

How it works
  - It reads every .jpg, .jpeg and .png file in assets/images/ (the originals are never changed or renamed).
  - For each photo it writes WebP copies at several widths into assets/images/responsive/.
  - It writes _data/responsive_images.json, which the site templates read to build the "srcset" attribute.
  - The photo viewer still loads the ORIGINAL file when a visitor zooms in.
  - Empty (0 KB) placeholder files and very small images are skipped. They keep using the original file.

Usage (run it from the repository root, again whenever photos are added or replaced):
    pip install Pillow
    python scripts/make-responsive-images.py

Options:
    --quality 85      WebP quality, 1-100 (default 85; photos stay sharp at 80-90)
    --max-width 2400  widest copy to create (a copy is never wider than its original)
    --force           rebuild every copy, even if it looks up to date
"""

import argparse
import json
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required. Install it with:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "assets" / "images"
OUTPUT_DIR = SOURCE_DIR / "responsive"
MANIFEST = ROOT / "_data" / "responsive_images.json"
URL_PREFIX = "/assets/images/"

SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
STANDARD_WIDTHS = [480, 800, 1200, 1600, 2400]
MIN_ORIGINAL_WIDTH = 640  # smaller originals are already light enough to use as they are


def widths_for(original_width, max_width):
    """Widths to create: the standard steps below the cap, plus the cap itself (never upscaled)."""
    cap = min(original_width, max_width)
    return sorted({w for w in STANDARD_WIDTHS if w < cap} | {cap})


def slug_for(relative_path):
    """File-name-safe version of the path (no spaces), used only for the copies."""
    stem = relative_path.with_suffix("").as_posix()
    return re.sub(r"[^A-Za-z0-9._-]+", "-", stem).strip("-")


def prepare(image):
    """Apply the EXIF rotation and make sure the colour mode can be saved as WebP."""
    icc_profile = image.info.get("icc_profile")
    image = ImageOps.exif_transpose(image)
    if image.mode == "P":
        image = image.convert("RGBA" if "transparency" in image.info else "RGB")
    elif image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGB")
    return image, icc_profile


def format_kb(size):
    return f"{size / 1024:.0f} KB"


def main():
    parser = argparse.ArgumentParser(description="Create responsive WebP copies of the exhibition photos.")
    parser.add_argument("--quality", type=int, default=85, help="WebP quality 1-100 (default 85)")
    parser.add_argument("--max-width", type=int, default=2400, help="widest copy in pixels (default 2400)")
    parser.add_argument("--force", action="store_true", help="rebuild every copy")
    args = parser.parse_args()

    if not SOURCE_DIR.is_dir():
        sys.exit(f"Folder not found: {SOURCE_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {}
    used_slugs = {}
    kept_files = set()
    created = skipped = empty = 0

    sources = sorted(
        path
        for path in SOURCE_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() in SOURCE_EXTENSIONS and OUTPUT_DIR not in path.parents
    )

    for source in sources:
        relative = source.relative_to(SOURCE_DIR)
        label = relative.as_posix()

        if source.stat().st_size == 0:
            empty += 1  # reported once in the summary
            continue

        try:
            with Image.open(source) as opened:
                image, icc_profile = prepare(opened)
        except Exception as error:  # a damaged file must not stop the other photos
            print(f"skip   {label}  (cannot read: {error})")
            skipped += 1
            continue

        width, height = image.size
        if width < MIN_ORIGINAL_WIDTH:
            print(f"skip   {label}  ({width}px wide: already small, the original is used)")
            skipped += 1
            continue

        slug = slug_for(relative)
        if slug in used_slugs:
            sys.exit(f"Two photos would share the copy name '{slug}': {used_slugs[slug]} and {label}. Rename one.")
        used_slugs[slug] = label

        widths = widths_for(width, args.max_width)
        sizes = []
        for target in widths:
            output = OUTPUT_DIR / f"{slug}-{target}.webp"
            kept_files.add(output.name)
            up_to_date = output.exists() and output.stat().st_mtime >= source.stat().st_mtime
            if up_to_date and not args.force:
                sizes.append(format_kb(output.stat().st_size))
                continue
            target_height = max(1, round(height * target / width))
            resized = image if target == width else image.resize((target, target_height), Image.Resampling.LANCZOS)
            save_options = {"quality": args.quality, "method": 6}
            if icc_profile:
                save_options["icc_profile"] = icc_profile
            resized.save(output, "WEBP", **save_options)
            sizes.append(format_kb(output.stat().st_size))
            created += 1

        manifest[URL_PREFIX + label] = {
            "w": width,
            "h": height,
            "base": f"{URL_PREFIX}responsive/{slug}",
            "widths": widths,
        }
        print(f"ok     {label}  {width}x{height}, {format_kb(source.stat().st_size)} -> " + ", ".join(
            f"{w}w {s}" for w, s in zip(widths, sizes)
        ))

    # Remove copies whose original no longer exists or is no longer converted.
    removed = 0
    for old in OUTPUT_DIR.glob("*.webp"):
        if old.name not in kept_files:
            old.unlink()
            removed += 1

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=1, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")

    print(
        f"\nDone: {len(manifest)} photo(s) with responsive copies, {created} file(s) written, "
        f"{skipped} skipped, {empty} empty placeholder file(s) ignored, {removed} stale file(s) removed.\nManifest: {MANIFEST.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
