define('custom:views/master-actions/handlers/on-schedule-handler', [
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
        async actionOpenModal(view, buttonName) {
            const masterAction = new MasterActions
            masterAction.disableGroupButton()

            const masterTicketId = view.model.get('masterTicketId')
            const entityType = view.model.get('entityType')
            const stageIdOrStatusId = view.model.get('opportunityStageId') ?? view.model.get('statusId')


            if (!stageIdOrStatusId) {
               masterAction.enableGroupButton()
               return Espo.Ui.error('Поле Стадия или поле Статус не могут быть пустыми', true)
            }

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
            formModel.name = view.model.get('entityType')
            formModel.setDefs({
                fields: {
                    enterDate: {
                        type: 'date',
                        required: true,
                        view: 'custom:views/master-actions/enterDate'
                    },
                    enterTime: {
                        type: 'enum',
                        view: 'custom:views/master-actions/enterTime'
                    },
                    masterTicketId: {
                        type: 'varchar'
                    },
                    stageOrStatus: {
                        type: 'varchar'
                    },
                    timeFrameId: {
                        type: 'varchar'
                    },
                    intervalStart: {
                        type: 'varchar'
                    },
                    entityType: {
                        type: 'varchar'
                    },
                    buttonName: {
                        type: 'varchar'
                    }
                }
            })
            formModel.set('masterTicketId', view.model.get('masterTicketId'))
            formModel.set('stageOrStatus', stageIdOrStatusId)
            formModel.set('entityType', view.model.get('entityType'))
            formModel.set('buttonName', buttonName)

            view.createView(
                'modal',
                'custom:views/master-actions/modals/on-schedule',
                {
                    scope: this.scope,
                    layoutName: 'detailModal',
                    parentModel: formModel,
                    parentView: view
                },
                view => view.render()
            )
            masterAction.enableGroupButton()
        }
    }
})
