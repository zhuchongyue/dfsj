/** 关闭*/
//移动范围的dom区域

const moverClass = `modal-dom-el`;

const switcher = {
  true: {
    image: 'mdi:window-restore',
    color: 'transparent',
  },
  false: {
    image: 'mdi:window-maximize',
    color: 'transparent',
  },
};

const closer = {
  image: 'mdi:close',
  color: 'transparent',
};
const cancel = {
  label: '取消',
  color: 'warning',
};
const submit = {
  label: '提交',
  color: 'warning',
};

export { switcher, closer, cancel, submit, moverClass };
