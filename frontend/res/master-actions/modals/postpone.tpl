<div class="list-container" style="margin-top: 4px;">
    <div class="panel-body">
        <div class="row">
            <div class="ceil form-group col-sm-6">
                <input class="form-control phone" type="datetime-local" id="timeSlots"  data-name="date" name="date" required>
            </div>
        </div>
        <div class="row">
            <div class="record">{{{record}}}</div>
        </div>
        <div class="row">
            <div class="ceil form-group col-sm-6">
                <a
                        class="btn btn-default"
                        type="button"
                        data-action="cancel"
                        data-property-type="primary"
                        data-placement="top">Отмена</a>

                <a
                        class="btn btn-primary disabled"
                        type="submit"
                        id="saveBtn"
                        data-action="save"
                        data-property-type="primary"
                        data-placement="top">Сохранить</a>
            </div>
        </div>
    </div>
</div>
