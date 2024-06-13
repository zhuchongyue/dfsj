# bem类名规范
:::tip
Bem 是块（block）、元素（element）、修饰符（modifier）的简写，由 Yandex 团队提出的一种前端 CSS 命名方法论。
- 中划线 ：仅作为连字符使用，表示某个块或者某个子元素的多单词之间的连接记号。 
- __ 双下划线：双下划线用来连接块和块的子元素 
- --双中划线：双中划线用来描述一个块或者块的子元素的一种状态
:::
## usage
```ts 
const [b] = createBEM('button');
b() // 'button'
b('text') // 'button__text'
b({ disabled }) // 'button button--disabled'
b('text', { disabled }) // 'button__text button__text--disabled'
b(['disabled', 'primary']) // 'button button--disabled button--primary'
```