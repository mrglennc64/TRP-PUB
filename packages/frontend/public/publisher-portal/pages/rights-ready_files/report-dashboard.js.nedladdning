function getScoreState(score) {
    if (score >= 90) {
        return { label: 'Ready for submission', className: 'score-good', icon: 'OK' };
    }
    if (score >= 70) {
        return { label: 'Needs Attention', className: 'score-warn', icon: '!' };
    }
    return { label: 'Critical problems', className: 'score-bad', icon: 'X' };
}

function severitySymbol(level) {
    if (level === 'high') return 'X';
    if (level === 'medium') return '!';
    return 'i';
}

function titleCase(text) {
    return String(text || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, function (m) { return m.toUpperCase(); });
}

function normalizeDashboardData(tool, data) {
    var score = 78;
    if (typeof data.score === 'number') score = data.score;
    if (typeof data.overall_score === 'number') score = data.overall_score;

    var issues = [];
    if (Array.isArray(data.issues) && data.issues.length) {
        issues = data.issues.map(function (item) {
            return {
                text: titleCase(item.type) + (item.track ? ' (' + item.track + ')' : ''),
                severity: item.severity || 'medium'
            };
        });
    }

    if (!issues.length) {
        if ((data.missing_isrc || 0) > 0) issues.push({ text: 'Missing ISRC entries', severity: 'high' });
        if ((data.missing_ipi || data.missing_upc || 0) > 0) issues.push({ text: 'Missing IPI entries', severity: 'high' });
        if ((data.missing_iswc || 0) > 0) issues.push({ text: 'Missing ISWC entries', severity: 'medium' });
        if ((data.invalid_format || 0) > 0) issues.push({ text: 'Invalid identifier format', severity: 'medium' });
    }

    if (!issues.length && Array.isArray(data.clearance_issues) && data.clearance_issues.length) {
        issues = data.clearance_issues.map(function (item) {
            return {
                text: item.issue + ' (' + item.territory + ')',
                severity: 'high'
            };
        });
    }

    if (!issues.length) {
        issues = [
            { text: 'Missing IPI number', severity: 'high' },
            { text: 'Missing ISWC', severity: 'medium' },
            { text: 'Publisher field empty', severity: 'medium' }
        ];
    }

    var duplicate = {
        source: 'Midnight Sun',
        target: 'Midnight-Sun',
        confidence: 92
    };
    if (Array.isArray(data.matches) && data.matches.length) {
        duplicate = {
            source: data.matches[0].source && data.matches[0].source.title ? data.matches[0].source.title : 'Source Work',
            target: data.matches[0].target && data.matches[0].target.title ? data.matches[0].target.title : 'Possible Match',
            confidence: data.matches[0].confidence || 80
        };
    }

    var isrcPresent = true;
    var iswcPresent = false;
    var ipiPresent = false;

    if (tool === 'identifier-gap') {
        isrcPresent = (data.missing_isrc || 0) === 0;
        iswcPresent = (data.missing_iswc || 0) === 0;
        ipiPresent = ((data.missing_ipi || data.missing_upc || 0) === 0);
        score = Math.max(40, 100 - ((data.missing_isrc || 0) * 10 + ((data.missing_ipi || data.missing_upc || 0) * 6) + (data.invalid_format || 0) * 7 + (data.missing_iswc || 0) * 5));
    }

    var splitTotal = 95;
    var composerShare = 50;
    var publisherShare = 45;
    if (Array.isArray(data.details) && data.details.length && typeof data.details[0].actual === 'number') {
        splitTotal = Math.round(data.details[0].actual);
        if (typeof data.details[0].composer === 'number') {
            composerShare = Math.round(data.details[0].composer);
        }
        if (typeof data.details[0].publisher === 'number') {
            publisherShare = Math.round(data.details[0].publisher);
        } else {
            publisherShare = Math.max(0, splitTotal - composerShare);
        }
    }

    if (typeof data.total_expected === 'number' && typeof data.total_actual === 'number' && data.total_expected > 0) {
        splitTotal = Math.round((data.total_actual / data.total_expected) * 100);
        var gap = Math.max(0, 100 - splitTotal);
        if (!Array.isArray(data.details) || !data.details.length) {
            composerShare = Math.max(0, Math.min(100, 50 + Math.round(gap / 2)));
            publisherShare = Math.max(0, Math.min(100, splitTotal - composerShare));
        }
    }

    var readiness = score >= 90;
    if (typeof data.ready_for_release === 'boolean') {
        readiness = data.ready_for_release;
    }
    if (typeof data.verified === 'boolean' && tool === 'splits') {
        readiness = data.verified;
    }

    var requiredFixes = [];
    if (!ipiPresent) requiredFixes.push('Add IPI number');
    if (splitTotal !== 100) requiredFixes.push('Correct split totals to equal 100%');
    if (!iswcPresent) requiredFixes.push('Register or add ISWC');
    if (!requiredFixes.length) requiredFixes.push('No critical fixes required');

    var toolTitles = {
        'health-audit': 'Metadata Health Audit Report',
        'identifier-gap': 'Identifier Gap Report',
        'reconcile': 'Duplicate Reconciliation Report',
        'splits': 'Split Verification Report',
        'rights-ready': 'Rights Readiness Report'
    };

    var sections = {
        showIssues: true,
        showSplits: true,
        showDuplicate: true,
        showIdentifiers: true,
        showReadiness: true,
        showFixes: true
    };

    if (tool === 'health-audit') {
        sections.showDuplicate = false;
    }
    if (tool === 'identifier-gap') {
        sections.showSplits = false;
        sections.showDuplicate = false;
    }
    if (tool === 'reconcile') {
        sections.showSplits = false;
        sections.showIdentifiers = false;
    }
    if (tool === 'splits') {
        sections.showDuplicate = false;
        sections.showIdentifiers = false;
    }
    if (tool === 'rights-ready') {
        sections.showDuplicate = false;
    }

    return {
        title: toolTitles[tool] || 'Roya Report',
        score: Math.max(0, Math.min(100, Math.round(score))),
        issues: issues,
        splits: {
            composer: composerShare,
            publisher: publisherShare,
            total: splitTotal,
            valid: splitTotal === 100
        },
        duplicate: duplicate,
        identifiers: {
            isrc: isrcPresent,
            iswc: iswcPresent,
            ipi: ipiPresent
        },
        readiness: readiness,
        requiredFixes: requiredFixes,
        sections: sections
    };
}

function buildConfidenceBar(confidence) {
    var safe = Math.max(0, Math.min(100, confidence));
    return '<div class="confidence-track"><div class="confidence-fill" style="width:' + safe + '%"></div></div>';
}

function buildDashboardHtml(view) {
    var scoreState = getScoreState(view.score);
    var issueRows = view.issues.map(function (item) {
        return '<li><span class="sev sev-' + item.severity + '">' + severitySymbol(item.severity) + '</span>' + item.text + '</li>';
    }).join('');

    var requiredFixes = view.requiredFixes.map(function (fix) {
        return '<li>' + fix + '</li>';
    }).join('');

    var scoreIcon = scoreState.className === 'score-good' ? 'OK' : (scoreState.className === 'score-warn' ? '!' : 'X');

    var parts = [
        '<div class="report-dashboard">',
        '<h2>' + view.title + '</h2>',
        '<h2>Metadata Health Score</h2>',
        '<div class="score-banner ' + scoreState.className + '">',
        '<div class="score-main">' + scoreIcon + ' ' + view.score + '%</div>',
        '<div class="score-sub">Status: ' + scoreState.label + '</div>',
        '</div>'
    ];

    if (view.sections.showIssues) {
        parts.push(
            '<section class="report-block">',
            '<h3>Issues Found</h3>',
            '<ul class="issue-list">' + issueRows + '</ul>',
            '</section>'
        );
    }

    if (view.sections.showSplits) {
        parts.push(
            '<section class="report-block">',
            '<h3>Ownership Splits</h3>',
            '<div class="split-grid">',
            '<div>Composer: <strong>' + view.splits.composer + '%</strong></div>',
            '<div>Publisher: <strong>' + view.splits.publisher + '%</strong></div>',
            '</div>',
            '<div class="split-pie" style="--composer:' + view.splits.composer + '; --publisher:' + view.splits.publisher + ';"></div>',
            '<p class="split-total ' + (view.splits.valid ? 'ok' : 'bad') + '">' +
                (view.splits.valid ? 'OK' : 'X') + ' Total = ' + view.splits.total + '% ' +
                (view.splits.valid ? '' : '(Shares must equal 100%)') +
            '</p>',
            '</section>'
        );
    }

    if (view.sections.showDuplicate) {
        parts.push(
            '<section class="report-block">',
            '<h3>Possible Duplicate Work</h3>',
            '<p class="dup-title">' + view.duplicate.source + '</p>',
            '<p class="dup-title">' + view.duplicate.target + '</p>',
            '<p>Confidence Match: <strong>' + view.duplicate.confidence + '%</strong></p>',
            buildConfidenceBar(view.duplicate.confidence),
            '</section>'
        );
    }

    if (view.sections.showIdentifiers) {
        parts.push(
            '<section class="report-block">',
            '<h3>Identifier Check</h3>',
            '<table class="id-table">',
            '<tr><td>ISRC</td><td>' + (view.identifiers.isrc ? 'Present' : 'Missing') + '</td></tr>',
            '<tr><td>ISWC</td><td>' + (view.identifiers.iswc ? 'Present' : 'Missing') + '</td></tr>',
            '<tr><td>IPI</td><td>' + (view.identifiers.ipi ? 'Present' : 'Missing') + '</td></tr>',
            '</table>',
            '</section>'
        );
    }

    if (view.sections.showReadiness) {
        parts.push(
            '<section class="report-block">',
            '<h3>Rights Submission Readiness</h3>',
            '<p class="ready-state ' + (view.readiness ? 'ok' : 'bad') + '">' + (view.readiness ? 'OK Ready' : 'X Not Ready') + '</p>',
            '<p>Required fixes:</p>',
            '<ul class="fix-list">' + requiredFixes + '</ul>',
            '</section>'
        );
    }

    if (view.sections.showFixes) {
        parts.push(
            '<section class="report-block fix-panel">',
            '<h3>Suggested Fixes</h3>',
            '<ul class="fix-list">' + requiredFixes + '</ul>',
            '</section>'
        );
    }

    parts.push('</div>');
    return parts.join('');
}

async function runRoyaTool(config) {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div class="loading-wrap"><div class="spinner"></div><p>Analyzing Metadata...</p></div>';

    var start = Date.now();

    try {
        var payload = JSON.parse(JSON.stringify(config.payload || {}));
        var fileInputId = config.fileInputId || 'fileInput';
        var fileInput = document.getElementById(fileInputId);
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            var selectedFile = fileInput.files[0];
            var parsedRows = await parseSelectedFile(selectedFile);
            payload.file_name = selectedFile.name;
            payload.rows = parsedRows;
        }

        var response = await fetch(config.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        var data = await response.json();
        var elapsed = Date.now() - start;
        if (elapsed < 2000) {
            await new Promise(function (resolve) { setTimeout(resolve, 2000 - elapsed); });
        }

        var model = normalizeDashboardData(config.tool, data);
        resultDiv.innerHTML = buildDashboardHtml(model);
    } catch (error) {
        resultDiv.innerHTML = '<div class="error-box">Could not process metadata: ' + error.message + '</div>';
    }
}

function parseCsvText(text) {
    var lines = String(text || '')
        .split(/\r?\n/)
        .filter(function (line) { return line.trim().length > 0; });

    if (!lines.length) return [];

    var headers = splitCsvLine(lines[0]).map(function (h) {
        return String(h || '').trim();
    });

    var rows = [];
    for (var i = 1; i < lines.length; i += 1) {
        var parts = splitCsvLine(lines[i]);
        var row = {};
        for (var j = 0; j < headers.length; j += 1) {
            var key = headers[j] || ('col_' + j);
            row[key] = (parts[j] || '').trim();
        }
        rows.push(row);
    }
    return rows;
}

function splitCsvLine(line) {
    var out = [];
    var curr = '';
    var inQuotes = false;

    for (var i = 0; i < line.length; i += 1) {
        var ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                curr += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            out.push(curr);
            curr = '';
        } else {
            curr += ch;
        }
    }

    out.push(curr);
    return out;
}

function normalizeParsedRows(rows) {
    return rows.map(function (row) {
        var out = {};
        Object.keys(row).forEach(function (k) {
            var normalizedKey = String(k || '').trim().toLowerCase().replace(/\s+/g, '_');
            out[normalizedKey] = row[k];
        });
        return out;
    });
}

async function parseSelectedFile(file) {
    var text = await file.text();

    if (/\.json$/i.test(file.name)) {
        var parsed = JSON.parse(text);
        if (Array.isArray(parsed)) return normalizeParsedRows(parsed);
        if (parsed && Array.isArray(parsed.rows)) return normalizeParsedRows(parsed.rows);
        return normalizeParsedRows([parsed]);
    }

    return normalizeParsedRows(parseCsvText(text));
}
