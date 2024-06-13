/**
 * The default options user for {@link LayerProvider}.
 */
export default {
  /**
   * The color for track section.
   */
  sectionColor: {
    history: "rgba(51,51,51,0.45)",
    short: "rgba(51,183,255,0.45)",
    long: "rgba(235,255,121,0.45)",
    tend: "rgba(255,99,13,0.45)",
    forecast: "rgba(255,99,13,0.45)",
  },

  /**
   * The color for layer status.
   */
  statusColor: {
    ready: null,
    loading: "#d076ff",
    success: "#07ff23",
    error: "#ff0059",
  },

  /**
   * The available node count at node axis.
   * @type {Number|Number[]}
   */
  availableNodeCount: [2, 3],
}
