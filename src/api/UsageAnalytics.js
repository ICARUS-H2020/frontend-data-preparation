import { usageanalytics, secured, flask } from './axios';

const resource = '/admin';

export default {
    getDataAsset: (assetId) => secured.get(`/data-asset/${assetId}`),

    // only usable by admin
    countStats: () => usageanalytics.get(`${resource}/count-stats`),

    eventTimeline: (event) => usageanalytics.get(`${resource}/timeline?event_type=${event}`),

    timelineActiveUsers: () => usageanalytics.get(`${resource}/timeline-active-users`),

    dataAssetPreferencePerCategory: () => usageanalytics.get(`${resource}/category-preferences`),

    dataAssetPerVelocity: () => usageanalytics.get(`${resource}/data-asset-per-velocity`),

    dataAssetPerFrequency: () => usageanalytics.get(`${resource}/data-asset-per-frequency`),

    dataAssetPerCalculationScheme: () => usageanalytics.get(`${resource}/data-asset-per-calculation-scheme`),

    organizationPerCountry: () => usageanalytics.get(`${resource}/organization-per-country`),

    mostPopularBrowsers: () => usageanalytics.get(`${resource}/most-popular-browsers`),

    // usable by user

    timelineAllDatasetEvents: () => usageanalytics.get(`${resource}/timeline-all-data-asset-events`), // general

    userDataAssetEvents: () => usageanalytics.get(`${resource}/user-data-asset-events`), // general

    dataAssetEvents: () => usageanalytics.get(`${resource}/data-asset-events`), // get all datasets

    timelineDatasetEvents: (reqAssetId) =>
        usageanalytics.get(`${resource}/timeline-data-asset-events?req_asset_id=${reqAssetId}`), // for a specific dataset

    popularCategoryAssets: (event) => usageanalytics.get(`${resource}/popular-category-datasets?event_type=${event}`),

    dataAssetsPerCategory: () => usageanalytics.get(`${resource}/data-assets-per-category`),

    publish: (payload) => flask.post('/usage-analytics/publish', payload),
};
