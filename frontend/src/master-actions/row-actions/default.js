define('custom:views/master-actions/row-actions/default', [
    'views/record/panels/bottom',
    'action-handler',
    'views/modal'
], (BaseView) => {
    return class View extends BaseView {
        template = 'custom:master-actions/row-actions/default'
        buttonLabel = 'Создать в Master'
        isShow = true
        isLoad = false
        masterNumber = null
        masterTicketId = null
        stage = null

        data() {
            return {
                masterNumber: this.masterNumber,
                buttonLabel: this.buttonLabel,
                isLoad: this.isLoad,
                isShow: this.isShow
            }
        }

        actionsMobileVersion() {
            const element = document.getElementsByClassName('record-buttons')
            element[0].style.display = ''
            $('.panel-masterAction').clone().unwrap().appendTo($('#upper-container-detail'))
            const masterActionDiv = document.getElementsByClassName('panel-masterAction')
            masterActionDiv[0].style.width = '100%'
        }

        showCreateInMaster() {
            $('button[data-action="create-in-master"]').show()
        }

        hideCreateInMaster() {
            $('button[data-action="create-in-master"]').hide()
        }

        showInMaster() {
            $('button[data-action="in-master"]').show()
        }

        hideInMaster() {
            $('button[data-action="in-master"]').hide()
        }

        showOnSchedule() {
            $('button[data-action="on-schedule"]').show()
        }

        hideOnSchedule() {
            $('button[data-action="on-schedule"]').hide()
        }

        showPostpone() {
            $('button[data-action="postpone"]').show()
        }

        hidePostpone() {
            $('button[data-action="postpone"]').hide()
        }

        showMoveToSchedule() {
            $('button[data-action="move-to-schedule"]').show()
        }

        hideMoveToSchedule() {
            $('button[data-action="move-to-schedule"]').hide()
        }

        showResume() {
            $('button[data-action="resume"]').show()
        }

        hideResume() {
            $('button[data-action="resume"]').hide()
        }

        showReschedule() {
            $('button[data-action="reschedule"]').show()
        }

        hideReschedule() {
            $('button[data-action="reschedule"]').hide()
        }

        showButtonsByAllowedName(dataName) {
            $(`button[data-name="${dataName}"]`).show()
        }

        disableCreateToMasterButton() {
            $('[data-action="create-in-master"]').addClass('disabled-main-button radius-right')
        }

        enableCreateToMasterButton() {
            $('[data-action="create-in-master"]').removeClass('disabled-main-button radius-right')
        }

        disableOnScheduleButton() {
            $('[data-action="on-schedule"]').addClass('action disabled-main-button radius-right')
        }

        enableOnScheduleButton() {
            $('[data-action="on-schedule"]').removeClass('disabled-main-button radius-right')
        }

        disablePostponeButton() {
            $('[data-action="postpone"]').addClass('btn-xs-wide action disabled-main-button radius-right')
        }

        enablePostponeButton() {
            $('[data-action="postpone"]').removeClass('disabled-main-button radius-right')
        }

        disableResumeButton() {
            $('[data-action="resume"]').addClass('disabled-main-button radius-right')
        }

        enableResumeButton() {
            $('[data-action="resume"]').removeClass('disabled-main-button radius-right')
        }

        disableMoveToSchedule() {
            $('[data-action="move-to-schedule"]').addClass('disabled-main-button radius-right')
        }

        enableMoveToSchedule() {
            $('[data-action="move-to-schedule"]').removeClass('disabled-main-button radius-right')
        }

        disableReschedule() {
            $('[data-action="reschedule"]').addClass('disabled-main-button radius-right')
        }

        enableReschedule() {
            $('[data-action="reschedule"]').removeClass('disabled-main-button radius-right')
        }

        disableGroupButton() {
            this.disableOnScheduleButton()
            this.disablePostponeButton()
            this.disableResumeButton()
            this.disableMoveToSchedule()
            this.disableResumeButton()
            this.disableReschedule()
        }

        enableGroupButton() {
            this.enableOnScheduleButton()
            this.enablePostponeButton()
            this.enableResumeButton()
            this.enableMoveToSchedule()
            this.enableResumeButton()
            this.enableReschedule()
        }

        showGroupButton() {
            this.showInMaster()
            this.showOnSchedule()
            this.showPostpone()
            this.showMoveToSchedule()
            this.showResume()
            this.showReschedule()
        }

        hideGroupButton() {
            this.hideInMaster()
            this.hideOnSchedule()
            this.hidePostpone()
            this.hideMoveToSchedule()
            this.hideResume()
            this.hideReschedule()
        }

        hideActionGroupButton() {
            this.hideOnSchedule()
            this.hidePostpone()
            this.hideMoveToSchedule()
            this.hideResume()
            this.hideReschedule()
        }
    }
})
