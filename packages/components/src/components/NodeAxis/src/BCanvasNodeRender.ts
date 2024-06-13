import NodeMath   from "../../Visual/src/utils/NodeMath";
import NodeRender from "./NodeRender";


export default class BCanvasNodeRender extends NodeRender {
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected overlay: HTMLElement;
  protected cache: any = {};


  protected onMouseWheel(event: WheelEvent) {
    event.stopImmediatePropagation();
    let o = this.model.options, provider = this.model.provider;
    if (o.scale?.enabled && provider.count) {
      const bounds   = this.model.bounds;
      const offset   = event.offsetX - bounds.left, model = this.model;
      const scale    = NodeMath.clampArray(provider.scale(offset, model.scale, bounds.length, event.deltaY), model.limit);
      const range    = NodeMath.toRange(scale, provider.count);
      const minCount = o.node?.minCount;
      if (event.deltaY < 0 && range[1] - range[0] < minCount) return;
      if (o.node?.enabled) {
        model.nodes = provider.extract(range, o.node?.count);
      }
      this.model.scale     = scale;
      this.model.extent[0] = range[0];
      this.model.extent[1] = range[1];
      this.render();
      this.onMouseMove(event);
    }
  }

  protected onMouseMove(event: MouseEvent) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const provider = this.model.provider;
    const bounds   = this.model.bounds;
    const extent   = this.model.extent;
    const offset   = event.offsetX - bounds.left;
    const number   = NodeMath.index(offset, extent, bounds.length);
    const index    = NodeMath.clamp(number, extent[0], extent[1] - 1);
    const model    = this.model, o = model.options;
    /**
     * Show overly on mouse pointed if enabled at 'options.overlay.enabled'.
     *
     * If mouse on current node, always show current node overlay. Otherwise show node overlay at pointed.
     */
    if (o.overlay.enabled) {
      // Adjust the overlay position.
      this.overlay.hidden = false;
      let rect            = this.overlay.getBoundingClientRect();
      let left            = (event.offsetX + 5);
      if (event.offsetX + rect.width > this.container.offsetWidth) {
        left -= rect.width + 5;
      }
      let top = (event.offsetY + 5);
      if (event.y + rect.height > window.innerHeight) {
        top -= rect.height + 5;
      }
      this.overlay.style.left = left + "px";
      this.overlay.style.top  = top + "px";

      // Re-compute the index at mouse pointed.
      let cursor = model.dragging ? extent[2] : model.pressed ? model.index : index;
      if (model.pressed === false) {
        let ss     = model.options.cursor.size / 2;
        let x1     = NodeMath.offset(extent[2], extent, bounds.length) + bounds.left;
        let y1     = bounds.top;
        let x2     = event.offsetX, y2 = event.offsetY;
        let radius = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        if (radius <= ss) cursor = extent[2];
      }
      this.showOverlay(cursor);
    }
    /**
     * Apply drag when drag on current node if enable at 'options.draggable'.
     *
     * When dragging, an event 'slide' will be fire.
     */
    if (model.dragging && model.pressed) {
      if (index !== extent[2]) {
        this.render(index);
      }
    }
    /**
     * Apply translation if enabled at 'options.translation'.
     * If range[0]=0 or range[1]=count, then try to extends the provider when provider is extensible.
     */
    else if (model.pressed && model.right && o.translation) {
      let move = index - model.index, count = provider.count;
      if (move < 0 && extent[1] < count) {
        NodeMath.translation(extent, +1, 0, 2);
        NodeMath.translation(model.nodes, +1);
      } else if (move > 0 && extent[0] > 0) {
        NodeMath.translation(extent, -1, 0, 2);
        NodeMath.translation(model.nodes, -1);
      }
      this.render();
    }
  }

  protected onMouseLeave(event) {
    event.stopImmediatePropagation();
    this.overlay.hidden = true;
    this.model.dragging = false;
    this.model.pressed  = false;
    this.model.right    = false;
  }

  protected onMouseDown(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const provider = this.model.provider;
    const b        = this.model.bounds,
          x        = event.offsetX,
          y        = event.offsetY,
          e        = this.model.extent,
          o        = this.model.options;
    if (o.draggable && provider.count) {
      const ss            = this.model.options.cursor.size / 2;
      const x1            = NodeMath.offset(e[2], this.model.range, b.length) + b.left;
      const y1            = b.top;
      const radius        = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
      this.model.dragging = radius <= ss;
    }
    this.model.pressed  = true;
    this.model.press[0] = x;
    this.model.press[1] = y;
    this.model.right    = event.button === 2;
    this.model.index    = NodeMath.index(x - b.left, e, b.length);
    if (event.button === 0) {
      this.render(NodeMath.clamp(this.model.index, e[0], e[1] - 1));
    }
  }

  protected onMouseUp(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    // ensure mouse-up with mouse-down is same position.
    // if (this.model.pressed && this.provider.count) {
    //   let bounds = this.model.bounds;
    //   let extent = this.model.extent;
    //   let offset = this.model.pressed[0] - this.model.bounds.left;
    //   let index = NodeMath.clamp(NodeMath.index(offset, extent, bounds.length), extent[0], extent[1] - 1);
    //   this.render(index);
    // }
    this.model.pressed = false;
    this.model.right   = false;
  }

  protected showOverlay(index: number): any {
    let provider = this.model.provider;
    if (provider.count) {
      let value = this.cache[index];
      if (value == null) {
        value = this.cache[index] = provider.format(index, "long");
      }
      console.log('value',value)
      return this.overlay.innerText = value;
    }
    console.log('this.model.options.overlay?.empty ',this.model.options.overlay?.empty )
    this.overlay.innerHTML = this.model.options.overlay?.empty || "Node is unavailable!";
  }

  public initialize(container: HTMLElement, accept: Function) {
    if (this.initialized === false) {
      super.initialize(container, accept);
      this.canvas = document.createElement("canvas");
      // @ts-ignore
      this.canvas.addEventListener("mousewheel", this.onMouseWheel.bind(this));
      this.canvas.addEventListener("mouseleave", this.onMouseLeave.bind(this));
      this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
      this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
      this.canvas.classList.add("node-axis--canvas");
      this.canvas.oncontextmenu = event => event.preventDefault();

      this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
      container.appendChild(this.canvas);

      this.overlay           = document.createElement("div");
      this.overlay.className = "node-axis--overlay";
      this.overlay.hidden    = true;
      container.appendChild(this.overlay);
      this.resize();
      this.initialized = true;
    }
  }

  public resize(): void {
    let options        = this.model.options;
    let bound          = this.container.getBoundingClientRect();
    let width: number  = NodeMath.valueBy(options.width || bound.width, window.innerWidth),
        height: number = NodeMath.valueBy(options.height || bound.height, window.innerWidth),
        left: number   = NodeMath.valueBy(options.track.left, width),
        top: number    = NodeMath.valueBy(options.track.top, height),
        right: number  = NodeMath.valueBy(options.track.right, width),
        label: number  = NodeMath.valueBy(this.model.options.label?.top, height);
    if (left == null) {
      left = Math.max(options.cursor.size, options.node.size || 0) / 2;
    }
    if (top == null) {
      top = height / (options.label?.enabled ? 3 : 2);
    }
    if (right == null) {
      right = left;
    }
    if (label == null) {
      label = Math.max(options.cursor.size, options.node?.size, options.track.height) / 2 + 10;
    }
    let length                   = width - (left + right);
    this.model.width             = width;
    this.model.height            = height;
    this.model.bounds            = {left, top, right, length, label};
    this.canvas.width            = width;
    this.canvas.height           = height;
    this.canvas.style.width      = `${width}px`;
    this.canvas.style.background = options.background;
  }

  public reset() {
    this.model.reset();
    this.render();
  }

  public dataChange() {
    Object.keys(this.cache).forEach(key => delete this.cache[key]);
  }

  public dispose(): void {
    this.dataChange();
  }


  public render(index?: number): void {
    const provider = this.model.provider,
          range    = this.model.extent,
          g        = this.context,
          b        = this.model.bounds,
          o        = this.model.options,
          h        = o.track.height,
          c        = provider?.count || 0,
          d        = range[1] - range[0];

    if (index == null) index = range[2];

    const indexColor = provider.color(index);
    this.model.range = NodeMath.clampArray(range, [0, c]);

    g.clearRect(0, 0, this.model.width, this.model.height);

    // draw track
    g.beginPath();
    g.moveTo(b.left, b.top);
    g.lineTo(b.left + b.length, b.top);
    g.lineCap     = "round";
    g.lineWidth   = h;
    g.strokeStyle = o.track.color;
    g.stroke();

    // draw sections
    let sections = provider.sections;
    if (sections && sections.length) {
      sections.forEach(section => {
        if (NodeMath.inRange(range, section.range)) {
          let x1 = NodeMath.clamp(NodeMath.offset(section.range[0] - 1, range, b.length), 0, b.length);
          let x2 = NodeMath.clamp(NodeMath.offset(section.range[1] - 1, range, b.length), 0, b.length);
          g.beginPath();
          g.moveTo(b.left + x1, b.top);
          g.lineTo(b.left + x2, b.top);
          g.lineCap     = "round";
          g.lineWidth   = h;
          g.strokeStyle = section.color;
          g.stroke();
        }
      });
    }

    // draw progress if enabled
    if (c && d > 1 && o.progress && o.progress.enabled) {
      let x = NodeMath.clamp(NodeMath.offset(index, range, b.length), 0, b.length);
      g.beginPath();
      g.moveTo(b.left, b.top);
      g.lineTo(b.left + x, b.top);
      g.lineCap     = "round";
      g.lineWidth   = h;
      g.strokeStyle = o.progress.color;
      g.stroke();
    }

    // draw mark nodes
    if (this.model.nodes) {
      const labeled = o.label && o.label.enabled;
      this.model.nodes.forEach((e, i) => {
        let x = b.left + NodeMath.offset(e, range, b.length);
        g.beginPath();
        g.fillStyle = (e === index ? indexColor : provider.color(e)) || o.node.color;
        g.arc(x, b.top, o.node.size / 2, 0, 2 * Math.PI);
        g.fill();
        if (o.node.outlineWidth) {
          g.lineWidth   = o.node.outlineWidth;
          g.strokeStyle = o.node.outlineColor;
          g.stroke();
        }
        if (labeled) {
          g.font         = o.label.font;
          g.textAlign    = (i === 0 && d > 1) ? "left" : (e === range[1] - 1 && d > 1) ? "right" : "center";
          g.textBaseline = "top";
          g.fillStyle    = o.label.color;
          g.fillText(provider.format(e, "short"), x, b.label);
        }
      });
    }

    // draw current node
    if (c && range[0] <= index && index < range[1]) {
      let x = b.left + NodeMath.offset(index, range, b.length);
      g.beginPath();
      g.fillStyle = indexColor || o.cursor.color;
      g.arc(x, b.top, o.cursor.size / 2, 0, 2 * Math.PI);
      g.fill();
      if (o.cursor.outlineWidth) {
        g.lineWidth   = o.cursor.outlineWidth;
        g.strokeStyle = o.cursor.outlineColor;
        g.stroke();
      }
    }

    this.model.extent[2] = index;
    this.accept.call(this, index);
  }
}