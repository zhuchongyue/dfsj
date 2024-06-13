import {defineConfig} from 'vitepress'
import Unocss from "unocss/vite"
import zhConfig from './locales/zh.config'
import {componentPreview, containerPreview} from '@vitepress-demo-preview/plugin'

export default defineConfig({
    base: '/',
    host: 'localhost', // ip
    port: '8099', //端口号
    head: [['link', {rel: 'icon', href: '/dc-docs/assets/favicon.png'}]],
    locales: {
        // @ts-ignore
        root: zhConfig
    },
    outDir: './build',
    themeConfig: {
        i18nRouting: true,
        logo: '/assets/favicon.png',
        search: {
            provider: 'local'
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/by1773'},
            {
                icon: {
                    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="#c12127" d="M0 256V0h256v256z"/><path fill="#fff" d="M48 48h160v160h-32V80h-48v128H48z"/></svg>`
                }, link: 'https://www.npmjs.com/search?q=%40dfsj'
            },
        ],
        footer: {
            copyright: '版权所有 © 2022 - 2024  mr_geeker'
        }
    },
    markdown: {
        theme: {
            light: 'vitesse-light',
            dark: 'vitesse-dark'
        },
        lineNumbers: true,
        config(md) {
            md.use(componentPreview)
            md.use(containerPreview)
        }
    },
    vite: {
        plugins: [
            Unocss('./'),
        ],
    },
})
