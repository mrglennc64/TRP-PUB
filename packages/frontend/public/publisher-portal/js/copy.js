/*
 * TrapRoyaltiesPro Publisher Portal — micro-copy library
 *
 * Single source of truth for button labels, tooltips, banner messages,
 * and reassurance strings that repeat across the portal. Keep copy here
 * (not inline) so wording stays consistent and editable in one place.
 *
 * Usage (vanilla HTML):
 *   <script src="/publisher-portal/js/copy.js"></script>
 *   <button data-copy="buttons.beginCleaning"></button>
 *   <script>TRPCopy.apply();</script>
 *
 * Or by hand: TRPCopy.t('buttons.beginCleaning')
 */
(function (global) {
  var COPY = {
    buttons: {
      scanCatalog:        'Scan Your Catalog',
      runFullScan:        'Run Full Catalog Scan',
      downloadReport:     'Download Scan Report (CSV)',
      requestCleaning:    'Request Full Catalog Cleaning',
      beginCleaning:      'Begin Full-Service Cleaning',
      completePayment:    'Complete Payment & Start Cleaning',
      returnDashboard:    'Return to Dashboard',
      viewCleaningStatus: 'View Cleaning Status',
      bookDemo:           'Book a Walkthrough',
      contactUs:          'Contact Us',
      backToPortal:       'Back to Publisher Portal'
    },

    tooltips: {
      iswc:            'International Standard Musical Work Code — uniquely identifies a composition.',
      isrc:            'International Standard Recording Code — identifies a specific recording.',
      ipi:             'IPI / CAE number — uniquely identifies a writer or publisher to PROs.',
      splitShare:      'Ownership percentages must total 100% per work. Mismatches block royalty flow.',
      cwr:             'Common Works Registration — the CISAC standard file used to register works with PROs.',
      healthReport:    'A line-by-line record of every metadata correction applied during cleaning.',
      fixLaterTasks:   'Optional follow-up items your internal team can tackle after cleaning completes.',
      submissionReady: 'Passes CWR v2.1 validation and aligns with the submission rules of your primary society.',
      secureDelivery:  'Delivered via encrypted download link. Working copies are deleted after confirmation.'
    },

    banners: {
      demoMode:        'You are viewing sample data. Connect a catalog to run a real scan.',
      scanInProgress:  'Your catalog scan is running — results will appear here when ready.',
      scanComplete:    'Scan complete. Review findings below or request full-service cleaning.',
      paymentRequired: 'Full cleaning requires payment. Review the service agreement before proceeding.',
      cleaningQueued:  'Your catalog is in the cleaning queue. Estimated delivery in 5–10 business days.',
      cleaningReady:   'Your cleaned catalog package is ready for download.',
      sessionExpired:  'Your session expired. Please sign in again to continue.',
      maintenance:     'Scheduled maintenance in progress — some features may be temporarily unavailable.'
    },

    reassurance: {
      dataSecure:      'Your data is handled securely and confidentially.',
      paymentAcceptsTerms:
                       'Payment constitutes acceptance of the Service Agreement.',
      cancelAnytime:   'Cancel before work begins for a full refund.',
      noChanges:       'No automatic changes to your catalog without your approval.',
      encrypted:       'All transfers are encrypted in transit and at rest.'
    },

    empty: {
      noWorks:         'No works uploaded yet. Upload a CWR, DDEX, or Excel file to begin.',
      noIssues:        'No issues detected in this view.',
      noResults:       'No matching results. Try adjusting your filters.',
      tableTruncated:  'Showing first 500 rows. Full dataset available after full-service cleaning.'
    },

    errors: {
      generic:         'Something went wrong. Please try again or contact support.',
      uploadFailed:    'Upload failed. Check the file format and try again.',
      fileTooBig:      'File exceeds the size limit. Contact us for large-catalog handling.',
      unauthorized:    'You are not authorized to view this. Please sign in.',
      paymentFailed:   'Payment could not be processed. No charge was made. Please try again.'
    }
  };

  function get(path) {
    return path.split('.').reduce(function (o, k) {
      return (o && o[k] != null) ? o[k] : null;
    }, COPY);
  }

  function apply(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-copy]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var val = get(el.getAttribute('data-copy'));
      if (val == null) continue;
      var attr = el.getAttribute('data-copy-attr');
      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    }
  }

  global.TRPCopy = {
    all: COPY,
    t: get,
    apply: apply
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = global.TRPCopy;
  }
})(typeof window !== 'undefined' ? window : this);
