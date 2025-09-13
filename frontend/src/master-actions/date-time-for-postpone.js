define('custom:views/master-actions/date-time-for-postpone', ['views/fields/datetime'], BaseView => {
    return class View extends BaseView {
        initTimepicker() {
            const time = this.$time
            time.timepicker({
                step: this.params.minuteStep || 30,
                scrollDefaultNow: true,
                minTime: '09:00',
                maxTime: '21:00',
                timeFormat: this.timeFormatMap[this.getDateTime().timeFormat]
            })

            time
                .parent()
                .find('button.time-picker-btn')
                .on('click', () => {
                    time.timepicker('show')
                })
        }

        setDefaultTime() {
            var dtString = moment('2014-01-01 09:00').format(this.getDateTime().getDateTimeFormat()) || ''
            var pair = this.splitDatetime(dtString)
            if (pair.length === 2) {
                this.$time.val(pair[1])
            }
        }
    }
})
