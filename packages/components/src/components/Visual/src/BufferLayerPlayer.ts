import {Layer}       from "./types";
import LayerPlayer   from "./interface/LayerPlayer";
import LayerProvider from "./interface/LayerProvider";
import {Visual}      from "./types";
import def           from "./config/default.manager";
import LayerManager from "./interface/LayerManager";
/**
 * 带图层缓存功能的图层控制器。
 * 默认缓存图层数为7张（可修改），缓存的图层会发生图片请求（特征图层除外），但不现实（透明度为0）。
 * 播放时，对当前图层的透明度设为预设值（原透明度），其他图层的透明度都为0。
 * 特征图层的处理参见特征图层说明。
 */
export default class BufferLayerPlayer implements LayerPlayer {
  protected manager: LayerManager;
  protected provider: LayerProvider;
  protected options: any;
  protected queue: Layer[] = [];
  protected index = 0;
  protected cursor = 0;
  protected center = 0;
  protected last: Layer = null;
  constructor(manager: LayerManager, provider: LayerProvider, options?: Visual.PlayerOptions) {
    this.manager = manager;
    this.provider = provider;
    this.options = options;
    this.options = Object.assign({}, def, options);
    this.manager.remove(this.queue);
    this.queue.length = 0;
  }
  public async backward() {
    const index = this.index;
    const cursor = this.cursor;
    if (index === 0 && cursor === 0) return;
    if (index === 0 || cursor > this.center) {
      this.cursor--;
    } else {
      this.queue.splice(0, 0, await this.get(--this.index));
      await this.manager.addition(this.queue[0]);
      if (this.queue.length > this.options.buffer) {
        this.manager.remove(this.queue.pop());
      }
    }
    this.render();
  }
  public async forward() {
    const size = this.queue.length;
    const index = this.index;
    const count = this.provider.count;
    if (index + size >= count && this.cursor >= size) return;
    if (this.cursor < this.center || index + size >= count) {
      this.cursor++;
    } else {
      this.queue.push(await this.get(size + this.index++));
      await this.manager.addition(this.queue[this.queue.length - 1]);
      this.manager.remove(this.queue.shift());
    }
    this.render();
  }
  public jump(index) {
    let size = this.queue.length;
    if (size === 0) {
      this.ready(index);
    } else if (index - this.index === -1) {
      this.backward();
    }else if (index - (this.index + this.cursor) === 1) {
      this.forward();
    }else if (index - this.index === size) {
      this.forward();
    }else if (index >= this.index && index < this.index + size) {
      this.cursor = index - this.index;
      this.render();
    } else {
      this.clear();
      this.ready(index);
    }
  }

  public async visible(value: boolean) {
    if (value === false) {
      this.manager.remove(this.queue);
    }
    if (value === true) {
     await this.manager.addition(this.queue);
    }
  }

  public status(index): string {
    return this.manager.query(this.queue[index + this.cursor], "status");
  }

  public update(index) {
    this.manager.remove(this.queue);
    this.queue.length = 0;
    this.ready(index || this.index);
  }

  public clear() {
    this.manager.remove(this.queue);
    this.queue.length = 0;
  }

  public dispose() {
    this.clear();
    this.queue = null;
    this.options = null;
    this.manager = null;
    this.provider = null;
  }
  protected async get(index): Promise<Layer> {
    const layer = await this.provider?.get(index);
    const opacity = this.manager?.query(layer, "opacity");
    this.manager?.modify(layer, "$opacity", opacity);
    this.manager?.modify(layer, "opacity", 0);
    return layer;
  }

  protected async ready(index) {
    // console.log('this.provider',this.provider)
    const max = Math.min(this.provider.count, index + this.options.buffer);
    // console.log(this.provider.count,index,this.options.buffer,max,'zzp-buffer')
    for (let i = index; i < max; i++) {
      this.queue?.push(await this.get(i));
    }
    this.index = index;
    this.cursor = 0;
    this.center = this.queue?.length >> 1;
    await this.manager?.addition(this.queue);
    this.render();
  }

  protected render() {
    const queue = this.queue
    const cursor = this.cursor;
    if (this.last && this.last !== queue[cursor]) {
      this.manager.modify(this.last, "opacity", 0);
    }
    if (!queue || queue?.length <= 0) return
    if ((this.last = queue[cursor]) != null) {
      const opacity = this.manager.query(queue[cursor], "$opacity");
      this.manager.modify(queue[cursor], "opacity", opacity);
    }
  }
}
