define('custom-opportunity:views/opportunity/fields/reason-change-stage', 'views/fields/link', BaseView => {
    return class View extends BaseView {
        selectRecordsView = 'custom-opportunity:views/opportunity/modals/select-record-for-reason-change-stage'

        getSelectFilters() {
            return this.getFilters({
                byUserTeams: true,
                opportunityStage: this.model.get('opportunityStageId')
            })
        }

        getFilters(customConditions = {}) {
            this.selectPrimaryFilterName = 'reasonChangeStage'
            return {
                ReasonChangeStage: {
                    ...customConditions
                }
            }
        }
    }
})
