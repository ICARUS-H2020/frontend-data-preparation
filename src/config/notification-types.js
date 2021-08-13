export default {
    REQUEST: {
        title: () => 'New Contract Request',
        body: (meta) => `A contract inquire was made by "${meta.senderName}" for "${meta.assetName}".`,
    },
    REQUEST_REJECTED: {
        title: () => 'Request Rejected',
        body: (meta) => `Your request to buy "${meta.assetName}" was rejected by "${meta.senderName}".`,
    },
    CONTRACT_OFFERED: {
        title: () => 'Contract Offered',
        body: (meta) => `A draft contract was sent by "${meta.senderName}" for "${meta.assetName}".`,
    },
    CONTRACT_ACCEPTED: {
        title: () => 'Contract Accepted',
        body: (meta) => `Your contract for "${meta.assetName}" was accepted by "${meta.senderName}".`,
    },
    CONTRACT_REJECTED: {
        title: () => 'Contract Rejected',
        body: (meta) => `Your contract for "${meta.assetName}" was rejected by "${meta.senderName}".`,
    },
    CONTRACT_PAID: {
        title: () => 'Contract Activated',
        body: (meta) =>
            `Your contract for "${meta.assetName}" was marked as paid by "${meta.senderName}", and you have access to the data as aggreed.`,
    },
    CONTRACT_NEGOTIATED: {
        title: () => 'Contract Negotiated',
        body: (meta) => `"${meta.senderName}" negotiated your offered contract for "${meta.assetName}".`,
    },
    CONTRACT_COUNTERED: {
        title: () => 'Contract Countered',
        body: (meta) => `The negotiated contract for "${meta.assetName}" was countered by "${meta.senderName}".`,
    },
    CONTRACT_OFFER_REJECTED: {
        title: () => 'Contract Offer Rejected',
        body: (meta) => `Your negotiated contract for "${meta.assetName}" was rejected by "${meta.senderName}".`,
    },
    CONTRACT_OFFER_ACCEPTED: {
        title: () => 'Contract Offer Accepted',
        body: (meta) => `Your negotiated contract for "${meta.assetName}" was accepted by "${meta.senderName}".`,
    },
    JOB_STARTED: {
        title: () => 'Analytic Job Started',
        body: (meta) => `Your analytic job named "${meta.jobName}" started.`,
    },
    JOB_COMPLETED: {
        title: () => 'Analytic Job Completed',
        body: (meta) => `Your analytic job named "${meta.jobName}" completed successfully.`,
    },
    JOB_FAILED: {
        title: () => 'Analytic Job Failed',
        body: (meta) => `Your analytic job named "${meta.jobName}" failed.`,
    },
    DATA_CHECKIN_JOB_COMPLETED: {
        title: () => 'Data Check-in Job Completed',
        body: (meta) => `Your data check-in job named "${meta.dataCheckinJobName}" completed successfully.`,
    },
    DATA_CHECKIN_JOB_FAILED: {
        title: () => 'Data Check-in Job Failed',
        body: (meta) => `Your data check-in job named "${meta.dataCheckinJobName}" failed.`,
    },
    DATASET_ADDED: {
        title: () => 'Info - New dataset',
        body: (meta) => `A dataset named "${meta.assetName}" has been added by "${meta.senderName}".`,
    },
    DATA_ASSET_UPDATE_COMPLETED: {
        title: () => 'Dataset Update Completed',
        body: (meta) => `Your dataset named "${meta.assetName}" has been updated.`,
    },
    DATA_ASSET_UPDATE_FAILED: {
        title: () => 'Dataset Update Failed',
        body: (meta) => `Your dataset named "${meta.assetName}" failed to update.`,
    },
    INFORM_DATASET_UPDATED: {
        title: () => 'Info - Dataset Updated',
        body: (meta) => `A dataset named "${meta.assetName}" has been updated by "${meta.senderName}".`,
    },
    DATASET_DOWNLOAD_COMPLETED_VALID: {
        title: () => 'Available Dataset Download Link',
        body: (meta) => `You can download the dataset named "${meta.assetName}" on the link: `,
        link: (meta) => `${meta.downloadLink}`,
    },
    DATASET_DOWNLOAD_COMPLETED_INVALID: {
        title: () => 'Available Dataset Download Link',
        body: (meta) =>
            `The downloable link for the dataset named "${meta.assetName}" is no longer available. If you would like to download it, please request for a new link.`,
    },
    DATASET_DOWNLOAD_FAILED: {
        title: () => 'Dataset Download Failed',
        body: (meta) =>
            `The request you made to download the dataset named "${meta.assetName}" has unfortunately failed.`,
    },
    SUGGESTION_PROPOSED: {
        title: () => 'Suggestion Proposed',
        body: (meta) => `Your suggestion with name "${meta.title}" has been proposed.`,
    },
    SUGGESTION_ACCEPTED: {
        title: () => 'Suggestion Accepted',
        body: (meta) => `Your suggestion with name "${meta.title}" has been accepted.`,
    },
    SUGGESTION_REJECTED: {
        title: () => 'Suggestion Rejected',
        body: (meta) => `Your suggestion with name "${meta.title}" has been rejected.`,
    },
    OTHER: {
        title: (meta) => `${meta.notificationTitle}`,
        body: () => '',
    },
};
