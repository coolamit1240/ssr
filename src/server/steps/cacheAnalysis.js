import cache from '../utils/cache';
import { NOT_FOUND_URL } from '../../shared/constants';
import logger from '../../shared/utils/logger';

// Impure function
/* eslint-disable no-param-reassign */
const cacheAnalysis = (stepResults) => {
  if (stepResults.hasUnwantedQueryParameters) return;
  const platform = stepResults.store.getState().platform;
  if (!cache.has(platform, stepResults.url)) {
    stepResults.isFromCache = false;
    logger.debug('cache missed: url:', platform, stepResults.url);
    return;
  }
  // check if user locale changed between requests
  if (stepResults.i18n && !cache.getLanguage(stepResults.req.language)) {
    stepResults.isFromCache = false;
    logger.debug('cache missed: lang:', stepResults.req.language);
    return;
  }
  const cached = cache.get(platform, stepResults.url);
  logger.debug('cache hit: type:', cached.type);
  stepResults.isFromCache = true;
  switch (cached.type) {
    case 200:
      stepResults.statusCode = 200;
      stepResults.hash = cached.hash;
      stepResults.html = cached.html;
      break;
    case 301:
      stepResults.statusCode = 301;
      stepResults.Location = cached.location;
      break;
    case 404:
      // URL is a 404 but we need to check if a NotFound page has been
      //  rendered for this platform
      if (cache.has(platform, NOT_FOUND_URL)) {
        const notFoundCached = cache.get(platform, NOT_FOUND_URL);
        stepResults.statusCode = 404;
        stepResults.html = notFoundCached.html;
      } else {
        // No rendered page for this platform, ensure that this page will
        //  get rendered and cache
        stepResults.isFromCache = false;
      }
      break;
    default:
  }
};
export default cacheAnalysis;