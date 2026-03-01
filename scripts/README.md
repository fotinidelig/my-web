# Image Processing Scripts

Scripts for batch processing images for web use.

## watermark-batch.sh

Batch watermarking script using ImageMagick.

### Prerequisites

Install ImageMagick:
```bash
# Ubuntu/Debian
sudo apt install imagemagick

# macOS
brew install imagemagick
```

### Usage

```bash
./scripts/watermark-batch.sh <input_folder> <output_folder>
```

### Example

```bash
# Create watermarked versions
./scripts/watermark-batch.sh public/gallery public/gallery-watermarked

# Then replace original folder contents if satisfied
cp public/gallery-watermarked/* public/gallery/
```

### Configuration

Edit the script to customize:
- `WATERMARK_TEXT`: Copyright text
- `FONT_SIZE`: Text size
- `OPACITY`: Transparency (0-100)
- `POSITION`: Watermark position (southeast, center, etc.)
- `OFFSET_X`, `OFFSET_Y`: Distance from edges
- `FONT_COLOR`: Text color

---

**Note**: Always keep original, unwatermarked images as master copies. Use watermarked versions only for web display.
