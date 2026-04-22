/* /mb-lookup.js — MusicBrainz IPI lookup helper for HeyRoya
   Direct browser → MusicBrainz API calls. MB allows CORS on GET; rate limit ~1 req/sec.
   Used by split-verification.html and pages/review.html (Cleaning Wizard normalize step). */
(function(global){
    'use strict';
    var MB_BASE = 'https://musicbrainz.org/ws/2';
    var MIN_GAP_MS = 1100; // MB rate limit: 1 req/sec
    var lastCall = 0;

    function rateLimit(){
        return new Promise(function(resolve){
            var now = Date.now();
            var wait = Math.max(0, lastCall + MIN_GAP_MS - now);
            lastCall = now + wait;
            setTimeout(resolve, wait);
        });
    }

    async function mbFetch(path){
        await rateLimit();
        var r = await fetch(MB_BASE + path, { headers: { 'Accept': 'application/json' } });
        if (!r.ok) throw new Error('MusicBrainz HTTP ' + r.status);
        return r.json();
    }

    async function searchArtist(name){
        if (!name || !name.trim()) return [];
        var q = encodeURIComponent('artist:' + name.trim());
        var data = await mbFetch('/artist?query=' + q + '&fmt=json&limit=5');
        return (data.artists || []).map(function(a){
            return {
                id: a.id, name: a.name, score: a.score,
                country: a.country, type: a.type, disambiguation: a.disambiguation
            };
        });
    }

    async function getArtistIpi(mbid){
        var data = await mbFetch('/artist/' + mbid + '?inc=ipis&fmt=json');
        return {
            mbid: data.id, name: data.name, ipis: data.ipis || [],
            country: data.country, disambiguation: data.disambiguation, type: data.type
        };
    }

    async function searchWork(title){
        if (!title || !title.trim()) return [];
        var q = encodeURIComponent('work:' + title.trim());
        var data = await mbFetch('/work?query=' + q + '&fmt=json&limit=5');
        return (data.works || []).map(function(w){
            var credits = (w['artist-credit'] || []).map(function(a){
                return (a.artist && a.artist.name) ? a.artist.name : (a.name || '');
            }).filter(Boolean);
            return {
                id: w.id, title: w.title, score: w.score,
                iswcs: w.iswcs || [], type: w.type,
                disambiguation: w.disambiguation, artists: credits
            };
        });
    }

    async function getWorkIswc(mbid){
        var data = await mbFetch('/work/' + mbid + '?fmt=json');
        return { mbid: data.id, title: data.title, iswcs: data.iswcs || [], type: data.type };
    }

    /* lookupIswc(title) — combined search + ISWC fetch.
       Returns: { iswc, title, mbid, score, source } | { no_iswc:true, ... } | { uncertain:true, candidates:[...] } | { no_match:true } */
    async function lookupIswc(title){
        var results = await searchWork(title);
        if (!results.length) return { no_match: true };
        var top = results[0];
        if (top.score < 80) return { uncertain: true, candidates: results.slice(0, 5) };
        var source = 'MusicBrainz Work Registry';
        if (!top.iswcs.length){
            return { no_iswc: true, title: top.title, mbid: top.id, score: top.score,
                     source: source, disambiguation: top.disambiguation, artists: top.artists };
        }
        return { iswc: top.iswcs[0], title: top.title, mbid: top.id, score: top.score,
                 source: source, disambiguation: top.disambiguation, artists: top.artists };
    }

    /* lookupIpi(name) — combined search + IPI fetch.
       Returns one of:
         { ipi, name, mbid, score, source }            confident match (score ≥ 80)
         { no_ipi:true, name, mbid, score, source }    matched artist but no IPI on file
         { uncertain:true, candidates:[...] }          top match score < 80
         { no_match:true }                             no results
       Throws on network/API error. */
    async function lookupIpi(name){
        var results = await searchArtist(name);
        if (!results.length) return { no_match: true };
        var top = results[0];
        if (top.score < 80) return { uncertain: true, candidates: results.slice(0, 5) };
        var detail = await getArtistIpi(top.id);
        var source = 'MusicBrainz IPI Registry' + (detail.country ? ' · ' + detail.country : '');
        if (!detail.ipis.length){
            return { no_ipi: true, name: detail.name, mbid: detail.mbid,
                     score: top.score, source: source, disambiguation: detail.disambiguation };
        }
        return { ipi: detail.ipis[0], name: detail.name, mbid: detail.mbid,
                 score: top.score, source: source, disambiguation: detail.disambiguation };
    }

    global.RoyaMB = {
        searchArtist: searchArtist, getArtistIpi: getArtistIpi, lookupIpi: lookupIpi,
        searchWork: searchWork, getWorkIswc: getWorkIswc, lookupIswc: lookupIswc
    };
})(typeof window !== 'undefined' ? window : this);
