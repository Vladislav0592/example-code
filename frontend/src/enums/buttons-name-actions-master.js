define('custom:utils/enums/buttons-name-actions-master', [], function () {
    return class Enum {
        static getActionDeferredRu() {
            return 'Отложить'
        }

        static getActionResumedRu() {
            return 'Возобновить'
        }

        static getActionRedeferredRu() {
            return 'Переотложить'
        }

        static getActionInSchedulerRu() {
            return 'В график'
        }

        static getActionTransferToSchedulerRu() {
            return 'Перенести в график'
        }

        static getActionCreateTicket() {
            return 'actionCreateTicket'
        }

        static getActionViewTicket() {
            return 'actionViewTicket'
        }

        static getActionInScheduler() {
            return 'actionInScheduler'
        }

        static getActionDeferred() {
            return 'actionDeferred'
        }

        static getActionTransferToScheduler() {
            return 'actionTransferToScheduler'
        }

        static getActionResumed() {
            return 'actionResumed'
        }

        static getActionRedeffered() {
            return 'actionRedeffered'
        }

        static getRedefferedAndResume() {
            return ['actionRedeffered', 'actionResumed']
        }

        static getInSheduleAndDeffered() {
            return ['actionInScheduler', 'actionDeferred']
        }
    }
})
