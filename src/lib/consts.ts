export const FRAME_ID = "__playpet__frame__"
export const TICK_TIMEOUT = 1000
export const DOCUMENT_FRAME_SIZE = 96
export const DROPPINGS_FRAME_SIZE = 32
export const POPUP_FRAME_SIZE = 128

export const MOVE_PERIOD = 20 * 1000 // 20 secs
export const MOVE_DURATION = 5000
export const MOVE_PERIOD_MINS = MOVE_PERIOD / 60000
export const SAVE_PERIOD = 60 * 1000
export const SAVE_PERIOD_MINS = SAVE_PERIOD / 60000
export const TIMEOUT_IN_MINS = TICK_TIMEOUT / 60000

export const SEC = 1000 / TICK_TIMEOUT
export const MIN = SEC * 60 // in secs
export const HOUR = MIN * 60 //in secs
export const DAY = HOUR * 24 // in secs
