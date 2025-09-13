define('custom:views/master-actions/enterDate', ['views/fields/date'], BaseView => {
    return class View extends BaseView {
        afterRender() {
            if (this.mode === 'edit' || this.mode === 'search') {
                this.$element = this.$el.find('[data-name="' + this.name + '"]')

                let wait = false
                this.$element.on('change', function() {
                    if (!wait) {
                        this.trigger('change')
                        wait = true
                        setTimeout(function() {
                            wait = false
                        }, 100)
                    }
                }.bind(this))

                const options = {
                    format: this.getDateTime().dateFormat.toLowerCase(),
                    weekStart: this.getDateTime().weekStart,
                    autoclose: true,
                    todayHighlight: true,
                    keyboardNavigation: true,
                    todayBtn: this.getConfig().get('datepickerTodayButton') || false,
                    startDate: new Date(),
                    endDate: `+7d`,
                }

                const language = this.getConfig().get('language')

                if (!(language in $.fn.datepicker.dates)) {
                    $.fn.datepicker.dates[language] = {
                        days: this.translate('dayNames', 'lists'),
                        daysShort: this.translate('dayNamesShort', 'lists'),
                        daysMin: this.translate('dayNamesMin', 'lists'),
                        months: this.translate('monthNames', 'lists'),
                        monthsShort: this.translate('monthNamesShort', 'lists'),
                        today: this.translate('Today'),
                        clear: this.translate('Clear'),
                    }
                }

                options.language = language

                const $datePicker = this.$element.datepicker(options)

                if (this.mode === 'search') {
                    const $elAdd = this.$el.find('input.additional')

                    $elAdd.datepicker(options)
                    $elAdd.parent().find('button.date-picker-btn').on('click', function(e) {
                        $elAdd.datepicker('show')
                    })

                    this.$el.find('select.search-type').on('change', function() {
                        this.trigger('change')
                    }.bind(this))

                    $elAdd.on('change', function() {
                        this.trigger('change')
                    }.bind(this))
                }

                this.$element.parent().find('button.date-picker-btn').on('click', function(e) {
                    this.$element.datepicker('show')
                }.bind(this))

                if (this.mode === 'search') {
                    const $searchType = this.$el.find('select.search-type')
                    this.handleSearchType($searchType.val())
                }
            }
        }
    }
})
