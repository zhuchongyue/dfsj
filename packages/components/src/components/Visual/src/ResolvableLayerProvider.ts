import clamp from "lodash-es/clamp";
import NodeMath from "./utils/NodeMath";
import {Extensible} from "../../NodeAxis/src/enum";
import AbstractNodeProvider from "../../NodeAxis/src/AbstractNodeProvider";
import {NodeAxis} from "../../NodeAxis/src/types";
import {Layer} from "./types";
import LayerFactory from "./interface/LayerFactory";
import LayerResolver from "./interface/LayerResolver";
import {Visual} from "./types";
// import LayerProvider          from "./LayerProvider";
import mapping from "./mapping";
import def from "./config/default.provider";

const EMPTY_ARRAY = [];
/**
 * 此类拥有多个具体的解析器，每个解析器负责解析一种类型参数。同时，此类不负责解析参赛，而是交由具体的解析器负责。
 * @see Resolver
 */
export default class ResolvableLayerProvider extends AbstractNodeProvider {
    protected factory: LayerFactory;
    protected interceptor: Function;
    protected config;
    protected cache: any[] = [-1, null];
    protected total = 0;
    protected marks: NodeAxis.Section[] = [];
    protected init: NodeAxis.Extent;
    protected back: NodeAxis.Extent;
    protected options = null;
    protected extended = 0;
    protected nodes: LayerResolver[] = [];

    constructor(factory: LayerFactory, data: any, injection: any, interceptor?: Function, config?: any) {
        super();
        this.factory = factory;
        this.interceptor = interceptor;
        this.config = Object.assign({}, def, config);
        this.read(data, injection);
    }

    /**
     * 解析所提供的参赛，并将解析的结果添加到集合中。
     * @param options {Object} 被解析的参数
     * @param injection {Object?} 全局注入对象。
     */
    protected read(options, injection) {
        this.options = options;
        let resolvers: LayerResolver[] = options.nodes.map(e => new mapping[e.type](e, injection));
        let count = resolvers.reduce((p, v) => p + v.count, 0);
        let range = options.range;
        let index = clamp(options.index, 0, count - 1) || 0;
        if (range == null) {
            let nodeCount = options.availableNodeCount || this.config.availableNodeCount;
            let padding = Array.isArray(nodeCount) ? nodeCount : null;
            if (padding == null) {
                let half = Math.floor(nodeCount / 2);
                padding = [nodeCount % 2 === 0 ? half - 1 : half, half];
            }
            if (index - padding[0] < 0) {
                padding[1] = padding[1] + (padding[0] - index);
                padding[0] = index;
            } else if (index + padding[1] >= count) {
                padding[0] = padding[0] + (index + padding[1] - count) + 1;
                padding[1] = count - index;
            }
            range = [Math.max(0, index - padding[0]), Math.min(count, index + padding[1] + 1)];
        }
        const extensible = options.extensible;
        if (typeof extensible === "string") {
            this.extended = (extensible.includes("L") ? Extensible.HEAD : 0) | (extensible.includes("R") ? Extensible.TAIL : 0);
        } else if (typeof extensible === "number") {
            this.extended = extensible;
        } else {
            this.extended = Extensible.NONE;
        }
        this.total = count;
        this.nodes = resolvers;
        this.init = Object.seal([range[0], range[1], index]);
        this.back = <NodeAxis.Extent>this.init.slice();
        this.makeSections();
    }

    protected findNode(index, accept = this.cache): any [] {
        for (let i = 0, start = 0, ii = this.nodes.length; i < ii; i++) {
            let node = this.nodes[i];
            if (index >= start && index < start + node.count) {
                accept[0] = start;
                accept[1] = node;
                return accept;
            }
            start += node.count;
        }
        return EMPTY_ARRAY;
    }

    protected makeSections() {
        this.marks.length = 0;
        for (let i = 0, start = 0, ii = this.nodes.length; i < ii; i++) {
            const node = this.nodes[i];
            start += node.count;
            if (node.period) {
                this.marks.push({
                    range: [start - node.count, start],
                    color: this.config.sectionColor[node.period],
                })
            }
        }
    }

    /**
     * 根据index获取图层。
     * @param index {Number} 索引值
     * @return {Object} 图层选项对象
     */
    public get(index: number): Promise<Layer> {
        let [start, node] = this.findNode(index);
        if (node != null) {
            let config = node.get(index - start);
            // console.log('config0000', config)
            if (this.interceptor) {
                config = this.interceptor(config);
            }
            // console.log('config node',node , config)
            return this.factory.create(config);
        }
    }

    public getNodeInfo(index: number): Visual.NodeInfo {
        let [start, node] = this.findNode(index);
        if (node != null) {
            return node.getNodeInfo(index - start);
        }
    }

    public get extent(): NodeAxis.Extent {
        return this.init;
    }

    public get count(): number {
        return this.total;
    }

    public get sections(): NodeAxis.Section[] {
        return this.marks;
    }

    public get extensible(): number {
        return this.extended;
    }


    public color(index: number): string {
        return null;
    }

    public format(index: number, type: NodeAxis.Format): string {
        let [start, node] = this.findNode(index);
        if (node != null) {
            return node.format(index - start, type);
        }
    }

    public formatByInject(index: number, type: NodeAxis.Format, finalFormat: string): string {
        let [start, node] = this.findNode(index);
        if (node != null) {
            return node.formatByInject(index - start, type, finalFormat);
        }
    }


    public find(query: Visual.Condition): number {
        let index = null, head = this.nodes[0];
        if ((index = head.find(query)) != null) {
            return index;
        }
        let size = this.nodes.length;
        let tail = this.nodes[size - 1];
        if ((index = tail.find(query)) != null) {
            return this.total + index;
        }

        for (let i = 1, s = head.count, ii = size - 1; i < ii; i++) {
            let node = this.nodes[i];
            if ((index = node.find(query)) != null) {
                if (index > node.count) {
                    break;
                }
                return s + index;
            }
            s += node.count;
        }
        return null;
    }

    public extends(direction: number, minimum: number): Promise<number> | number {
        let oldCount = this.total, extended = 0;
        let amount = Math.max(minimum, this.extent[1] - this.extent[0]);
        if (amount !== 0) {
            let node = this.nodes[direction < 0 ? 0 : this.nodes.length - 1];
            let side = direction < 0 ? Extensible.HEAD : Extensible.TAIL;
            let extensible = !!(this.extensible & side) && node.isAutoExtensible;
            if (extensible) {
                extended = node.extends(direction, amount);
                this.total += Math.abs(extended);
            }
        }
        if (direction < 0 && this.count !== oldCount) {
            NodeMath.translation(this.init, extended);
            NodeMath.translation(this.back, extended);
        }
        this.makeSections();
        return extended;
    }

    public reset() {
        this.init = <NodeAxis.Extent>this.back.slice();
    }


    public dispose() {
        this.total = 0;
        this.nodes = null;
        this.marks = null;
        this.cache = null;
        this.config = null;
        this.options = null;
        this.factory = null;
    }
}
