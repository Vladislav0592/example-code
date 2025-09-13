define('custom:utils/services/master-actions-services', ['custom:custom-api-ajax'], function (Ajax) {
    return class AccountNumber {
        /**
         * @param {string} entityType
         * @param {string} masterTicketId
         * @param {string} stageIdOrStatusId
         * @returns {Promise}
         */
        static getFreePlacesInMaster(entityType, masterTicketId, stageIdOrStatusId) {
            return Ajax.getRequest(`${entityType}/free-places-in-master`, {
                masterTicketId: masterTicketId,
                stageIdOrStatusId: stageIdOrStatusId
            })
        }

        /**
         * @param {string} entityType
         * @param {string} masterTicketId
         * @param {string} resolutionId
         * @param {string} buttonName
         * @returns {Promise}
         */
        static postPostponeInMaster(entityType, masterTicketId, resolutionId, buttonName) {
            return Ajax.postRequest(`${entityType}/postpone-in-master`, {
                masterTicketId: masterTicketId,
                resolutionId: resolutionId,
                buttonName: buttonName
            })
        }

        /**
         * @param {string} entityType
         * @param {string} masterTicketId
         * @param {string} intervalStart
         * @param {string} timeFrameId
         * @param {string} nameButton
         * @returns {Promise}
         */
        static postSchedulingInMaster(entityType, masterTicketId, timeFrameId, intervalStart, nameButton) {
            return Ajax.postRequest(`${entityType}/scheduling-in-master`, {
                masterTicketId: masterTicketId,
                timeFrameId: timeFrameId,
                intervalStart: intervalStart,
                nameButton: nameButton
            })
        }
    }
})
