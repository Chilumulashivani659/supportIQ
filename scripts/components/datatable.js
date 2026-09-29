/* ==========================================================================
   datatable.js — reusable table with responsive card fallback
   columns: [{key, label, cls}]   rows: [{cells: {key: markup}, attrs}]
   ========================================================================== */
(function (SIQ) {
  'use strict';

  function render(opts) {
    var o = opts || {};
    var columns = o.columns || [];
    var rows = o.rows || [];

    if (!rows.length) {
      return o.empty || SIQ.States.empty({
        title: 'Nothing to show', desc: 'No records match the current filters.'
      });
    }

    var head = columns.map(function (c) {
      return SIQ.dom.html`<th class="${c.cls || ''}" scope="col">${c.label}</th>`;
    });

    var body = rows.map(function (row) {
      var cells = columns.map(function (c) {
        return SIQ.dom.html`<td class="${c.cls || ''}" data-label="${c.label}">${row.cells[c.key] || ''}</td>`;
      });
      return SIQ.dom.html`<tr class="${row.cls || ''}" ${row.attrs ? SIQ.dom.raw(row.attrs) : ''}>${cells}</tr>`;
    });

    return SIQ.dom.html`
      <div class="table-card">
        <div class="table-scroll">
          <table class="data ${o.stackable === false ? '' : 'stackable'}">
            <thead><tr>${head}</tr></thead>
            <tbody>${body}</tbody>
          </table>
        </div>
        ${o.foot ? SIQ.dom.html`<div class="table-foot">${o.foot}</div>` : ''}
      </div>`;
  }

  SIQ.DataTable = { render: render };
})(window.SIQ);
