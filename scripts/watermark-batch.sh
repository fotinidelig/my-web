#!/bin/bash

# Batch Watermark Script using ImageMagick
# 
# This script adds a watermark to all images in a directory.
# Requires ImageMagick to be installed: sudo apt install imagemagick
#
# Usage:
#   ./watermark-batch.sh input_folder output_folder

set -e

# Configuration
WATERMARK_TEXT="© Fotini Deligiannaki"
FONT_SIZE=24
OPACITY=70  # 0-100
POSITION="southeast"  # northwest, north, northeast, west, center, east, southwest, south, southeast
OFFSET_X=20
OFFSET_Y=20
FONT_COLOR="white"

# Check arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 <input_folder> <output_folder>"
    echo "Example: $0 /path/to/gallery /path/to/gallery-watermarked"
    exit 1
fi

INPUT_DIR="$1"
OUTPUT_DIR="$2"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick not found. Install it with:"
    echo "  sudo apt install imagemagick  (Ubuntu/Debian)"
    echo "  brew install imagemagick      (macOS)"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Counter
count=0

# Process all images
echo "Processing images in $INPUT_DIR..."
echo "Output directory: $OUTPUT_DIR"
echo ""

for img in "$INPUT_DIR"/*.{jpg,jpeg,JPG,JPEG,png,PNG}; do
    # Check if file exists (handles case when no matches found)
    if [ ! -f "$img" ]; then
        continue
    fi
    
    filename=$(basename "$img")
    output_file="$OUTPUT_DIR/$filename"
    
    echo "Processing: $filename"
    
    # Add watermark using ImageMagick
    convert "$img" \
        -gravity "$POSITION" \
        -pointsize "$FONT_SIZE" \
        -fill "$FONT_COLOR" \
        -annotate +${OFFSET_X}+${OFFSET_Y} "$WATERMARK_TEXT" \
        "$output_file"
    
    count=$((count + 1))
done

echo ""
echo "Done! Processed $count images."
echo "Watermarked images saved to: $OUTPUT_DIR"
