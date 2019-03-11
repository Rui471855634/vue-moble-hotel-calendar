<template lang="html">
  <div class="calendar">
    <!-- <div class="cal-trigger" @click="editDate">
      <div class="cal-result">
        <div class="start-date">
          <span class="date-time">{{getSelectedDate(startDate)}}</span>
          <span class="date-days">今天</span>
        </div>
        <div class="blank">
          —
        </div>
        <div class="end-date">
          <span class="date-time">{{getSelectedDate(endDate)}}</span>
          <span class="date-days">明天</span>
        </div>
      </div>
      <div class="cal-total" v-if="dayGap">
        共{{dayGap}}晚
      </div>
    </div> -->
    <div class="cal-container" :style="wrapperStyle">
      <transition name="slide">
        <div class="cal-wrapper" v-if="show" :style="wrapperStyle">
          <div class="cal-mask" @click="hideDate"></div>
          <div class="cal-main" :style="mainStyle">
            <div class="cm-header" @click="hideDate">
              选择日期
              <div class="close-icon"><span class="iconfont">&#xe60f;</span></div>
            </div>
            <div class="cm-days">
              <div class="cm-days-item holiday">日</div>
              <div class="cm-days-item">一</div>
              <div class="cm-days-item">二</div>
              <div class="cm-days-item">三</div>
              <div class="cm-days-item">四</div>
              <div class="cm-days-item">五</div>
              <div class="cm-days-item holiday">六</div>
            </div>
            <div class="cm-fix">
              {{fixMonth}}
            </div>
            <div class="cm-main">
              <div class="cm-month" v-for="(month, index) in calList" :key="index">
                <div class="cmm-header" v-text="getDateFormat(month.month)"></div>
                <div class="cmm-main">
                  <div class="day-item" :class="{'order': day.status, 'contain': day.contain}" v-for="(day, index) in month.days" :key="index" @click="selectDate(month, day)">
                    <!-- <div class="info price" v-if="day.num && day.type !== 'past'">￥{{day.price}}</div>
                    <div class="info price" v-else></div> -->
                    <div class="info num" :class="{'weekend': day.type === 'weekend','holiday': day.type === 'holiday', 'past': day.type === 'past'}">{{day.num}}</div>
                    <div class="info tag" v-if="day.num">{{day.status}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="ecmascript-6">
import {
  dateFtt
} from './date'
export default {
  data() {
    return {
      screenHeight: 0,
      show: false,
      zIndex: -1,
      date: null,
      calList: [],
      startDate: null,
      endDate: null,
      fixMonth: null,
      dayGap: 1
    }
  },
  props: {
    total: {
      type: Boolean,
      default: true
    },
    startText: {
      type: String,
      default: '入住'
    },
    endText: {
      type: String,
      default: '退房'
    }
  },
  computed: {
    wrapperStyle() {
      return `height: ${this.screenHeight}px; z-index: ${this.zIndex}`
    },
    mainStyle() {
      return `height: 90%`
    }
  },
  mounted() {
    this.screenHeight = window.screen.height
    this.date = new Date()
    this.startDate = this.date
    this.endDate = new Date(`${this.date.getFullYear()}/${this.date.getMonth() + 1}/${this.date.getDate() + 1}`)
    this.$nextTick(() => {
      this._calcDate()
    })
  },
  methods: {
    // 选择日期
    selectDate(month, day) {
      if (day.type === 'past') {
        return ''
      }
      this.dayGap = 0
      if (!this.startDate) {
        this.startDate = new Date(`${month.month}/${day.num}`)
        // this._clearStatus()
        this._setStatus(month, day, this.startText)
        this.$emit('setStartDate', this.startDate)
      } else if (new Date(`${month.month}/${day.num}`).getTime() < this.startDate.getTime() || (this.startDate && this.endDate)) {
        this.startDate = new Date(`${month.month}/${day.num}`)
        this._clearStatus()
        this.endDate = null
        this._setStatus(month, day, this.startText)
        this.$emit('setStartDate', this.startDate)
      } else if (this.startDate && !this.endDate && this.startDate.getTime() !== new Date(`${month.month}/${day.num}`).getTime()) {
        this.endDate = new Date(`${month.month}/${day.num}`)
        this._setStatus(month, day, this.endText)
        this.$emit('setEndDate', this.endDate)
        this.dayGap = (this.endDate.getTime() - this.startDate.getTime()) / 1000 / 3600 / 24 + ''
      }
      this.$emit('change', this.startDate, this.endDate, this.dayGap)
    },
    // getSelectedDate(date) {
    //   return dateFtt('MM月dd日', date)
    // },
    // 日期格式化
    getDateFormat(date) {
      return dateFtt('yyyy年MM月', new Date(date + '/1'))
    },
    editDate() {
      this.show = true
      this.zIndex = 9
      this.$nextTick(() => {
        this._getCalHeight()
        this.bindScroll()
        this._setStatus({
          month: `${this.startDate.getFullYear()}/${this.startDate.getMonth() + 1}`
        }, {
          num: `${this.startDate.getDate()}`
        }, this.startText)
        this._setStatus({
          month: `${this.endDate.getFullYear()}/${this.endDate.getMonth() + 1}`
        }, {
          num: `${this.endDate.getDate()}`
        }, this.endText)
      })
    },
    hideDate() {
      this.show = false
      this.zIndex = -1
    },
    bindScroll() {
      document.getElementsByClassName('cm-main')[0].addEventListener('scroll', this._handleScroll)
    },
    _handleScroll(e) {
      let scrollTop = e.target.scrollTop || e.srcElement.scrollTop
      let monthHeader = Array.from(document.getElementsByClassName('cmm-header'))
      let baseHeight = document.getElementsByClassName('cmm-header')[0].offsetTop
      let animateHeight = document.getElementsByClassName('cmm-header')[0].offsetTop + document.getElementsByClassName('cm-fix')[0].clientHeight
      try {
        monthHeader.forEach((el, i) => {
          if (el.offsetTop - scrollTop < baseHeight && el.parentElement.offsetTop + el.parentElement.clientHeight - scrollTop > baseHeight) {
            document.getElementsByClassName('cm-fix')[0].style.transform = `translateY(0px)`
            this.fixMonth = el.textContent
          } else if (el.offsetTop - scrollTop > baseHeight && el.offsetTop - scrollTop < animateHeight) {
            let translate = el.offsetTop - scrollTop - animateHeight
            if (translate < 0) {
              document.getElementsByClassName('cm-fix')[0].style.transform = `translateY(${translate}px)`
            } else {
              document.getElementsByClassName('cm-fix')[0].style.transform = `translateY(0px)`
            }
          }
        })
      } catch (e) {
        if (e.message !== 'EndIterative') {
          throw e
        }
        return ''
      }
    },
    _calcDate(cYear) {
      // 获取当前年份
      let currentYear = cYear || this.date.getFullYear()
      let currentMonth = cYear ? 1 : this.date.getMonth() + 1
      this.fixMonth = dateFtt('yyyy年MM月', new Date(`${currentYear}/${currentMonth}/1`))
      this.calList.length = 0
      this._calc(currentYear, currentMonth)
      this._getHoliday()
    },
    _calc(y, m) {
      let max = m + 5
      let year = y
      let month = m
      for (let i = m; i < max; i++) {
        if (i > 12) {
          month = i - 12
          year = y + 1
        } else {
          month = i
        }
        let firstDay = new Date(`${year}/${month}/1`)
        let week = firstDay.getDay()
        let obj = {
          month: `${year}/${month}`,
          days: []
        }
        for (let times = 0; times < week; times++) {
          obj.days.push({
            num: ''
          })
        }
        let daysCount = this._getDaysCount(year, month)
        for (let times = 1; times <= daysCount; times++) {
          obj.days.push({
            num: times,
            type: '',
            price: (300 + Math.random() * 100).toFixed(0),
            status: '',
            contain: ''
          })
        }

        this.calList.push(obj)
        // obj.days.forEach((el) => {
        //   if (el.num) {
        //     let time = dateFtt('yyyyMMdd', new Date(`${year}/${month}/${el.num}`))
        //     getHoliday(time).then((res) => {
        //       el.type = res.data === 0 ? 'normal' : res.data === 3 ? 'weekend' : 'holiday'
        //     })
        //   }
        // })
      }
    },
    // 获取每月的总天数
    _getDaysCount(year, month) {
      let days

      // 当月份为二月时，根据闰年还是非闰年判断天数
      if (month === 2) {
        // days= year % 4 === 0 ? 29 : 28;
        let cond1 = year % 4 === 0 // 条件1：年份必须要能被4整除
        let cond2 = year % 100 !== 0 // 条件2：年份不能是整百数
        let cond3 = year % 400 === 0 // 条件3：年份是400的倍数
        // 当条件1和条件2同时成立时，就肯定是闰年，所以条件1和条件2之间为“与”的关系。
        // 如果条件1和条件2不能同时成立，但如果条件3能成立，则仍然是闰年。所以条件3与前2项为“或”的关系。
        // 所以得出判断闰年的表达式：
        let cond = (cond1 && cond2) || cond3
        if (cond) {
          // alert(year + "是闰年")
          // return true
          days = 29
        } else {
          // alert(year + "不是闰年")
          // return false
          days = 28
        }
      } else if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
        // 月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31
      } else {
        // 其他月份，天数为：30.
        days = 30
      }
      return days
    },
    _getHoliday() {
      this.calList.forEach((el) => {
        el.days.forEach((e) => {
          if (new Date(`${el.month}/${e.num}`).getTime() < new Date(`${this.date.getFullYear()}/${this.date.getMonth() + 1}/${this.date.getDate()}`).getTime()) {
            e.type = 'past'
          }
          if (e.num && !e.type) {
            let time = dateFtt('yyyyMMdd', new Date(`${el.month}/${e.num}`))
            this.$emit('getHoliday', time, e)
          }
        })
      })
    },
    _getCalHeight() {
      document.getElementsByClassName('cm-main')[0].style.height = document.getElementsByClassName('cal-main')[0].clientHeight - document.getElementsByClassName('cm-header')[0].clientHeight - document.getElementsByClassName('cm-days')[0].clientHeight +
        'px'
    },
    _setStatus(month, day, status) {
      this.calList.forEach((el) => {
        el.days.forEach((e) => {
          e.contain = ''
          if (e.status === status) {
            e.status = ''
          }
          if (this.startDate && this.endDate && this.startDate.getTime() < new Date(`${el.month}/${e.num}`).getTime() && new Date(`${el.month}/${e.num}`).getTime() < this.endDate.getTime()) {
            e.contain = 'contain'
          }
          if (el.month === month.month && e.num === +day.num) {
            e.status = status
          }
        })
      })
      // day.status = status
    },
    _clearStatus() {
      this.calList.forEach((el) => {
        el.days.forEach((e) => {
          e.status = ''
        })
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import './mixin'
.cal-trigger
  flex(row, center, space-between)
  // padding: 0 15px
  height: 30px
  padding: 5px 15px
  .cal-result
    flex(row, center, space-around)
    .date-time
      font-size: 14px
    .date-days
      font-size: 12px
      color:rgba(153,153,153,0.7)
    .blank
      margin: 0 12px
  .cal-total
    font-size:12px
    color:rgba(153,153,153,1)
.cal-container
  position: absolute
  top: 0
  z-index: -1
  width: 100%
  overflow: hidden
.cal-mask
  height: 10%
.cal-wrapper
  width: 100%
  background-color: rgba(0,0,0,0.1)
  .cal-main
    background-color: #fff
    border-top-left-radius: 16px
    border-top-right-radius: 16px
    position: relative
    .cm-header
      text-align: center
      height: 35px
      line-height: 35px
      font-size: 14px
      position: relative
      z-index: 9
      background-color: #fff
      .close-icon
        position: absolute
        right: 20px
        top: 50%
        transform: translateY(-50%)
        span
          font-size: 20px
          color: rgba(0, 0, 0, 0.5)
    .cm-days
      height: 30px
      flex(row, center, space-around)
      z-index: 9
      position: relative
      background-color: #fff
      .cm-days-item
        font-size: 12px
        &.holiday
          color: #D70D19
    .cm-fix
      position: absolute
      z-index: 5
      top: 65px
      left: 0
      text-align: center
      height: 30px
      line-height: 30px
      // border-bottom: 1px solid #dedede
      // border-top: 1px solid #efefef
      background-color: #fff
      width: 100%
      font-size: 14px
    .cm-main
      overflow: auto
      .cm-month
        .cmm-header
          text-align: center
          font-size: 14px
          height: 30px
          line-height: 30px
        .cmm-main
          flex(row, center, flex-start)
          flex-wrap: wrap
          .day-item
            width: 14.285714%
            height: 50px
            // line-height: 110px
            text-align: center
            flex(column, center, center)
            .info
              &.num
                height: 20px
                line-height: 20px
                font-size: 14px
                &.holiday,&.weekend
                  color: #D70D19
                &.past
                  color: rgba(0, 0, 0, 0.5)
              &.price
                font-size: 12px
              &.tag
                font-size: 12px
            &.order
              background-color: #D70D19
              color: #fff
              .num
                &.holiday,&.weekend
                  color: #fff
            &.contain
              background-color: rgba(215, 13, 25, 0.5)
              color: #fff
              .num
                &.holiday,&.weekend
                  color: #fff

.slide-enter-active, .slide-leave-active
  transition: all 0.3s
.slide-enter, .slide-leave-to
  transform: translate3d(0, 100%, 0)
</style>
