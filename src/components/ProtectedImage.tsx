import { useEffect, useRef, useState } from 'react';

type ProtectedImageProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  /** Show watermark overlay */
  watermark?: boolean;
  /** Watermark text (defaults to copyright notice) */
  watermarkText?: string;
  /** Disable right-click protection */
  disableRightClick?: boolean;
  /** Disable drag protection */
  disableDrag?: boolean;
  /** Show overlay protection (transparent div over image) */
  overlayProtection?: boolean;
  /** Custom copyright notice */
  copyrightNotice?: string;
};

/**
 * ProtectedImage Component
 * 
 * Multi-layer image protection component that implements:
 * - Right-click and context menu disabling
 * - Drag-and-drop prevention
 * - Pointer event pass-through for clickable parents
 * - Watermarking option
 * - Copyright metadata preservation
 * 
 * Note: No web-based protection is 100% foolproof, but this provides
 * multiple deterrents and legal protections.
 */
export default function ProtectedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  watermark = false,
  watermarkText,
  disableRightClick = true,
  disableDrag = true,
  overlayProtection = true,
  copyrightNotice = '© Fotini Deligiannaki. All rights reserved.',
}: ProtectedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contextMenuTargetRef = useRef<HTMLElement | null>(null);
  const [showCopyright, setShowCopyright] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    // Find clickable parent (button/link) for context menu protection
    // Store in ref to ensure cleanup matches setup
    const clickableParent = container.parentElement?.closest('button, a');
    contextMenuTargetRef.current = (clickableParent as HTMLElement) || container;

    // Prevent right-click and context menu
    const handleContextMenu = (e: MouseEvent) => {
      if (disableRightClick) {
        e.preventDefault();
        showTemporaryNotice();
      }
    };

    // Prevent drag start
    const handleDragStart = (e: DragEvent) => {
      if (disableDrag) {
        e.preventDefault();
        showTemporaryNotice();
      }
    };

    // Prevent keyboard shortcuts (Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        showTemporaryNotice();
      }
    };

    // Disable text selection on image
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Show temporary copyright notice
    const showTemporaryNotice = () => {
      setShowCopyright(true);
      setTimeout(() => setShowCopyright(false), 2000);
    };

    // Attach event listeners
    contextMenuTargetRef.current.addEventListener('contextmenu', handleContextMenu as EventListener);
    img.addEventListener('dragstart', handleDragStart);
    img.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    // CSS protection: disable drag and selection
    img.draggable = !disableDrag;
    img.style.userSelect = 'none';
    (img.style as any).webkitUserSelect = 'none';
    (img.style as any).webkitUserDrag = 'none';

    // Set referrer policy to prevent hotlinking
    img.referrerPolicy = 'no-referrer';

    // Add copyright to image data
    img.setAttribute('data-copyright', copyrightNotice);
    img.setAttribute('title', copyrightNotice);

    return () => {
      if (contextMenuTargetRef.current) {
        contextMenuTargetRef.current.removeEventListener('contextmenu', handleContextMenu as EventListener);
      }
      img.removeEventListener('dragstart', handleDragStart);
      img.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [disableRightClick, disableDrag, copyrightNotice, overlayProtection]);

  const watermarkDisplay = watermarkText || copyrightNotice;

  // When protection is completely disabled, use a simpler wrapper that doesn't interfere
  if (!overlayProtection && !disableRightClick && !disableDrag) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${watermark ? 'inline-block' : overlayProtection ? 'block w-full h-full' : 'inline-block'}`}
      style={{ 
        userSelect: 'none',
        // Pass through pointer events only when overlay protection is enabled
        // For preview thumbnails without protection, allow normal interaction
        pointerEvents: overlayProtection ? 'none' : 'auto',
      }}
    >
      {/* Main image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        style={{
          display: 'block',
          // For watermark images (modals), don't force 100% width/height
          // Let the className handle sizing (max-h, max-w, object-contain)
          width: watermark ? undefined : '100%',
          height: watermark ? undefined : '100%',
          userSelect: 'none',
          WebkitUserSelect: 'none' as any,
          // @ts-ignore - vendor prefix
          WebkitUserDrag: 'none',
          // Pass through pointer events when overlay protection enabled
          // Otherwise allow normal interaction
          pointerEvents: overlayProtection ? 'none' : 'auto',
        }}
      />

      {/* Watermark overlay - positioned absolutely within the image container */}
      {watermark && (
        <div
          className="absolute bottom-2 right-2 z-20 px-2 py-1 bg-black/60 text-white text-xs pointer-events-none"
          style={{ 
            fontFamily: 'monospace', 
            userSelect: 'none',
          }}
        >
          {watermarkDisplay}
        </div>
      )}

      {/* Temporary copyright notice */}
      {showCopyright && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-black/90 text-white px-6 py-4 rounded-lg shadow-2xl text-sm md:text-base max-w-md mx-4 text-center animate-fade-in">
            <p className="font-semibold mb-2">⚠️ Protected Content</p>
            <p className="opacity-90">{copyrightNotice}</p>
          </div>
        </div>
      )}
    </div>
  );
}
