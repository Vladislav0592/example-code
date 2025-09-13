define('custom:views/master-actions/modals/postpone', ['views/modal',
    'custom:utils/services/master-actions-services',
    'model'
], (
    BaseView,
    MasterActionsServices
) => {
    return class View extends BaseView {
        className = 'dialog dialog-record'
        templateContent = '<div class="record">{{{record}}}</div>'
        backdrop = true

        setup() {
            this.headerText = 'Выберите причину и дату на которую необходимо отложить заявку'

            if ('resume' === this.options.layoutName) {
                this.headerText = 'Выберите причину возобновления заявки'
            }

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
                    layoutName: this.options.layoutName
                },
                this
            ).then(view => {
                this.recordView = view
            })
        }

        async actionSave() {
            const resolutionId = this.options.parentModel.attributes['reasonChangeStageId']
            const entityType = this.options.parentModel.attributes['entityType']

            if (null === resolutionId) {
                return this.notify(this.translate('writingDateAndTime', 'messages', 'Opportunity'), 'error', 1000)
            }

            const masterTicketId = this.options.parentModel.attributes['masterTicketId']
            const masterButtonName = this.options.parentModel.attributes['buttonName']

            const buttonSave = $(`button[data-name='save']`)
            try {
                buttonSave.addClass('disabled')
                const response = await MasterActionsServices.postPostponeInMaster(entityType,masterTicketId, resolutionId, masterButtonName)

                if (response.error) {
                    buttonSave.removeClass('disabled')
                    return Espo.Ui.error(response.error.message, true)
                }

                document.querySelector('[data-name="cancel"]').click()
            } catch (e) {}
        }
    }
})
