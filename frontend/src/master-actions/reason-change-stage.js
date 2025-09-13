define('custom:views/master-actions/reason-change-stage', [
    'views/fields/link',
    'custom:utils/enums/buttons-name-actions-master'
], (BaseView, ButtonName) => {
    return class View extends BaseView {
        getSelectFilters() {
            const buttonName = this.options.model.get('buttonName')
            const opportunityStages =  this.getConfig().get('configs').opportunityStageMap

            switch (buttonName) {
                case ButtonName.getActionRedeferredRu():
                    return {
                        ReasonChangeStage: {
                            type: 'linkedWith',
                            attribute: 'opportunityStage',
                            value: opportunityStages.deferred
                        }
                    }
                case ButtonName.getActionDeferredRu():
                    return {
                        ReasonChangeStage: {
                            type: 'linkedWith',
                            attribute: 'opportunityStage',
                            value: opportunityStages.deferred
                        }
                    }
                case ButtonName.getActionResumedRu():
                    return {
                        ReasonChangeStage: {
                            type: 'linkedWith',
                            attribute: 'opportunityStage',
                            value: opportunityStages.resumed
                        }
                    }
                default: return
            }
        }
    }
})
