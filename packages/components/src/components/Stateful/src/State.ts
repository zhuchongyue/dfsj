/**
 * 呈现器状态，呈现器可以有多个状态，多个状态直接使用or合并。
 * eg:
 * ```
 * state = State.COMPLETED | State.ERRORED;
 * ```
 * 表示呈现器加载数据完成，但是却发生了错误！
 */
import {Ref, ref, toRaw} from 'vue';

export enum StateEnum {
  NONE = 0, // 初始状态
  ERRORED = 1, // 发送错误的状态
  LOADING = 2, // 加载数据的状态
  EMPTY = 4, // 数据为空的状态
  FULL = 8, // 有数据状态
  COMPLETED = 16, // 加载完成状态
}

export default class State {
  #state: Ref<number> = ref();

  public constructor(init: number = StateEnum.NONE) {
    this.#state.value = init;
  }

  public loading() {
    this.#state.value = StateEnum.LOADING;
  }

  public error() {
    this.#state.value = StateEnum.ERRORED;
  }

  public merge(state: number) {
    this.#state.value |= state;
  }

  public remove(state: number) {
    this.#state.value &= ~(this.#state.value & state);
  }

  public completed(isEmpty) {
    this.#state.value &= ~(this.#state.value & StateEnum.LOADING); // Remove loading state
    this.#state.value |= StateEnum.COMPLETED; // Add complete state
    this.#state.value |= isEmpty ? StateEnum.EMPTY : StateEnum.FULL; // Add full or empty state
  }

  public get isLoading(): boolean {
    return (this.#state.value & StateEnum.LOADING) === StateEnum.LOADING;
  }
  public get state(): boolean {
    return !!this.#state;
  }
  public get stringify(): string | undefined {
    if (toRaw(this).isLoading) {
      return 'loading';
    }
    if (this.#state.value & StateEnum.ERRORED) {
      return 'error';
    }
    if (this.#state.value & StateEnum.EMPTY) {
      return 'empty';
    }
  }
}
