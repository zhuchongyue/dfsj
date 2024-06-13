import NodeModel from "./NodeModel";
import NodeRender from "./NodeRender";
import {NodeAxis} from "./types";
import NodePlayer from "./interface/NodePlayer";
import assign from "./utils/assign"
import {play as def} from "./config/node-axis.options";
import {Direction, Extensible} from "./enum";
import NodeMath from "../../Visual/src/utils/NodeMath";

/**
 * 基于js定时器的节点播放实现。
 */
export default class TimerNodePlayer implements NodePlayer {
    protected renderer: NodeRender;
    protected model: NodeModel;
    protected timer: any;
    protected options: NodeAxis.PlayOptions;

    constructor(model: NodeModel, renderer: NodeRender, options?: NodeAxis.PlayOptions) {
        this.model = model;
        this.renderer = renderer;
        this.options = assign({}, def, options);
    }

    public get playing(): boolean {

        return this.timer != null;
    }


    public play(): void {
        if (this.timer == null && this.model.provider.count) {
            const interval = this.options.interval || 2000;
            const loop = this.options.loop;
            this.timer = setInterval(() => this.forward(loop), interval);
        }
    }


    public stop(): void {
        clearInterval(this.timer);
        this.timer = null;
    }

    public reset() {
        this.stop();
        this.renderer.reset();
    }

    public backward(loop: boolean): void {
        const provider = this.model.provider, count = provider.count;
        const extent = this.model.extent, index = extent[2];
        if (count > 0) {
            if (index <= 0) {
                if ((provider.extensible & Extensible.HEAD) === Extensible.HEAD) {
                    let amount = provider.extends(Direction.BACKWARD, extent[1] - extent[0]);
                    if (amount && typeof amount === "number") {
                        NodeMath.translation(this.model.nodes, amount - 1);
                        NodeMath.translation(extent, -1);
                        this.renderer.dataChange();
                        this.render(amount - 1);
                    }
                } else if (loop) {
                    this.render(count - 1);
                } else {
                    this.stop();
                }
            } else {
                // 始终保持当前帧处于滑槽中央
                let center = Math.floor(extent[0] + (extent[1] - extent[0]) / 2);
                if (index >= 0 && index <= center && extent[0] > 0) {
                    NodeMath.translation(extent, -1, 0, 2);
                    NodeMath.translation(this.model.nodes, -1);
                }
                this.render(index - 1);
            }
        }
    }

    public forward(loop: boolean): void {
        const provider = this.model.provider;
        const extent = this.model.extent, count = provider.count, index = extent[2];
        if (count > 0) {
            if (index + 1 >= count) {
                if ((provider.extensible & Extensible.TAIL) === Extensible.TAIL) {
                    let amount = provider.extends(Direction.FORWARD, extent[1] - extent[0]);
                    if (amount && typeof amount === "number") {
                        // NodeMath.translation(extent, amount, 0, 2);
                        // NodeMath.translation(this.model.nodes, amount);
                        this.render(index + 1);
                    }
                } else if (loop) {
                    this.render(count - 1);
                } else {
                    this.stop();
                }
            } else {
                // 始终保持当前帧处于滑槽中央
                let center = Math.floor(extent[0] + (extent[1] - extent[0]) / 2);
                if (index < count && index >= center && extent[1] < count) {
                    NodeMath.translation(extent, 1, 0, 2);
                    NodeMath.translation(this.model.nodes, 1);
                }
                this.render(index + 1);
            }
        }
    }

    public jump(index: number): void {
        const provider = this.model.provider,
            extent = this.model.extent,
            count = provider.count,
            range = extent[1] - extent[0];
        if (index < 0) {
            let totals = range * (Math.floor(-index / range) + 1);
            let amount = provider.extends(Direction.BACKWARD, totals);
            if (amount != null && typeof amount === "number") {
                index = Math.max(amount - -index, 0);
                NodeMath.translation(this.model.nodes, amount);
                this.renderer.dataChange();
            }
        } else if (index >= count) {
            let totals = range * (Math.floor((index - count) / range) + 1);
            let amount = provider.extends(Direction.FORWARD, totals);
            if (amount != null && typeof amount === "number") {
                index = Math.min(index, count + amount - 1);
            }
        }

        let diff = index - extent[2], dir = diff < 0 ? -1 : diff > 0 ? 1 : 0;
        let step = diff < 0 ? Math.min(-diff, extent[0]) : Math.min(diff, provider.count - extent[1]);
        if (step > 0) {
            NodeMath.translation(extent, step * dir);
            NodeMath.translation(this.model.nodes, step * dir);
        }
        this.render(index);
    }

    protected render(index?: number): void {
        this.renderer.render(index);
    }
}