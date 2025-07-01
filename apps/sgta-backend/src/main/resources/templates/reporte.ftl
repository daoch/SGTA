<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Reporte de similitud</title>

  <style>
    body  { font-family: Arial, Helvetica, sans-serif; margin: 2rem; }
    h1    { text-align: center; }

    .score-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 24px;
      color: #fff;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .green  { background:#4caf50; }
    .amber  { background:#ffb300; }
    .red    { background:#e53935; }

    table  { width:100%; border-collapse:collapse; margin-top:1.5rem; font-size:0.95rem; }
    th,td  { border-bottom:1px solid #ccc; padding:8px; vertical-align: top; }
    th     { background:#f5f5f5; text-align:left; }
    td.seq { width:55%; }
    td.src { width:30%; }
    td.scr { width:15%; text-align:center; font-weight:600; }
  </style>
</head>
<body>


<h1>Reporte de similitud</h1>

<#-- Semáforo de colores -->
<#if result.score?number < 5>
    <#assign badgeClass = "green">
<#elseif result.score?number < 20>
    <#assign badgeClass = "amber">
<#else>
    <#assign badgeClass = "red">
</#if>

<p style="text-align:center;">
  <span class="score-badge ${badgeClass}">
    Score general: ${result.score}%
  </span>
</p>

<h2>Coincidencias detectadas</h2>
<table>
  <thead>
    <tr>
      <th>Oración</th>
      <th>Fuente</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>

  <#list sources as s>
    <#list s.plagiarismFound as frag>
      <tr>
        <td class="seq">${frag.sequence}</td>
        <td class="src">
          <a href="${s.url?html}" target="_blank">${s.title?html}</a><br/>
          <small>${s.source}</small>
        </td>
        <td class="scr">${s.score}%</td>
      </tr>
    </#list>
  </#list>

  </tbody>
</table>

</body>
</html>
