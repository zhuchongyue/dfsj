export const render = {
  /**
   * [CSS Color]
   * The canvas background color. If don't need, set to null.
   * @type String.
   */
  background: null,

  /**
   * The stage width.
   */
  width: 360,

  /**
   * The stage height.
   */
  height: 45,
  /**
   * Jump to current position when mouse clicked.
   * @type {boolean}
   */
  jump: true,

  /**
   * Set enable(disable) drag.
   * If enabled, when client press the cursor and move, the current index and range and key nodes may change by move distance.
   */
  draggable: true,

  /**
   * Set enable(disable) translation.
   *
   * If enabled, when mouse drag track, all node will be translation except current node.
   */
  translation: true,

  /**
   * Adjust the current index when current index is jump to range start or range end.
   * Percent 100% ~ 0%;
   *
   * If set to 0 or 0%, then disable edge adjust. Usually, set to 50%;
   */
  edgeAdjust: "50%",

  /**
   * The enable(disable) tooltip when mouse move in track.
   * @type {boolean|Object}
   */
  overlay: {
    enabled: true,
    empty: "暂无数据...",
  },

  /**
   * The track options.
   */
  track: {
    /**
     * Left position. Number or percent of string(10 or "5%").
     * @type {Number|String}
     */
    left: 10,
    /**
     * Top position. Number or percent of string(10 or "5%").
     * @type {Number|String}
     */
    top: "50%",
    /**
     * Right position. Number or percent of string(10 or "5%").
     * @type {Number|String}
     */
    right: 10,
    /**
     * Track height
     * @type {Number}
     */
    height: 7,
    /**
     * [CSS Color]
     * Track background color.
     * @type {String}
     */
    color: "rgba(233,233,233,0.7)",
  },

  node: {
    enabled: true,

    /**
     * The key node size in radius.
     * @type {Number}
     */
    size: 10,

    /**
     * Key node count.
     *
     * @type {Number}
     */
    count: 7,

    /**
     * Set minimum node count.
     * When scaled, the node count may change, but the number keep the key node count at least.
     * This number is 1 <= minCount < count.
     * I suggest set to 3.
     */
    minCount: 3,

    /**
     * [CSS Color]
     * The key node color.
     * @type {String}
     */
    color: "#fff",
    /**
     * The key node outline width, if dont't need, set to 0 or null.
     * @type {Number}
     */
    outlineWidth: 0.5,
    /**
     * [CSS Color]
     * The key node outline color, if dont't need, set to null.
     * @type {String}
     */
    outlineColor: "#1ab7ff",

    shadow: "",
  },

  /**
   * Current node options.
   */
  cursor: {
    /**
     * The current node size.
     * @type {Number}
     */
    size: 15,
    /**
     * [CSS Color]
     * The current node color.
     */
    color: "#1ab7ff",
    /**
     * The current node outline width, if dont't need, set to 0 or null.
     * @type {Number}
     */
    outlineWidth: 0.5,
    /**
     * [CSS Color]
     * The current node outline color, if dont't need, set to null.
     * @type {String}
     */
    outlineColor: "#027BE3",
  },
  /**
   * The scale options.
   */
  scale: {
    /**
     * Enable(disable) scale. The node range will change by mouse-wheel if enabled.
     */
    enabled: false,
    /**
     * Scale limit as percent.
     */
    limit: [0, 100],
  },
  /**
   * Progress options, if dont't need, set to null or false.
   */
  progress: {
    /**
     * Set enable(disable) progress.
     */
    enabled: true,
    /**
     * [CSS Color]
     * The progress background color.
     * @type {String}
     */
    color: "rgba(66,63,68,0.6)",
  },

  /**
   * key point label options.
   */
  label: {
    /**
     * Set enable(disable) the key node label.
     */
    enabled: true,
    /**
     * The label top position. Number or string as percent.
     * @type {Number|String}
     */
    top: "75%",
    /**
     * [Css Font].
     * The label font.
     * @type {String}
     */
    font: "14px blob arial",
    /**
     * [CSS Color]
     * The label color.
     * @type {String}
     */
    color: "#333",
  },
}

/**
 * Play options.
 */
export const play = {
  /**
   * Play interval.
   * @type {number}
   */
  interval: 1500,

  /**
   * If true, then jump index 0 when play to end.
   * @type {boolean}
   */
  loop: false,
}