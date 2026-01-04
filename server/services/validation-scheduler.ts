import { validateAllRedirects, getUnhealthyRedirects } from "./url-validation";

// Store validation schedule state
let validationInterval: NodeJS.Timeout | null = null;
let isValidationRunning = false;

/**
 * Start periodic URL validation
 * Runs every 30 minutes by default
 */
export function startValidationScheduler(intervalMinutes: number = 30) {
  if (validationInterval) {
    console.log("[URL Validation] Scheduler already running");
    return;
  }

  console.log(`[URL Validation] Starting scheduler - validation every ${intervalMinutes} minutes`);

  // Run validation immediately on startup
  runValidation().catch(console.error);

  // Then schedule recurring validations
  validationInterval = setInterval(() => {
    runValidation().catch(console.error);
  }, intervalMinutes * 60 * 1000);
}

/**
 * Stop the validation scheduler
 */
export function stopValidationScheduler() {
  if (validationInterval) {
    clearInterval(validationInterval);
    validationInterval = null;
    console.log("[URL Validation] Scheduler stopped");
  }
}

/**
 * Run validation and handle results
 */
async function runValidation() {
  if (isValidationRunning) {
    console.log("[URL Validation] Validation already in progress, skipping");
    return;
  }

  isValidationRunning = true;
  const startTime = Date.now();

  try {
    console.log("[URL Validation] Starting validation check...");
    const results = await validateAllRedirects();
    const unhealthy = getUnhealthyRedirects();
    const duration = Date.now() - startTime;

    console.log(`[URL Validation] Validation complete in ${duration}ms`);
    console.log(`[URL Validation] Results: ${results.length} routes checked`);

    // Log results for each route
    results.forEach((result) => {
      const status = result.isHealthy ? "✓ HEALTHY" : "✗ UNHEALTHY";
      console.log(
        `[URL Validation] ${status} - ${result.route} (${result.destination}) - Status: ${result.status || "ERROR"}`
      );
    });

    // Alert if any redirects are unhealthy
    if (unhealthy.length > 0) {
      console.warn(`[URL Validation] ⚠️  ${unhealthy.length} unhealthy redirect(s) detected:`);
      unhealthy.forEach((result) => {
        console.warn(`  - ${result.route}: ${result.error || `HTTP ${result.status}`}`);
      });

      // TODO: Send alert notification (email, Slack, etc.)
      // await sendAlertNotification(unhealthy);
    } else {
      console.log("[URL Validation] ✓ All redirects are healthy");
    }
  } catch (error) {
    console.error("[URL Validation] Validation failed:", error);
  } finally {
    isValidationRunning = false;
  }
}

/**
 * Manually trigger validation (for admin endpoints)
 */
export async function triggerManualValidation() {
  if (isValidationRunning) {
    throw new Error("Validation already in progress");
  }

  return runValidation();
}

/**
 * Get current scheduler status
 */
export function getSchedulerStatus() {
  return {
    isRunning: validationInterval !== null,
    isValidating: isValidationRunning,
  };
}
