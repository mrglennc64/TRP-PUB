/* /publishing-engine.js — client-side twin of the stateless publishing scan.
   Same rules as api/services/publishing_engine.py. Runs entirely in the browser so
   no contributor names / IPIs leave the user's machine. Exposes window.RoyaPub.

   Usage:
     const result = RoyaPub.scan({
       artist: { publisher_name: 'Nordic Songs' },
       works: [{ work_id, title, iswc, contributors: [{name, role, share, ipi}, ...] }],
       name_variants: { 'M. Martin': 'Martin Sandberg' }  // optional
     });
*/
(function(global){
    'use strict';

    var ISSUE_DEDUCTIONS = {
        missing_iswc: 20,
        missing_ipi: 25,
        split_sum_error: 30,
        duplicate_writer: 20,
        missing_publisher: 15
    };
    var ISSUE_SEVERITY = {
        missing_iswc: 'medium',
        missing_ipi: 'high',
        split_sum_error: 'high',
        duplicate_writer: 'high',
        missing_publisher: 'low'
    };
    var ISSUE_DESCRIPTION = {
        missing_iswc: 'No ISWC registered for this work',
        missing_ipi: 'One or more contributors have no IPI',
        split_sum_error: 'Contributor shares do not sum to 100',
        duplicate_writer: 'Duplicate writer name detected',
        missing_publisher: 'No publisher set on the artist profile'
    };
    var TASK_LABELS = {
        missing_iswc:      ['add_iswc',                  "Add ISWC for '{title}'"],
        missing_ipi:       ['add_ipi',                   "Add IPI for contributors on '{title}'"],
        split_sum_error:   ['confirm_split',             "Confirm splits for '{title}'"],
        duplicate_writer:  ['resolve_duplicate_writer',  "Resolve duplicate writer on '{title}'"],
        missing_publisher: ['add_publisher',             "Add publisher for '{title}'"]
    };

    function cleanName(name, variants){
        if (!name) return ['', 0.0];
        var raw = String(name).trim();
        if (variants && Object.prototype.hasOwnProperty.call(variants, raw)) return [variants[raw], 0.98];
        var cleaned = raw.replace(/\s+/g, ' ');
        if (cleaned && cleaned === cleaned.toUpperCase()){
            cleaned = cleaned.toLowerCase().replace(/\b\w/g, function(c){ return c.toUpperCase(); });
        }
        return [cleaned, cleaned === raw ? 1.0 : 0.85];
    }

    function normalizeContributors(contribs, variants){
        return (contribs || []).map(function(c){
            var raw = String(c.name || c.name_raw || '').trim();
            var cn = cleanName(raw, variants);
            return {
                name_raw: raw,
                name_clean: cn[0],
                ipi: c.ipi || null,
                role: c.role || null,
                share: (c.share != null ? c.share : c.share_percent),
                society: c.society || null,
                confidence: Math.round(cn[1] * 1000) / 1000
            };
        });
    }

    function detectIssues(work, artist){
        var issues = [];
        var contribs = work.contributors || [];
        if (!work.iswc) issues.push('missing_iswc');
        if (contribs.some(function(c){ return !String(c.ipi || '').trim(); })) issues.push('missing_ipi');
        var total = contribs.reduce(function(a, c){ return a + (parseFloat(c.share) || 0); }, 0);
        if (contribs.length && Math.abs(total - 100) > 0.1) issues.push('split_sum_error');
        var seen = {};
        for (var i = 0; i < contribs.length; i++){
            var nm = String(contribs[i].name || contribs[i].name_raw || '').trim().toLowerCase();
            if (nm && seen[nm]) { issues.push('duplicate_writer'); break; }
            if (nm) seen[nm] = 1;
        }
        if (!(artist && artist.publisher_name)) issues.push('missing_publisher');
        return issues;
    }

    function computeWorkScore(issues){
        var s = 100;
        issues.forEach(function(i){ s -= (ISSUE_DEDUCTIONS[i] || 0); });
        return Math.max(0, s);
    }

    function workStatus(score){
        if (score > 85) return 'ready';
        if (score > 60) return 'needs_attention';
        return 'blocked';
    }

    function computeArtistScore(scores){
        if (!scores.length) return 0;
        return Math.round(scores.reduce(function(a,b){return a+b;}, 0) / scores.length);
    }

    function generateTasks(issues, title){
        var out = [];
        issues.forEach(function(i){
            var m = TASK_LABELS[i]; if (!m) return;
            out.push({ task_type: m[0], label: m[1].replace('{title}', title || '(untitled)') });
        });
        return out;
    }

    function scan(payload){
        var artist = (payload && payload.artist) || {};
        var works = (payload && payload.works) || [];
        var variants = (payload && payload.name_variants) || null;

        var workResults = [];
        var tasks = [];
        var byWork = {};

        works.forEach(function(w){
            var wid = w.work_id || w.id;
            var title = w.title || '';
            var issueTypes = detectIssues(w, artist);
            var score = computeWorkScore(issueTypes);
            byWork[wid] = normalizeContributors(w.contributors || [], variants);
            workResults.push({
                work_id: wid, title: title,
                health_score: score, status: workStatus(score),
                issues: issueTypes.map(function(t){
                    return { issue_type: t, severity: ISSUE_SEVERITY[t] || 'medium', description: ISSUE_DESCRIPTION[t] || t };
                })
            });
            tasks = tasks.concat(generateTasks(issueTypes, title));
        });

        return {
            publishing_health_score: computeArtistScore(workResults.map(function(w){return w.health_score;})),
            works: workResults,
            tasks: tasks,
            normalized_metadata: { by_work: byWork }
        };
    }

    global.RoyaPub = {
        scan: scan,
        normalizeContributors: normalizeContributors,
        detectIssues: detectIssues,
        computeWorkScore: computeWorkScore,
        computeArtistScore: computeArtistScore,
        generateTasks: generateTasks
    };
})(typeof window !== 'undefined' ? window : this);
