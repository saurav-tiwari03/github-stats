// Language statistics for display in charts
export interface LanguageStat {
    name: string;
    value: number;
    color: string;
    percent: number | string;
    rawBytes?: number;
}

// Base profile info shared between user and repo profiles
export interface BaseProfile {
    login: string;
    name: string;
    avatar_url: string;
    bio: string | null;
    html_url?: string;
}

// User-specific profile fields
export interface UserProfile extends BaseProfile {
    public_repos: number;
    followers: number;
}

// Repository-specific profile fields
export interface RepoProfile extends BaseProfile {
    stargazers_count: number;
    forks_count: number;
}

// Combined profile type for use in components
export type Profile = UserProfile | RepoProfile;

// Data structure returned after analyzing a user or repo
export interface AnalysisData {
    profile: Profile;
    stats: LanguageStat[];
}

// Search type enum
export type SearchType = 'user' | 'repo';

// Props for the DonutChart component
export interface DonutChartProps {
    data: LanguageStat[] | null;
    size?: number;
}

// Props for the StatsCard component
export interface StatsCardProps {
    stats: LanguageStat[] | null;
    profile: Profile;
    loading: boolean;
    type: SearchType;
}

// GitHub API response types (partial, for the fields we use)
export interface GitHubUser {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    html_url: string;
}

export interface GitHubRepoOwner {
    login: string;
    avatar_url: string;
}

export interface GitHubRepo {
    name: string;
    description: string | null;
    language: string | null;
    size: number;
    fork: boolean;
    html_url: string;
    owner: GitHubRepoOwner;
    stargazers_count: number;
    forks_count: number;
}

export interface GitHubLanguages {
    [language: string]: number;
}

// GitHub colors type
export interface GithubColorsMap {
    [key: string]: string;
}
