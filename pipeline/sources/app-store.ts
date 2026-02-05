/**
 * Apple App Store RSS Feed
 * Free, no authentication required
 * Fetches customer reviews for mobile banking apps
 */

import { CompanyConfig } from "../config.js";

export interface AppStoreReview {
  id: string;
  title: string;
  content: string;
  rating: number;
  author: string;
  date: string;
  version: string;
}

export interface AppStoreData {
  company: string;
  ticker: string;
  appName: string;
  averageRating: number;
  reviewCount: number;
  reviews: AppStoreReview[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAppStoreReviews(
  company: CompanyConfig,
  country: string = "us"
): Promise<AppStoreData | null> {
  if (!company.appStoreId) {
    console.log(`Skipping ${company.name} - no App Store ID`);
    return null;
  }

  try {
    await delay(100); // Be polite

    // Apple's RSS feed for app reviews
    const url = `https://itunes.apple.com/${country}/rss/customerreviews/id=${company.appStoreId}/sortBy=mostRecent/json`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`App Store API error for ${company.name}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.feed || !data.feed.entry) {
      console.log(`No reviews found for ${company.name}`);
      return null;
    }

    const entries = Array.isArray(data.feed.entry) ? data.feed.entry : [data.feed.entry];

    // First entry is app metadata, rest are reviews
    const appEntry = entries[0];
    const reviewEntries = entries.slice(1);

    const reviews: AppStoreReview[] = reviewEntries.map((entry: any) => ({
      id: entry.id?.label || "",
      title: entry.title?.label || "",
      content: entry.content?.label || "",
      rating: parseInt(entry["im:rating"]?.label || "0", 10),
      author: entry.author?.name?.label || "Anonymous",
      date: entry.updated?.label || "",
      version: entry["im:version"]?.label || "",
    }));

    // Calculate average rating from reviews
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    const result: AppStoreData = {
      company: company.name,
      ticker: company.ticker,
      appName: appEntry["im:name"]?.label || company.name,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
      reviews: reviews.slice(0, 50), // Keep top 50 most recent
    };

    console.log(
      `Found ${reviews.length} reviews for ${company.name} (avg: ${result.averageRating}/5)`
    );

    return result;
  } catch (error) {
    console.error(`Error fetching App Store reviews for ${company.name}:`, error);
    return null;
  }
}

// Get reviews from Canadian store for Canadian companies
export async function fetchAppStoreReviewsForCompany(
  company: CompanyConfig
): Promise<AppStoreData | null> {
  const country = company.country === "CA" ? "ca" : "us";
  return fetchAppStoreReviews(company, country);
}
