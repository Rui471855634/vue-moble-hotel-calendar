vue-mobile-hotel-calendar
==========

基于vue2.x的移动端日历组件，适用于酒店预订的应用场景

## 安装
```
$ npm install vue-mobile-hotel-calendar -S
```

## 使用

### html
```
<calendarv-if="calendarVisible" ref="calendar"></calendar>
```
### js
```
import Calendar from 'vue-mobile-hotel-calendar'
```

## 触发
```
this.calendarVisible = true
this.$nextTick(() => {
  this.$refs.calendar.editDate()
})
```

## 属性
属性名 | 说明 | 类型 | 可选值 | 默认值   
:-: | :-: | :-: | :-: | :-:
total | 被渲染出的月数，从当前月份开始 | Number | - | 5
startText | 开始日期的描述 | String | - | 入住
endText | 结束日期的描述 | String | - | 退房

## 事件
事件名 | 说明 |  参数  
:-: | :-: | :-:
change | 触发日期选中的回调 | (startDate, endDate, dayGap) |
setStartDate | 选中开始日期的回调 | (startDate)
setEndDate | 选中结束日期的回调 | (endDate)

## 设计缺陷
> 未通过js动态计算日期，没有实现万年历的效果。只是针对于`酒店预订类`的业务，从当月开始，+n个月的日历渲染。

## Git
[vue-mobile-hotel-calendar](https://github.com/AlanOzil/vue-moble-hotel-calendar)
