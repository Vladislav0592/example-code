define('custom:views/master-actions/handlers/postpone-handler', [
    'action-handler',
    'custom:views/master-actions/row-actions/default',
    'custom:utils/services/master-actions-services',
    'model'
], (
    BaseView,
    MasterActions,
    MasterActionsServices,
    Model
) => {
    return class View extends BaseView {
        setup() {
            super.setup()

            this.actionList.unshift({
                label: 'Select',
                action: 'opportunity',
                acl: 'edit'
            })
        }

        async actionOpenModal(view, buttonName) {
            const masterAction = new MasterActions
            masterAction.disableGroupButton()

            const stageIdOrStatusId = view.model.get('opportunityStageId') ?? view.model.get('statusId')
            const masterTicketId = view.model.get('masterTicketId')
            const entityType = view.model.get('entityType')

            const response = await MasterActionsServices.getFreePlacesInMaster(entityType, masterTicketId, stageIdOrStatusId)

            if (response.error) {
                masterAction.enableGroupButton()
                return Espo.Ui.error(response.error.error.message, true)
            }

            if (response.data.result.length === 0) {
                masterAction.enableGroupButton()
                return Espo.Ui.error('Стадия в сделке не совпадает со статусом заявки в master. Создайте заявку в Jira', true)
            }

            const formModel = new Model()
            formModel.name =  view.model.get('entityType')

            formModel.setDefs({
                fields: {
                    reasonChangeStage: {
                        type: 'link',
                        required: true,
                        entity: 'ReasonChangeStage',
                        view: 'custom:views/master-actions/reason-change-stage'
                    },
                    dateTimeForPostpone: {
                        type: 'datetime',
                        minuteStep: 30,
                        required: true,
                        view: 'custom:views/master-actions/date-time-for-postpone'
                    },
                    masterTicketId: {
                        type: 'varchar'
                    },
                    entityType: {
                        type: 'varchar'
                    }
                }
            })
            formModel.set('masterTicketId', view.model.get('masterTicketId'))
            formModel.set('entityType', view.model.get('entityType'))
            formModel.set('buttonName', buttonName)

            view.createView(
                'dialog',
                'custom:views/master-actions/modals/postpone',
                {
                    scope: this.scope,
                    layoutName: 'postpone',
                    parentModel: formModel,
                    parentView: this
                },
                view => view.render()
            )
            masterAction.enableGroupButton()
        }
    }
})
