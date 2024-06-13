import {
    defineAsyncComponent,
    FunctionalComponent, CSSProperties
} from 'vue';

export const noop = () => {
};
const Loading: FunctionalComponent<{ size: 'small' | 'default' | 'large' }> = (props) => {
    const style: CSSProperties = {
        // position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        height:'300px',
        fontWeight: "bolder",
    };
    return (
            <div style={style}>
                <div v-loading="true">组件加载中...</div>
                {/*<el-skeleton rows="5" />*/}
            </div>
    );
};

interface Options {
    size?: 'default' | 'small' | 'large';
    delay?: number;
    timeout?: number;
    loading?: boolean;
    retry?: boolean;
}

export function createAsyncComponent(loader: Fn, options: Options = {}) {
    const {size = 'small', delay = 20, timeout = 10000, loading = true, retry = true} = options;
    return defineAsyncComponent({
        loader,
        loadingComponent: loading ? <Loading spinning={true} size={size}/> : undefined,
        timeout,
        errorComponent: <div>加载失败！请重试~</div>,
        delay,
        onError: !retry
                ? noop
                : (error, retry, fail, attempts) => {
                    if (error.message.match(/fetch/) && attempts <= 3) {
                        retry();
                    } else {
                        fail();
                    }
                },
    });
}
