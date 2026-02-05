import { useState, useEffect, type FormEvent } from 'react';
import { Search, Github, AlertCircle, Loader2, PieChart, Info, ExternalLink, Code2, Database, Star, GitFork } from 'lucide-react';
import type {
  LanguageStat,
  AnalysisData,
  SearchType,
  DonutChartProps,
  StatsCardProps,
  GitHubUser,
  GitHubRepo,
  GitHubLanguages,
  GithubColorsMap,
  RepoProfile
} from './types';

// --- Configuration & Constants ---

const GITHUB_COLORS: GithubColorsMap = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Vue: '#41b883',
  React: '#61dafb',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  PowerShell: '#012456',
  Solidity: '#AA6746',
  Lua: '#000080',
  Svelte: '#ff3e00',
  Elixir: '#6e4a7e',
  Haskell: '#5e5086',
  Scala: '#c22d40',
  Perl: '#0298c3',
  R: '#198ce7',
};

// Fallback color generator for unknown languages
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const MOCK_DATA: AnalysisData = {
  profile: {
    login: "demo-user",
    name: "Demo Developer",
    avatar_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    bio: "This is mock data to show how the app looks when the API rate limit is hit.",
    public_repos: 42,
    followers: 128
  },
  stats: [
    { name: "JavaScript", value: 45000, color: GITHUB_COLORS.JavaScript, percent: 35.5 },
    { name: "Python", value: 32000, color: GITHUB_COLORS.Python, percent: 25.2 },
    { name: "TypeScript", value: 28000, color: GITHUB_COLORS.TypeScript, percent: 22.1 },
    { name: "HTML", value: 12000, color: GITHUB_COLORS.HTML, percent: 9.5 },
    { name: "CSS", value: 8000, color: GITHUB_COLORS.CSS, percent: 6.3 },
    { name: "Other", value: 1800, color: "#8b949e", percent: 1.4 }
  ]
};

// --- Components ---

const DonutChart = ({ data, size = 200 }: DonutChartProps) => {
  const center = size / 2;
  const strokeWidth = 20;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  // If no data, show empty ring
  if (!data || data.length === 0) {
    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#30363d"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#30363d"
          strokeWidth={strokeWidth}
        />
        {/* Data Segments */}
        {data.map((item) => {
          const percentValue = typeof item.percent === 'string' ? parseFloat(item.percent) : item.percent;
          const dashArray = (percentValue / 100) * circumference;
          const offset = currentOffset;
          currentOffset -= dashArray; // Move backwards for next segment

          // Ensure tiny segments are at least visible or filtered out before this
          if (percentValue <= 0) return null;

          return (
            <circle
              key={item.name}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashArray} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              className="transition-all duration-1000 ease-out hover:opacity-80"
            >
              <title>{`${item.name}: ${item.percent}%`}</title>
            </circle>
          );
        })}
      </svg>
      {/* Center Label (Optional) */}
      <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-3xl font-bold text-gray-200">{data.length}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider">Langs</span>
      </div>
    </div>
  );
};

const StatsCard = ({ stats, profile, loading, type }: StatsCardProps) => {
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto h-96 flex flex-col items-center justify-center text-gray-400 bg-[#0d1117] border border-[#30363d] rounded-xl animate-pulse">
        <Loader2 size={48} className="animate-spin mb-4 text-[#58a6ff]" />
        <p>Crunching the numbers...</p>
      </div>
    );
  }

  if (!stats) return null;
  const isRepo = type === 'repo';

  // Type guard for repo profile
  const repoProfile = profile as RepoProfile;

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#58a6ff]/50">
      {/* Header */}
      <div className="p-6 border-b border-[#30363d] bg-[#161b22] flex flex-col sm:flex-row items-center gap-6">
        <img
          src={profile.avatar_url}
          alt={profile.name || profile.login}
          className={`w-20 h-20 border-2 border-[#30363d] shadow-lg ${isRepo ? 'rounded-md' : 'rounded-full'}`}
        />
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            {profile.name || profile.login}
            <a
              href={isRepo ? profile.html_url : `https://github.com/${profile.login}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-[#58a6ff] transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          </h2>
          <p className="text-gray-400 text-sm mb-2">@{profile.login}</p>
          <p className="text-gray-300 text-sm line-clamp-2 max-w-lg">{profile.bio || "No description available."}</p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-[#21262d] px-2 py-1 rounded-md">
              {isRepo ? <Star size={12} className="text-yellow-500" /> : <Code2 size={12} />}
              <span>
                {isRepo ? repoProfile.stargazers_count : ('public_repos' in profile ? profile.public_repos : 0)} {isRepo ? 'Stars' : 'Repos'}
              </span>
            </div>
            {isRepo && (
              <div className="flex items-center gap-1 text-xs text-gray-400 bg-[#21262d] px-2 py-1 rounded-md">
                <GitFork size={12} />
                <span>{repoProfile.forks_count} Forks</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-[#21262d] px-2 py-1 rounded-md">
              <Database size={12} />
              <span>{stats.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()} KB Analyzed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Chart */}
        <div className="flex justify-center">
          <DonutChart data={stats} size={240} />
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <h3 className="text-gray-200 font-semibold mb-4 border-b border-[#30363d] pb-2">Top Languages</h3>
          {stats.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shadow-sm"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                  {lang.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 tabular-nums">
                  {(lang.value).toLocaleString()} KB
                </span>
                <span className="text-gray-400 font-bold w-12 text-right tabular-nums">
                  {lang.percent}%
                </span>
              </div>
            </div>
          ))}

          {stats.length === 0 && (
            <p className="text-gray-500 italic text-sm">No language data found.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#161b22] px-6 py-3 text-xs text-gray-500 border-t border-[#30363d] flex justify-between items-center">
        <span>{isRepo ? 'Based on exact byte counts' : 'Based on repository size & primary language'}</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Live Analysis</span>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [searchType, setSearchType] = useState<SearchType>('user');
  const [rateLimitExceeded, setRateLimitExceeded] = useState<boolean>(false);

  // Read URL params on mount and trigger search if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setInputValue(searchQuery);
      analyzeInput(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL params
  const updateURLParams = (query: string): void => {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('search', query);
    } else {
      url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url.toString());
  };

  // Fetch logic
  const analyzeInput = async (targetInput: string): Promise<void> => {
    if (!targetInput) return;

    // Update URL with search query
    updateURLParams(targetInput);

    setLoading(true);
    setError(null);
    setData(null);
    setRateLimitExceeded(false);

    const isRepoSearch = targetInput.includes('/');
    setSearchType(isRepoSearch ? 'repo' : 'user');

    try {
      if (isRepoSearch) {
        // --- REPO MODE ---
        const [owner, repoName] = targetInput.split('/');
        if (!owner || !repoName) throw new Error("Invalid repository format. Use owner/repo");

        // 1. Fetch Repo Details
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
        if (repoRes.status === 403) throw new Error("RATE_LIMIT");
        if (repoRes.status === 404) throw new Error("Repository not found");
        if (!repoRes.ok) throw new Error("Failed to fetch repository");
        const repoData: GitHubRepo = await repoRes.json();

        // 2. Fetch Languages
        const langRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`);
        if (langRes.status === 403) throw new Error("RATE_LIMIT");
        const langData: GitHubLanguages = await langRes.json();

        // 3. Process Stats (Exact Bytes)
        let totalBytes = 0;
        const processedStats = Object.entries(langData).map(([name, bytes]) => {
          totalBytes += bytes;
          return {
            name,
            value: Math.round(bytes / 1024), // Convert to KB for consistency
            rawBytes: bytes,
            color: GITHUB_COLORS[name] || stringToColor(name),
            percent: 0 as number | string // Will be calculated below
          };
        }).sort((a, b) => b.value - a.value);

        // Calculate Percentages
        const finalStats: LanguageStat[] = processedStats.map(stat => ({
          ...stat,
          percent: totalBytes > 0 ? ((stat.rawBytes! / totalBytes) * 100).toFixed(1) : 0
        }));

        setData({
          profile: {
            login: repoData.owner.login,
            avatar_url: repoData.owner.avatar_url,
            name: repoData.name,
            bio: repoData.description,
            html_url: repoData.html_url,
            stargazers_count: repoData.stargazers_count,
            forks_count: repoData.forks_count
          },
          stats: finalStats
        });

      } else {
        // --- USER MODE ---
        // 1. Fetch Profile
        const profileRes = await fetch(`https://api.github.com/users/${targetInput}`);

        if (profileRes.status === 403) throw new Error("RATE_LIMIT");
        if (profileRes.status === 404) throw new Error("User not found");
        if (!profileRes.ok) throw new Error("Failed to fetch profile");

        const profile: GitHubUser = await profileRes.json();

        // 2. Fetch Repos (Limit to 100 most recent)
        const reposRes = await fetch(`https://api.github.com/users/${targetInput}/repos?per_page=100&sort=updated`);
        if (reposRes.status === 403) throw new Error("RATE_LIMIT");
        const repos: GitHubRepo[] = await reposRes.json();

        // 3. Aggregate Stats (Heuristic)
        const rawStats: Record<string, number> = {};
        let totalSize = 0;

        repos.forEach(repo => {
          if (!repo.language || repo.fork) return;
          if (!rawStats[repo.language]) {
            rawStats[repo.language] = 0;
          }
          rawStats[repo.language] += repo.size;
          totalSize += repo.size;
        });

        // 4. Process for Chart
        const processedStats: LanguageStat[] = Object.entries(rawStats)
          .map(([name, value]) => ({
            name,
            value,
            color: GITHUB_COLORS[name] || stringToColor(name),
            percent: 0 as number | string
          }))
          .sort((a, b) => b.value - a.value);

        const topStats = processedStats.slice(0, 5);
        const otherStats = processedStats.slice(5);

        if (otherStats.length > 0) {
          const otherValue = otherStats.reduce((acc, curr) => acc + curr.value, 0);
          topStats.push({
            name: "Other",
            value: otherValue,
            color: "#8b949e",
            percent: 0
          });
        }

        const finalStats: LanguageStat[] = topStats.map(stat => ({
          ...stat,
          percent: totalSize > 0 ? ((stat.value / totalSize) * 100).toFixed(1) : 0
        }));

        setData({
          profile: {
            login: profile.login,
            name: profile.name || profile.login,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            public_repos: profile.public_repos,
            followers: profile.followers
          },
          stats: finalStats
        });
      }

    } catch (err) {
      const error = err as Error;
      if (error.message === "RATE_LIMIT") {
        setRateLimitExceeded(true);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (inputValue.trim()) analyzeInput(inputValue.trim());
  };

  const loadMockData = (): void => {
    setLoading(true);
    setRateLimitExceeded(false);
    setError(null);
    setSearchType('user');
    setTimeout(() => {
      setData(MOCK_DATA);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-gray-100 font-sans p-4 md:p-8 flex flex-col items-center">

      {/* Header */}
      <div className="w-full max-w-3xl mb-12 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-[#161b22] rounded-full border border-[#30363d] shadow-lg mb-2">
          <Github size={32} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-[#58a6ff] to-[#a371f7] bg-clip-text text-transparent">
          GitHub Stats Analyzer
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-lg">
          Generate a visual breakdown of languages for any user or specific repository.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="w-full max-w-lg relative mb-12 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500 group-focus-within:text-[#58a6ff] transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-4 bg-[#0d1117] border border-[#30363d] rounded-full leading-5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#58a6ff] focus:border-transparent transition-all shadow-xl"
          placeholder="username (e.g. facebook) OR owner/repo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-[#238636] hover:bg-[#2ea043] text-white font-medium rounded-full transition-colors flex items-center gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Analyze"}
        </button>
      </form>

      {/* Messages / Errors */}
      {rateLimitExceeded && (
        <div className="w-full max-w-xl bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="text-yellow-500 shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-yellow-500">API Rate Limit Exceeded</h3>
            <p className="text-yellow-200/80 text-sm mt-1">
              GitHub limits unauthenticated requests to 60 per hour. You've hit the limit!
            </p>
            <button
              onClick={loadMockData}
              className="mt-3 text-sm bg-yellow-700/30 hover:bg-yellow-700/50 text-yellow-200 px-3 py-1.5 rounded-md border border-yellow-600/30 transition-colors"
            >
              See Demo Data Instead
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-md bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-8 text-center flex items-center justify-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="w-full">
        {data ? (
          <StatsCard stats={data.stats} profile={data.profile} loading={loading} type={searchType} />
        ) : (
          !loading && !rateLimitExceeded && !error && (
            <div className="text-center text-gray-600 py-12">
              <PieChart size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">Enter "user" or "owner/repo" to generate stats.</p>
            </div>
          )
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-16 text-center max-w-2xl px-4">
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-xs text-gray-500 flex items-start gap-3 text-left">
          <Info size={16} className="shrink-0 mt-0.5 text-gray-400" />
          <p>
            <strong className="text-gray-300">How it works:</strong> <br />
            1. <strong>User Search:</strong> Sums the size of the user's 100 most recent public repos, grouped by their primary language. <br />
            2. <strong>Repo Search:</strong> Fetches the exact byte count of every language used in that specific repository.
          </p>
        </div>
      </div>

    </div>
  );
}