import type { VercelRequest, VercelResponse } from '@vercel/node';

// GitHub language colors
const GITHUB_COLORS: Record<string, string> = {
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

// Fallback color generator
const stringToColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

interface GitHubUser {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
}

interface GitHubRepo {
    language: string | null;
    size: number;
    fork: boolean;
}

interface LanguageStat {
    name: string;
    value: number;
    color: string;
    percent: number;
}

// Generate SVG card
function generateSVG(
    stats: LanguageStat[],
    theme: 'dark' | 'light' = 'dark'
): string {
    const isDark = theme === 'dark';

    // Theme colors
    const colors = {
        bg: isDark ? '#0d1117' : '#ffffff',
        border: isDark ? '#30363d' : '#d0d7de',
        text: isDark ? '#e6edf3' : '#1f2328',
        textSecondary: isDark ? '#8b949e' : '#656d76',
    };

    // Generate donut chart segments
    const size = 140;
    const center = size / 2;
    const strokeWidth = 16;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;

    let currentOffset = 0;
    const donutSegments = stats.map((stat) => {
        const dashArray = (stat.percent / 100) * circumference;
        const offset = currentOffset;
        currentOffset -= dashArray;
        return `
      <circle
        cx="${center}"
        cy="${center}"
        r="${radius}"
        fill="transparent"
        stroke="${stat.color}"
        stroke-width="${strokeWidth}"
        stroke-dasharray="${dashArray} ${circumference}"
        stroke-dashoffset="${offset}"
        stroke-linecap="butt"
      />
    `;
    }).join('');

    // Generate legend items
    const legendItems = stats.slice(0, 6).map((stat, index) => `
    <g transform="translate(0, ${index * 24})">
      <circle cx="6" cy="8" r="6" fill="${stat.color}"/>
      <text x="20" y="12" font-size="13" fill="${colors.text}" font-family="Segoe UI, Ubuntu, sans-serif">${stat.name}</text>
      <text x="220" y="12" font-size="13" fill="${colors.textSecondary}" font-family="Segoe UI, Ubuntu, sans-serif" text-anchor="end">${stat.percent.toFixed(1)}%</text>
    </g>
  `).join('');

    return `
<svg width="400" height="170" viewBox="0 0 400 170" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="170" rx="10" fill="${colors.bg}" stroke="${colors.border}" stroke-width="1"/>
  
  <!-- Donut Chart -->
  <g transform="translate(15, 15) rotate(-90, ${center}, ${center})">
    <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent" stroke="${colors.border}" stroke-width="${strokeWidth}"/>
    ${donutSegments}
  </g>
  
  <!-- Chart Center Label -->
  <text x="85" y="82" font-size="24" font-weight="bold" fill="${colors.text}" font-family="Segoe UI, Ubuntu, sans-serif" text-anchor="middle">${stats.length}</text>
  <text x="85" y="100" font-size="10" fill="${colors.textSecondary}" font-family="Segoe UI, Ubuntu, sans-serif" text-anchor="middle">LANGS</text>
  
  <!-- Legend -->
  <g transform="translate(170, 15)">
    ${legendItems}
  </g>
</svg>
  `.trim();
}

// Escape XML special characters
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { username } = req.query;
    const theme = (req.query.theme as string) === 'light' ? 'light' : 'dark';

    if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        // Fetch user profile
        const profileRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'github-stats-card',
            },
        });

        if (profileRes.status === 404) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (profileRes.status === 403) {
            return res.status(429).json({ error: 'GitHub API rate limit exceeded' });
        }
        if (!profileRes.ok) {
            return res.status(500).json({ error: 'Failed to fetch user profile' });
        }

        const profile: GitHubUser = await profileRes.json();

        // Fetch repos
        const reposRes = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'github-stats-card',
                },
            }
        );

        if (!reposRes.ok) {
            return res.status(500).json({ error: 'Failed to fetch repositories' });
        }

        const repos: GitHubRepo[] = await reposRes.json();

        // Aggregate language stats
        const rawStats: Record<string, number> = {};
        let totalSize = 0;

        repos.forEach((repo) => {
            if (!repo.language || repo.fork) return;
            if (!rawStats[repo.language]) {
                rawStats[repo.language] = 0;
            }
            rawStats[repo.language] += repo.size;
            totalSize += repo.size;
        });

        // Process stats
        const processedStats: LanguageStat[] = Object.entries(rawStats)
            .map(([name, value]) => ({
                name,
                value,
                color: GITHUB_COLORS[name] || stringToColor(name),
                percent: totalSize > 0 ? (value / totalSize) * 100 : 0,
            }))
            .sort((a, b) => b.value - a.value);

        // Take top 5 and group others
        const topStats = processedStats.slice(0, 5);
        const otherStats = processedStats.slice(5);

        if (otherStats.length > 0) {
            const otherValue = otherStats.reduce((acc, curr) => acc + curr.value, 0);
            topStats.push({
                name: 'Other',
                value: otherValue,
                color: '#8b949e',
                percent: totalSize > 0 ? (otherValue / totalSize) * 100 : 0,
            });
        }

        // Generate SVG
        const svg = generateSVG(topStats, theme);

        // Set cache headers (cache for 4 hours)
        res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate');
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.status(200).send(svg);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
