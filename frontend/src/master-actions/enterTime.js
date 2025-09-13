define('custom:views/master-actions/enterTime', [
    'views/fields/enum',
    'custom:utils/services/master-actions-services',
], (BaseView, MasterActionsServices) => {
    return class View extends BaseView {
        async setup() {
            super.setup()

            const masterTicketId = this.model.get('masterTicketId')
            const stageOrStatus = this.model.get('stageOrStatus')
            const entityType = this.model.get('entityType')
            let optionList = null
            const response = await MasterActionsServices.getFreePlacesInMaster(entityType, masterTicketId, stageOrStatus)

            this.listenTo(this.model, 'change:enterDate', () => {
                this.model.set({ enterTime: null })
                const enterDate = this.model.get('enterDate')
                const urgentSlots = this.getTimeIntervals([response.data.result.urgent_slot], enterDate)
                const slots = this.getTimeIntervals(response.data.result.slots, enterDate).map(item => item.replace(/-NaN:NaN$/, ''))
                const combinedSlots = [...slots].filter(time => !this.isTimeInUrgentSlot(time, urgentSlots))

                if (urgentSlots) {
                    optionList = urgentSlots.concat(combinedSlots).sort()
                } else {
                    optionList = slots
                }

                optionList.unshift('')
                this.setOptionList(optionList)
            })

            this.listenTo(this.model, 'change:enterTime', () => {
                if (null !== this.model.get('enterTime')) {
                    const date = this.model.get('enterDate')
                    const time = this.model.get('enterTime')
                    if (null === response.data.result.urgent_slot) {
                        this.setTimeFrameIdAndIntervalStart(date, time, response)
                        return
                    }
                    this.setIntervalStart(date, time, response)
                }
            })
        }

        setTimeFrameIdAndIntervalStart(date, time, response) {
            const [year, month, day] = date.split('-').map(Number)
            const [hour, minute] = time.split(':').map(Number)
            const targetDateTime = new Date(year, month - 1, day, hour, minute)
            const foundSlot = response.data.result.slots.find(slot => {
                const slotDateTime = new Date(slot.interval_start)
                return slotDateTime.getTime() === targetDateTime.getTime()
            })

            this.model.set('intervalStart', foundSlot.interval_start)
            if (!foundSlot.timeframe_id) {
                this.model.set('timeFrameId', null)
                return
            }
            this.model.set('timeFrameId', foundSlot.timeframe_id)
        }

        setIntervalStart(date, timeInterval, response) {
            const [timeStart, endTime] = timeInterval.split('-')

            if (!endTime) {
                this.setTimeFrameIdAndIntervalStart(date, timeInterval, response)
                return
            }

            const startDateTime = new Date(`${date}T${timeStart}:00+07:00`)
            const urgentSlot = [response.data.result.urgent_slot]
            const foundSlot = urgentSlot.find(slot => {
                const slotStart = new Date(slot.interval_start)
                return slotStart.getTime() === startDateTime.getTime()
            })

            this.model.set('intervalStart', foundSlot.interval_start)
        }

        isTimeInUrgentSlot(time, urgentSlots) {
            if (!urgentSlots) {
                return
            }

            return urgentSlots.some(slot => {
                const [start, end] = slot.split('-')
                return time >= start && time < end
            })
        }

        getTimeIntervals(intervals, compareDate) {
            if (null === intervals) {
                return
            }

            const timeIntervals = []
            intervals.forEach(interval => {
                const intervalDate = new Date(interval.interval_start).toISOString().split('T')[0]

                if (intervalDate === compareDate) {
                    const startTime = new Date(interval.interval_start)

                    if (10 > startTime.getHours()) {
                        return
                    }

                    const endTime = new Date(interval.interval_end)
                    const startHour = startTime.getHours()
                    const startMinute = startTime.getMinutes()
                    const endHour = endTime.getHours()
                    const endMinute = endTime.getMinutes()
                    const formattedStart = `${startHour}:${String(startMinute).padStart(2, '0')}`
                    const formattedEnd = `${endHour}:${String(endMinute).padStart(2, '0')}`

                    timeIntervals.push({ start: formattedStart, end: formattedEnd })
                }
            })

            return timeIntervals.map(interval => {
                return `${interval.start}-${interval.end}`
            })
        }
    }
})
