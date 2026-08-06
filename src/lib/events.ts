/**
 * Cross-component window events. Kept in their own module so dispatchers
 * (navbar, palette) don't statically import the lazily-loaded overlays.
 */
export const OPEN_CHAT_EVENT = "navdeep:open-chat";
export const OPEN_PALETTE_EVENT = "navdeep:open-palette";
