import NodeMath from "../../Visual/src/utils/NodeMath";
import NodeRender from "./NodeRender";
//@ts-ignore
import * as zrender from 'zrender/dist/zrender';
export default class CanvasNodeRender extends NodeRender {
    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D;
    protected overlay: HTMLElement;
    protected cache: any = {};
    protected zrender: any;

    protected onMouseMove(event: any) {
        event?.event?.preventDefault();
        event?.event?.stopImmediatePropagation();
        const provider = this.model.provider;
        const bounds = this.model.bounds;
        const extent = this.model.extent;
        const offset = event.offsetX - bounds.left;
        const number = NodeMath.index(offset, extent, bounds.length);
        const index = NodeMath.clamp(number, extent[0], extent[1] - 1);
        const model = this.model, o = model.options;
        /**
         * Show overly on mouse pointed if enabled at 'options.overlay.enabled'.
         *
         * If mouse on current node, always show current node overlay. Otherwise show node overlay at pointed.
         */
        if (o.overlay.enabled) {
            // Adjust the overlay position.
            this.overlay.hidden = false;
            let rect = this.overlay.getBoundingClientRect();
            let left = (event.offsetX + 10);
            if (event.offsetX + rect.width > this.container.offsetWidth) {
                left -= rect.width + 5;
            }
            let top = (event.offsetY + 15);
            if (event.y + rect.height > window.innerHeight) {
                top -= rect.height + 5;
            }
            // this.overlay.style.left = left + "px";
            // this.overlay.style.top = top + "px";

            this.overlay.style.transform = `translate3d(${left}px, ${top}px, 0px)`;
            // Re-compute the index at mouse pointed.
            let cursor = model.dragging ? extent[2] : model.pressed ? model.index : index;
            if (model.pressed === false) {
                let ss = model.options.cursor.size / 2;
                let x1 = NodeMath.offset(extent[2], extent, bounds.length) + bounds.left;
                let y1 = bounds.top;
                let x2 = event.offsetX, y2 = event.offsetY;
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
        event?.event?.preventDefault();
        event?.event?.stopImmediatePropagation();
        // this.overlay.hidden = true;
        this.overlay.style.opacity = String(0);
        this.model.dragging = false;
        this.model.pressed = false;
        this.model.right = false;
    }

    protected onMouseDown(event) {
        const provider = this.model.provider;
        const b = this.model.bounds,
            x = event.offsetX,
            y = event.offsetY,
            e = this.model.extent,
            o = this.model.options;
        if (o.draggable && provider.count) {
            const ss = this.model.options.cursor.size / 2;
            const x1 = NodeMath.offset(e[2], this.model.range, b.length) + b.left;
            const y1 = b.top;
            const radius = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
            this.model.dragging = radius <= ss;
        }
        this.model.pressed = true;
        this.model.press[0] = x;
        this.model.press[1] = y;
        this.model.right = event.button === 2;
        this.model.index = NodeMath.index(x - b.left, e, b.length);
        // if (event.button === 0) {
        this.render(NodeMath.clamp(this.model.index, e[0], e[1] - 1));
        // }
    }


    protected showOverlay(index: number): any {
        this.overlay.style.opacity = String(1);
        let provider = this.model.provider;
        if (provider.count) {
            let value = this.cache[index];
            if (value == null) {
                value = this.cache[index] = provider.format(index, "long");
            }
            console.log('value', value)
            return this.overlay.innerText = value;
        }
        console.log('this.model.options.overlay?.empty ', this.model.options.overlay?.empty)
        this.overlay.innerHTML = this.model.options.overlay?.empty || "Node is unavailable!";
    }

    //获取

    public getBoundingClientRect() {
        let options = this.model.options;
        // console.log('options', options)
        // console.log('...this.container', this.container.offsetWidth)
        let bound = this.container.getBoundingClientRect();
        let width: number = NodeMath.valueBy(
                options.width || bound.width,
                this.container.offsetWidth || window.innerWidth
            ),
            height: number = NodeMath.valueBy(
                options.height || bound.height,
                this.container.offsetHeight || window.innerHeight
            ),
            left: number = NodeMath.valueBy(options.track.left, width),
            top: number = NodeMath.valueBy(options.track.top, height),
            right: number = NodeMath.valueBy(options.track.right, width),
            label: number = NodeMath.valueBy(this.model.options.label?.top, height);
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
            label =
                Math.max(
                    options.cursor.size,
                    options.node?.size,
                    options.track.height
                ) /
                2 +
                10;
        }
        let length = width - (left + right);

        return {
            length,
            width,
            height,
            label,
            left,
            right,
            top,
            bound
        }

    }


    public initialize(container: HTMLElement, accept: Function) {
        if (this.initialized === false) {
            super.initialize(container, accept);
            //todo
            const {width, height} = this.getBoundingClientRect()
            const sizes = this.getBoundingClientRect();
            console.log('计算得到的尺寸', sizes)
            this.zrender = zrender.init(this.container, {
                renderer: 'canvas',
                // renderer: 'vml',
                devicePixelRatio: 2,
                width: width,
                height: height,
                pointerSize:50
            });
            this.overlay = document.createElement("div");
            this.overlay.className = "node-axis--overlay";
            // this.overlay.hidden = true;
            container.appendChild(this.overlay);
            this.resize();
            this.initialized = true;
        }
    }

    public resize(): void {
        const {width, height, right, left, top, label, length} = this.getBoundingClientRect();
        this.model.width = width;
        this.model.height = height;
        this.model.bounds = {left, top, right, length, label};
        this.zrender && this.zrender.resize({width, height})
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
        this.zrender?.dispose()
        this.zrender = null;
        this.container?.remove?.()
    }


    public render(index?: number): void {
        const provider = this.model.provider,
            range = this.model.extent,
            g = this.context,
            b = this.model.bounds,
            o = this.model.options,
            h = o.track.height,
            c = provider?.count || 0,
            d = range[1] - range[0];

        if (index == null) index = range[2];

        const indexColor = provider.color(index);
        this.model.range = NodeMath.clampArray(range, [0, c]);
        //NOTE 清空
        if (this.zrender) this.zrender?.clear();
        // draw track
        const lineTrack = new zrender.Polyline({
            shape: {
                points: [
                    [b?.left, b?.top],
                    [b?.left + b?.length, b?.top],
                ],
            },
            style: {
                stroke: o.track.color,
                lineWidth: h,
            },
        });
        this.zrender && this.zrender?.add?.(lineTrack);
        // draw sections
        let sections = provider.sections;
        if (sections && sections.length) {
            sections.forEach(section => {
                if (NodeMath.inRange(range, section.range)) {
                    let x1 = NodeMath.clamp(NodeMath.offset(section.range[0] - 1, range, b.length), 0, b.length);
                    let x2 = NodeMath.clamp(NodeMath.offset(section.range[1] - 1, range, b.length), 0, b.length);
                    const lineSections = new zrender.Polyline({
                        shape: {
                            points: [
                                [b.left + x1, b.top],
                                [b.left + x2, b.top],
                            ],
                        },
                        style: {
                            stroke: section.color,
                            lineWidth: h,
                        },
                        cursor: 'default',
                    });
                    this.zrender?.add(lineSections);
                }
            });
        }
        // draw progress if enabled
        if (c && d > 1 && o.progress && o.progress.enabled) {
            let x = NodeMath.clamp(NodeMath.offset(index, range, b.length), 0, b.length);
            const lineProgress = new zrender.Polyline({
                shape: {
                    points: [
                        [b?.left, b?.top],
                        [b?.left + x, b?.top],
                    ],
                },
                style: {
                    stroke: o.progress.color,
                    lineWidth: h,
                },
                cursor: 'default',
            });
            this.zrender?.add(lineProgress);
        }

        // draw mark nodes
        if (this.model.nodes) {
            const labeled = o.label && o.label.enabled;
            this.model.nodes.forEach((e, i) => {
                let x = b.left + NodeMath.offset(e, range, b.length);
                const circle = new zrender.Circle({
                    shape: {
                        cx: x,
                        cy: b?.top,
                        r: o.node.size / 2,
                    },
                    style: {
                        fill: '#fff',
                        stroke: o.node.outlineColor,
                        lineWidth: o.node.outlineWidth,
                    },
                });
                this.zrender?.add(circle);
                circle.onmouseover = (ev) => {
                    const offsetX = {ev};
                    // console.log('onmouseover', ev)
                    this.onMouseMove(ev as any);
                };
                circle.onmouseout = (ev) => {
                    this.onMouseLeave(ev as any);
                };
                circle.onclick = (ev) => {
                    console.log('onclick', ev);
                    this.onMouseDown(ev as any);
                };
                circle.oncontextmenu = (ev) => {
                    console.log('oncontextmenu', ev);
                    // @ts-ignore
                    ev?.event.preventDefault();
                    // @ts-ignore
                    ev?.event.stopImmediatePropagation();
                };
                if (labeled) {
                    const t1 = new zrender.Text({
                        style: {
                            text: provider.format(e, 'short'),
                            align:
                                i === 0 && d > 1
                                    ? 'left'
                                    : e === range[1] - 1 && d > 1
                                        ? 'right'
                                        : 'center',
                            // textAlign: 'center',
                            // @ts-ignore
                            textVerticalAlign: 'middle',
                            // fontSize: 200,
                            fontFamily: 'Lato',
                            fontWeight: 'bolder',
                            textFill: '#0ff',
                            blend: 'lighten',
                        },
                        position: [x, b.label],
                    });
                    this.zrender?.add(t1);
                }
            });
        }

        // draw current node
        if (c && range[0] <= index && index < range[1]) {
            let x = b.left + NodeMath.offset(index, range, b.length);
            const circle = new zrender.Circle({
                shape: {
                    cx: x,
                    cy: b.top,
                    r: o.cursor.size / 2,
                },
                style: {
                    fill: indexColor || o.cursor.color,
                    stroke: o.cursor.outlineColor,
                    lineWidth: o.cursor.outlineWidth,
                },
            });
            circle.onmouseover = (ev) => {
                this.onMouseMove(ev as any);
            };
            circle.onmouseout = (ev) => {
                 this.onMouseLeave(ev as any);
            };
            circle.onclick = (ev) => {
                this.onMouseDown(ev as any);
            };
            circle.oncontextmenu = (ev) => {
                // @ts-ignore
                ev?.event.preventDefault();
                // @ts-ignore
                ev?.event.stopImmediatePropagation();
            };
            this.zrender?.add(circle);
        }

        this.model.extent[2] = index;
        this.accept.call(this, index);
    }
}