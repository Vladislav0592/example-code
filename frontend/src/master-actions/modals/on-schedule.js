define('custom:views/master-actions/modals/on-schedule', [
    'views/modal',
    'custom:utils/services/master-actions-services',
    'model'
], (
    BaseView,
    MasterActionsServices
) => {
    return class View extends BaseView {
        template = 'custom:master-actions/modals/select-free-date-time'
        backdrop = true

        setup() {
            this.headerText = 'Выберите дату и время постановки в график'

            const title = this.options.title || ''
            const scope = this.options.scope

            this.buttonList = [
                {
                    label: 'Сохранить',
                    name: 'save',
                    style: 'primary'
                },
                {
                    name: 'cancel',
                    label: 'Отмена'
                }
            ]

            this.headerHtml = this.getHelper().escapeString(title)

            this.disableButton('select')

            this.createView(
                'record',
                'views/record/edit-for-modal',
                {
                    scope,
                    model: this.options.parentModel,
                    el: this.getSelector() + ' .record',
                    layoutName: 'onSchedule'
                },
                this
            ).then(view => {
                this.recordView = view
            })
        }

        async actionSave() {
            const enterTime = this.options.parentModel.attributes['enterTime']
            const enterDate = this.options.parentModel.attributes['enterDate']

            if (null === enterTime || null === enterDate) {
                this.notify(this.translate('writingDateAndTime', 'messages', 'Opportunity'), 'warning', 5000)
                return
            }

            const masterTicketId = this.options.parentModel.attributes['masterTicketId']
            const timeFrameId = this.options.parentModel.attributes['timeFrameId']
            const intervalStart = this.options.parentModel.attributes['intervalStart']
            const entityType = this.options.parentModel.attributes['entityType']
            const buttonName = this.options.parentModel.attributes['buttonName']

            try {
                await MasterActionsServices.postSchedulingInMaster(entityType, masterTicketId, timeFrameId, intervalStart, buttonName)
                document.querySelector('[data-name="cancel"]').click()
            } catch (e) {}
        }
    }
})
