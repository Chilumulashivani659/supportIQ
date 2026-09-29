/* ==========================================================================
   customerresponse.js — the short, customer-facing reply
   Visually separated from the internal intelligence above it.
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function render(ws) {
    var text = ws.response || '';
    var count = SIQ.fmt.words(text);
    var editing = ws.editing;

    var body = editing
      ? SIQ.dom.html`
        <textarea class="textarea resp__text--edit" data-input="responseText" data-focus-key="responseText"
                  aria-label="Customer response">${text}</textarea>`
      : text
        ? SIQ.dom.html`<p class="resp__text">${text}</p>`
        : SIQ.dom.html`<p class="resp__text ink-4">The analysis API did not return a customer response for this issue.</p>`;

    return SIQ.dom.raw(SIQ.dom.html`
      <section class="resp anim-up">
        <div class="resp__head">
          <div>
            <span class="resp__eyebrow">${SIQ.icon('send', 12)} Customer-facing response</span>
            <div class="resp__title">Customer Response</div>
            <div class="resp__sub">Short reply for the customer — the agent reviews it before sending.</div>
          </div>
          ${ws.sent ? SIQ.dom.html`<span class="badge badge--green badge--dot">Sent to customer</span>` : ''}
        </div>

        <div class="resp__body">
          ${body}
          <div class="resp__meta">
            <span class="tag">${SIQ.icon('file', 12)} ${count} words</span>
            <span class="tag">${SIQ.icon('layers', 12)} Returned by the analysis API</span>
            <span class="tag">${SIQ.icon('userCheck', 12)} Agent reviewed</span>
          </div>
        </div>

        <div class="resp__foot">
          <span class="resp__foot-note">${SIQ.icon('shieldCheck', 13)} Internal intelligence stays internal — only this text is shared.</span>
          <div class="resp__actions">
            ${editing
              ? SIQ.dom.html`
                <button class="btn btn--sm btn--ghost" data-action="cancel-edit">Cancel</button>
                <button class="btn btn--sm btn--primary" data-action="save-edit">${SIQ.icon('check', 14, { strokeWidth: 2 })} Save response</button>`
              : SIQ.dom.html`
                <button class="btn btn--sm" data-action="copy-response">
                  ${SIQ.icon(ws.copied ? 'check' : 'copy', 14, { strokeWidth: 2 })}
                  ${ws.copied ? 'Copied' : 'Copy Response'}
                </button>
                <button class="btn btn--sm" data-action="edit-response">${SIQ.icon('edit', 14)} Edit Response</button>
                <button class="btn btn--sm btn--green" data-action="send-response">${SIQ.icon('send', 14)} Send to customer</button>`}
          </div>
        </div>
      </section>`);
  }

  SIQ.CustomerResponse = { render: render };
})(window.SIQ);
