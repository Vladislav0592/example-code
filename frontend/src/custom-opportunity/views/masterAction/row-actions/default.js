define('custom-opportunity:views/masterAction/row-actions/default', [
    'custom:views/master-actions/row-actions/default',
    'custom:custom-ajax',
    'custom:views/master-actions/handlers/on-schedule-handler',
    'custom:utils/enums/buttons-name-actions-master',
    'custom:views/master-actions/handlers/postpone-handler',
    'custom:views/master-actions/handlers/resume-handler',
    'action-handler'
], (BaseView,CustomAjax, OnSchedule, ButtonsDataName, Postpone, Resume, ) => {
    return class View extends BaseView {
        buttonLabel = 'Создать в Master'
        isShow = true
        isLoad = false
        masterNumber = null
        masterTicketId = null
        stage = null
        userAllowedActions = []

        setup() {
            super.setup()
            this.masterNumber = this.model.get('master')
            this.masterTicketId = this.model.get('masterTicketId')

            const user = this.getUser()
            CustomAjax.getRequest('PermissionToMasterActions/user/' + user.id).then(r => {
                this.userAllowedActions = r
            })

            this.listenTo(this.model, 'change: opportunityStageId', this.#controlButtonsVisibility)
        }

        async createToMaster() {
            await this.confirm('Вы уверены, что хотите создать заявку в Master?')

            this.disableCreateToMasterButton()

            try {
              const response = await CustomAjax.postRequest(`Opportunity/${this.model.get('id')}/create-ticket-in-master`)
                if (response.error) {
                    Espo.Ui.error(response.error.message)
                    this.enableCreateToMasterButton()
                    return
                }
                await this.model.fetch()
                this.hideCreateInMaster
            } catch (e) {
                Espo.Ui.error(e.responseJSON.error.message)
            }

            this.enableCreateToMasterButton()
        }

        afterRender() {
            super.afterRender()
            const windowInnerWidth = document.documentElement.clientWidth

            this.actionsMasterButton()

            if (752 > windowInnerWidth) {
                this.actionsMobileVersion()
            }

            if (this.masterTicketId !== null) {
                this.hideCreateInMaster()
                this.showInMaster()
                this.hideActionGroupButton()
                this.#controlButtonsVisibility()
                return
            }
            this.hideGroupButton()
            if (!this.model.get('registrationSign')) {
                this.controlActiveCreateInMaster()
            }
        }

        actionsMasterButton() {
            $(document).ready(() => {
                $('[data-action="create-in-master"]').on('click', async () => {
                    this.createToMaster()
                })
                $('[data-action="in-master"]').on('click', async () => {
                    this.redirectToMaster()
                })
                $('[data-action="on-schedule"]').on('click', async () => {
                    OnSchedule.prototype.actionOpenModal(this, ButtonsDataName.getActionInSchedulerRu())
                })
                $('[data-action="postpone"]').on('click', async () => {
                    Postpone.prototype.actionOpenModal(this, ButtonsDataName.getActionDeferredRu())
                })
                $('[data-action="move-to-schedule"]').on('click', async () => {
                    OnSchedule.prototype.actionOpenModal(this, ButtonsDataName.getActionTransferToSchedulerRu())
                })
                $('[data-action="resume"]').on('click', async () => {
                    Resume.prototype.actionOpenModal(this, ButtonsDataName.getActionResumedRu())
                })
                $('[data-action="reschedule"]').on('click', async () => {
                    Postpone.prototype.actionOpenModal(this, ButtonsDataName.getActionRedeferredRu())
                })
            })
        }

        #controlButtonsVisibility() {
            const stagesIdsMap = this.getConfig().get('configs').opportunityStageMap
            const stageId = this.model.get('opportunityStageId')

            switch (stageId) {
                case stagesIdsMap.new:
                    this.hideActionGroupButton()
                    if (this.#isAvailable(ButtonsDataName.getActionCreateTicket()) && null ===this.model.get('masterTicketId')) {
                        this.showButtonsByAllowedName(ButtonsDataName.getActionCreateTicket())
                    }
                    break
                case stagesIdsMap.deferred:
                    this.hideActionGroupButton()
                    ButtonsDataName.getRedefferedAndResume().forEach(el => {
                        if (this.#isAvailable(el)) {
                            this.showButtonsByAllowedName(el)
                        }
                    })
                    break
                case stagesIdsMap.resumed:
                    this.hideActionGroupButton()
                    ButtonsDataName.getInSheduleAndDeffered().forEach(el => {
                        if (this.#isAvailable(el)) {
                            this.showButtonsByAllowedName(el)
                        }
                    })
                    break
                case stagesIdsMap.inScheduler:
                    this.hideActionGroupButton()
                    if (this.#isAvailable(ButtonsDataName.getActionTransferToScheduler())) {
                        this.showButtonsByAllowedName(ButtonsDataName.getActionTransferToScheduler())
                    }
                    break
                case stagesIdsMap.paused:
                    this.hideActionGroupButton()
                    if (this.#isAvailable(ButtonsDataName.getActionResumed())) {
                        this.showButtonsByAllowedName(ButtonsDataName.getActionResumed())
                    }
                    break
                default: this.hideActionGroupButton()
            }
        }

        controlActiveCreateInMaster() {
            const themeId = this.model.get('themeId')
            const themeReasonId = this.model.get('reasonId')

            if (null === themeId && null === themeReasonId) {
                this.disableCreateToMasterButton()
                return
            }

            if (this.model.get('isReasonServiceKind') || !this.model.get('isThemePassToMaster')) {
                this.disableCreateToMasterButton()
            }
        }

        #isAvailable(dataNameButton) {
            if (this.userAllowedActions.includes(dataNameButton)) {
                return true
            }
        }

        redirectToMaster() {
            if (!this.masterTicketId) {
                return
            }
            const url = this.getConfig().get('configs').master.base_uri
            window.open(`${url}/#/ticket/connections/${this.masterTicketId}`, '_blank')
        }
    }
})
