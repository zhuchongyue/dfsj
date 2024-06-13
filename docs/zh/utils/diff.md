# 数组差值

## diff 

> 对两组数据进行比较运算，挑选出删除的元素、新增的元素和相同的元素（默认不启用）。
> - `默认对比函数:` const defaultComparator = (older: any, newer: any) => older === newer

### params 
- `{any[]} older`：旧数组
- `{any[]} newer`：新数组
- `{any[]} comparator`：对比函数
- `{any[]} absent`：新增元素
- `{any[]} additional`：删除元素 
- `{any[]} identical`：重复元素 

### returns 
- `{any[]} absent`：新增元素
- `{any[]} additional`：删除元素
- `{any[]} identical`：重复元素 

 