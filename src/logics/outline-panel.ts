/**
 * The outline panel's identity, in one place.
 *
 * The control and the panel are separate files, and the control has to point at
 * the panel it opens (`aria-controls`) and name it (`aria-labelledby`). Ids
 * spelled in two files are ids that drift, so they are spelled here.
 */
export const OUTLINE_PANEL_ID = 'outline-panel'

/** The header inside the panel that gives it its name. */
export const OUTLINE_PANEL_TITLE_ID = 'outline-panel-title'
