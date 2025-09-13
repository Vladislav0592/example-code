{{#if isShow }}
<button data-action="create-in-master" data-name="actionCreateTicket" data-class="btn btn-primary creating-in-master">{{buttonLabel}}</button>
<button data-action="in-master" data-name="actionViewTicket" class="btn btn-primary btn-xs-wide in-master" style="margin-bottom: 2%">Завявка № {{masterNumber}}</button>
<button data-action="on-schedule" data-name="actionInScheduler" class="btn btn-xs-wide action-in-master">В график/в котел</button>
<button data-action="postpone" data-name="actionDeferred" class="btn action-in-master">Отложить</button>
<button data-action="move-to-schedule" data-name="actionTransferToScheduler" class="btn action-in-master">Перенести в график/в котле</button>
<button data-action="resume" data-name="actionResumed" class="btn action-in-master">Возобновить</button>
<button data-action="reschedule" data-name="actionRedeffered" class="btn action-in-master">Переотложить</button>
{{/if}}

{{#if isLoad}}
    {{#if clientList.length}}
    <div class="row" style="margin-top: 10px;">
        {{#each clientList}}
            {{#if actionList.length}}
                <div class="btn-group">

                    <button type="button" class="billing-action cell dropdown-toggle" data-toggle="dropdown">

                        <div class="control-label">
                            <span class="label-text" style="color: black!important;">{{{label}}}</span>
                        </div>
                        <div class="field hide">accountNumber</div>

                        <span class="caret"></span>

                    </button>

                    <ul class="dropdown-menu pull-right list-row-dropdown-menu" data-id="{{model.id}}">
                    {{#each actionList}}
                    <li>
                        <a
                           {{#if link}}href="{{link}}"{{else}}role="button"{{/if}}
                            tabindex="0"
                            class="action"
                            {{#if action}}data-action="{{action}}"{{/if}}
                            {{#each data}}
                            data-{{@key}}="{{./this}}"
                            {{/each}}
                        >{{#if html}}{{{html}}}{{else}}{{#if text}}{{text}}{{else}}{{translate label scope=../scope}}{{/if}}{{/if}}
                        </a>
                    </li>
                    {{/each}}
                    </ul>
                </div>
            {{/if}}

        {{/each}}
    </div>
    {{else}}
    <div class="bulma">
        <article class="message2g9t5 is-dangerJpO_X errorMessage">
            <div class="message-body2xpMa">Клиент не имеет лицевых счетов. Действия в биллинге недоступны.</div>
        </article>
    </div>
    {{/if}}
    {{#ifEqual clientList 'contact'}}
    <div class="bulma">
        <article class="message2g9t5 is-dangerJpO_X errorMessage">
            <div class="message-body2xpMa">Контакт не имеет лицевых счетов. Действия в биллинге недоступны</div>
        </article>
    </div>
    {{/ifEqual}}
    {{#ifEqual clientList 'error'}}
    <div class="bulma">
        <article class="message2g9t5 is-dangerJpO_X errorMessage">
            <div class="message-body2xpMa">Системная ошибка. Невозможно получить данные о лицевых счетах контакта.</div>
        </article>
    </div>
    {{/ifEqual}}
{{/if}}
