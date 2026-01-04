import https from "https";
import http from "http";

export interface RedirectRoute {
  name: string;
  path: string;
  destination: string;
}

export interface ValidationResult {
  route: string;
  destination: string;
  status: number | null;
  isHealthy: boolean;
  lastChecked: Date;
  error?: string;
}

// Define all redirect routes to monitor
export const REDIRECT_ROUTES: RedirectRoute[] = [
  {
    name: "Support Redirect",
    path: "/support-redirect/",
    destination: "https://forms.monday.com/forms/236f7d6c52a0be10dd9a6541dfc318e9?r=use1",
  },
  {
    name: "Student Cribs Fault Report",
    path: "/Student-Cribs-Fault-Report/",
    destination: "https://wkf.ms/4dfAxf7",
  },
  {
    name: "UrbanRest Support Redirect",
    path: "/urbanrest-support-redirect/",
    destination: "https://forms.monday.com/forms/354bc6605fbffcfc231c6c54b88c69e9?r=use1",
  },
  {
    name: "Resooma Support Redirect",
    path: "/resooma-support-redirect/",
    destination: "https://forms.monday.com/forms/d94222cdbf7f7ad9647ba19a9be84e53?r=use1",
  },
];

// Cache for validation results
let validationCache: Map<string, ValidationResult> = new Map();

/**
 * Validate a single URL by making a HEAD request
 */
async function validateUrl(url: string): Promise<{ status: number | null; error?: string }> {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    const timeout = 10000; // 10 second timeout

    const request = protocol.request(
      url,
      {
        method: "HEAD",
        timeout,
      },
      (response) => {
        // Accept 2xx, 3xx, 4xx status codes as "reachable"
        // Only 5xx or connection errors are considered unhealthy
        const isHealthy = response.statusCode! < 500;
        resolve({
          status: response.statusCode || null,
          error: isHealthy ? undefined : `Server returned ${response.statusCode}`,
        });
      }
    );

    request.on("error", (error) => {
      resolve({
        status: null,
        error: error.message,
      });
    });

    request.on("timeout", () => {
      request.destroy();
      resolve({
        status: null,
        error: "Request timeout",
      });
    });

    request.end();
  });
}

/**
 * Validate all redirect destinations
 */
export async function validateAllRedirects(): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (const route of REDIRECT_ROUTES) {
    const { status, error } = await validateUrl(route.destination);
    const isHealthy = status !== null && status < 500;

    const result: ValidationResult = {
      route: route.path,
      destination: route.destination,
      status,
      isHealthy,
      lastChecked: new Date(),
      error,
    };

    results.push(result);
    validationCache.set(route.path, result);
  }

  return results;
}

/**
 * Get cached validation results
 */
export function getCachedResults(): ValidationResult[] {
  return Array.from(validationCache.values());
}

/**
 * Get validation result for a specific route
 */
export function getRouteStatus(path: string): ValidationResult | undefined {
  return validationCache.get(path);
}

/**
 * Check if any redirects are unhealthy
 */
export function hasUnhealthyRedirects(): boolean {
  return Array.from(validationCache.values()).some((result) => !result.isHealthy);
}

/**
 * Get list of unhealthy redirects
 */
export function getUnhealthyRedirects(): ValidationResult[] {
  return Array.from(validationCache.values()).filter((result) => !result.isHealthy);
}
