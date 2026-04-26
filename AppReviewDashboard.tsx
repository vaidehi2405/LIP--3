import * as React from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  Moon,
  RefreshCw,
  Search,
  Share2,
  Sun,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PipelineStatus = "Healthy" | "Running" | "Partial Failure" | "Failed";
type Sentiment = "Positive" | "Mixed" | "Negative";
type Owner = "Product" | "Growth" | "Monetization" | "Engineering" | "Support";

type Summary = {
  reviewsAnalyzed: number;
  avgRating: number;
  positiveSentiment: number;
  criticalIssues: number;
  lastUpdated: string;
  lastScrapeISO: string;
  pipelineStatus: PipelineStatus;
};

type Theme = {
  rank: number;
  name: string;
  mentions: number;
  sentiment: Sentiment;
  trendPercent: number;
  confidence: number;
  quote: string;
  platformSplit: { apple: number; android: number };
};

type ActionItem = {
  id: string;
  title: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  owner: Owner;
};

type Review = {
  id: string;
  date: string;
  platform: "Apple" | "Android";
  rating: number;
  theme: string;
  sentiment: Sentiment;
  severity: "Low" | "Medium" | "High" | "Critical";
  text: string;
};

type RunHistory = {
  weekKey: string;
  runDate: string;
  reviewsCount: number;
  status: "Success" | "Partial" | "Failed";
  deliverySent: boolean;
  runtime: string;
  errors: string;
};

const sentimentSeries = [
  { week: "W09", positive: 62, neutral: 25, negative: 13 },
  { week: "W10", positive: 64, neutral: 23, negative: 13 },
  { week: "W11", positive: 68, neutral: 20, negative: 12 },
  { week: "W12", positive: 66, neutral: 22, negative: 12 },
  { week: "W13", positive: 70, neutral: 19, negative: 11 },
  { week: "W14", positive: 71, neutral: 18, negative: 11 },
  { week: "W15", positive: 69, neutral: 17, negative: 14 },
  { week: "W16", positive: 71, neutral: 16, negative: 13 },
];

const complaintSeries = [
  { week: "W12", login: 6, performance: 8, payment: 4, ux: 2 },
  { week: "W13", login: 7, performance: 7, payment: 5, ux: 3 },
  { week: "W14", login: 8, performance: 6, payment: 5, ux: 2 },
  { week: "W15", login: 9, performance: 5, payment: 6, ux: 2 },
  { week: "W16", login: 13, performance: 6, payment: 5, ux: 1 },
];

const sparkline = {
  reviews: [
    { x: "1", y: 58 },
    { x: "2", y: 62 },
    { x: "3", y: 65 },
    { x: "4", y: 74 },
    { x: "5", y: 79 },
  ],
  rating: [
    { x: "1", y: 4.0 },
    { x: "2", y: 4.1 },
    { x: "3", y: 4.2 },
    { x: "4", y: 4.2 },
    { x: "5", y: 4.3 },
  ],
  positive: [
    { x: "1", y: 62 },
    { x: "2", y: 66 },
    { x: "3", y: 68 },
    { x: "4", y: 70 },
    { x: "5", y: 71 },
  ],
  critical: [
    { x: "1", y: 5 },
    { x: "2", y: 5 },
    { x: "3", y: 4 },
    { x: "4", y: 4 },
    { x: "5", y: 3 },
  ],
};

const mockSummary: Summary = {
  reviewsAnalyzed: 79,
  avgRating: 4.3,
  positiveSentiment: 71,
  criticalIssues: 3,
  lastUpdated: "Apr 26, 2026 · 2:10 PM",
  lastScrapeISO: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
  pipelineStatus: "Healthy",
};

const mockThemes: Theme[] = [
  {
    rank: 1,
    name: "User Interface & Experience",
    mentions: 51,
    sentiment: "Positive",
    trendPercent: 12,
    confidence: 94,
    quote: "Very clean UI and navigation feels much faster than before.",
    platformSplit: { apple: 23, android: 28 },
  },
  {
    rank: 2,
    name: "Investment Features & Options",
    mentions: 7,
    sentiment: "Positive",
    trendPercent: 8,
    confidence: 90,
    quote: "Pre-Apply IPO flow is simple and super useful for quick investing.",
    platformSplit: { apple: 3, android: 4 },
  },
  {
    rank: 3,
    name: "Feature Requests & Suggestions",
    mentions: 9,
    sentiment: "Mixed",
    trendPercent: 5,
    confidence: 84,
    quote: "Would love customizable watchlists and better notifications.",
    platformSplit: { apple: 4, android: 5 },
  },
  {
    rank: 4,
    name: "App Performance & Speed",
    mentions: 6,
    sentiment: "Negative",
    trendPercent: -8,
    confidence: 88,
    quote: "Portfolio screen lags during market open, especially on older devices.",
    platformSplit: { apple: 2, android: 4 },
  },
  {
    rank: 5,
    name: "Login / OTP Issues",
    mentions: 4,
    sentiment: "Negative",
    trendPercent: 42,
    confidence: 92,
    quote: "OTP comes late and expires quickly, had to retry 3 times.",
    platformSplit: { apple: 1, android: 3 },
  },
];

const mockActions: ActionItem[] = [
  {
    id: "a1",
    title: "Improve onboarding flow with tutorials for investing features",
    impact: "High",
    owner: "Product",
  },
  {
    id: "a2",
    title: "Promote Pre-Apply IPO feature in campaigns",
    impact: "Medium",
    owner: "Growth",
  },
  {
    id: "a3",
    title: "Introduce monthly/annual MTF subscription plans",
    impact: "High",
    owner: "Monetization",
  },
  {
    id: "a4",
    title: "Fix login OTP delays affecting conversion",
    impact: "Critical",
    owner: "Engineering",
  },
];

const mockReviews: Review[] = [
  {
    id: "r1",
    date: "2026-04-25",
    platform: "Android",
    rating: 2,
    theme: "Login / OTP Issues",
    sentiment: "Negative",
    severity: "Critical",
    text: "OTP delays are making it impossible to login quickly during trading hours.",
  },
  {
    id: "r2",
    date: "2026-04-24",
    platform: "Apple",
    rating: 5,
    theme: "User Interface & Experience",
    sentiment: "Positive",
    severity: "Low",
    text: "Love the updated interface, very intuitive and elegant.",
  },
  {
    id: "r3",
    date: "2026-04-23",
    platform: "Android",
    rating: 3,
    theme: "Feature Requests & Suggestions",
    sentiment: "Mixed",
    severity: "Medium",
    text: "Good app overall, but need advanced alerts and more watchlist controls.",
  },
  {
    id: "r4",
    date: "2026-04-22",
    platform: "Apple",
    rating: 2,
    theme: "App Performance & Speed",
    sentiment: "Negative",
    severity: "High",
    text: "The app freezes when I switch quickly between charts and holdings.",
  },
  {
    id: "r5",
    date: "2026-04-21",
    platform: "Android",
    rating: 4,
    theme: "Investment Features & Options",
    sentiment: "Positive",
    severity: "Low",
    text: "Pre-Apply IPO and SIP tools are excellent and very easy to use.",
  },
];

const mockRuns: RunHistory[] = [
  {
    weekKey: "2026-W16",
    runDate: "Apr 26, 2026 · 2:10 PM",
    reviewsCount: 79,
    status: "Success",
    deliverySent: true,
    runtime: "2m 31s",
    errors: "-",
  },
  {
    weekKey: "2026-W15",
    runDate: "Apr 19, 2026 · 9:04 AM",
    reviewsCount: 83,
    status: "Partial",
    deliverySent: true,
    runtime: "3m 09s",
    errors: "Google API timeout recovered",
  },
  {
    weekKey: "2026-W14",
    runDate: "Apr 12, 2026 · 9:01 AM",
    reviewsCount: 91,
    status: "Success",
    deliverySent: true,
    runtime: "2m 42s",
    errors: "-",
  },
  {
    weekKey: "2026-W13",
    runDate: "Apr 05, 2026 · 9:00 AM",
    reviewsCount: 76,
    status: "Failed",
    deliverySent: false,
    runtime: "1m 14s",
    errors: "Groq authentication failure",
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
  getSummary: async () => {
    await sleep(450);
    return mockSummary;
  },
  getThemes: async () => {
    await sleep(500);
    return mockThemes;
  },
  getActions: async () => {
    await sleep(420);
    return mockActions;
  },
  getReviews: async () => {
    await sleep(550);
    return mockReviews;
  },
  getRuns: async () => {
    await sleep(480);
    return mockRuns;
  },
  refresh: async () => {
    await sleep(2200);
    return { ok: true };
  },
};

const statusBadgeClass: Record<PipelineStatus, string> = {
  Healthy: "bg-[rgb(var(--md3-success)/0.15)] text-[rgb(var(--md3-success))] border-[rgb(var(--md3-success)/0.25)]",
  Running: "bg-[rgb(var(--md3-primary)/0.14)] text-[rgb(var(--md3-primary))] border-[rgb(var(--md3-primary)/0.25)]",
  "Partial Failure": "bg-[rgb(var(--md3-secondary-container)/0.75)] text-[rgb(var(--md3-on-secondary-container))] border-[rgb(var(--md3-outline)/0.3)]",
  Failed: "bg-[rgb(var(--md3-error)/0.15)] text-[rgb(var(--md3-error))] border-[rgb(var(--md3-error)/0.3)]",
};

const sentimentBadgeClass: Record<Sentiment, string> = {
  Positive: "bg-[rgb(var(--md3-success)/0.15)] text-[rgb(var(--md3-success))] border-[rgb(var(--md3-success)/0.25)]",
  Mixed: "bg-[rgb(var(--md3-secondary-container)/0.75)] text-[rgb(var(--md3-on-secondary-container))] border-[rgb(var(--md3-outline)/0.3)]",
  Negative: "bg-[rgb(var(--md3-error)/0.15)] text-[rgb(var(--md3-error))] border-[rgb(var(--md3-error)/0.25)]",
};

function KpiSparkline({ data, color }: { data: { x: string; y: number }[]; color: string }) {
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function SkeletonCard() {
  return <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />;
}

export default function AppReviewDashboard() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [themes, setThemes] = React.useState<Theme[]>([]);
  const [actions, setActions] = React.useState<ActionItem[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [runs, setRuns] = React.useState<RunHistory[]>([]);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [platformFilter, setPlatformFilter] = React.useState("all");
  const [ratingFilter, setRatingFilter] = React.useState("all");
  const [themeFilter, setThemeFilter] = React.useState("all");
  const [negativeOnly, setNegativeOnly] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const [s, t, a, r, h] = await Promise.all([
      api.getSummary(),
      api.getThemes(),
      api.getActions(),
      api.getReviews(),
      api.getRuns(),
    ]);
    setSummary(s);
    setThemes(t);
    setActions(a);
    setReviews(r);
    setRuns(h);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const freshness = React.useMemo(() => {
    if (!summary) return { isFresh: false, hours: 0, mins: 0 };
    const last = new Date(summary.lastScrapeISO).getTime();
    const now = Date.now();
    const elapsed = now - last;
    const threshold = 24 * 60 * 60 * 1000;
    const isFresh = elapsed < threshold;
    const remaining = Math.max(0, threshold - elapsed);
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return { isFresh, hours, mins };
  }, [summary]);

  const filteredReviews = React.useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.theme.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = platformFilter === "all" || r.platform === platformFilter;
      const matchesRating = ratingFilter === "all" || String(r.rating) === ratingFilter;
      const matchesTheme = themeFilter === "all" || r.theme === themeFilter;
      const matchesNegative = !negativeOnly || r.sentiment === "Negative";
      return matchesSearch && matchesPlatform && matchesRating && matchesTheme && matchesNegative;
    });
  }, [reviews, searchTerm, platformFilter, ratingFilter, themeFilter, negativeOnly]);

  const criticalSpike = React.useMemo(() => {
    const login = themes.find((t) => t.name.toLowerCase().includes("login"));
    return !!login && login.trendPercent > 30;
  }, [themes]);

  async function handleRefresh() {
    if (freshness.isFresh) return;
    setIsRefreshing(true);
    await api.refresh();
    await loadData();
    setIsRefreshing(false);
  }

  return (
    <TooltipProvider>
      <div className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-[rgb(var(--md3-surface))] text-[rgb(var(--md3-on-surface))] transition-colors">
          <div className="mx-auto max-w-[1600px] px-4 py-5 lg:px-8">
            <header className="sticky top-4 z-30 mb-6 rounded-[28px] border border-[rgb(var(--md3-outline)/0.25)] bg-[rgb(var(--md3-surface-container-high)/0.92)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.12),0_3px_10px_rgba(0,0,0,0.08)] backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[rgb(var(--md3-primary))] font-semibold text-[rgb(var(--md3-on-primary))]">
                    RP
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Internal Tool</p>
                    <h1 className="text-xl font-semibold">Review Pulse</h1>
                  </div>
                  <Badge className="ml-2 rounded-full border bg-[rgb(var(--md3-primary-container))] text-[rgb(var(--md3-on-primary-container))]">
                    AI Generated Insights
                  </Badge>
                </div>

                <div className="flex flex-1 items-center gap-2 lg:max-w-2xl">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      className="h-10 rounded-xl pl-9"
                      placeholder="Search themes, actions, reviews..."
                    />
                  </div>
                  <Select defaultValue="7d">
                    <SelectTrigger className="w-[170px] rounded-xl">
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => setDarkMode((d) => !d)}
                  >
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>SD</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>

            {criticalSpike && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-900/20 dark:text-rose-200"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircle className="h-4 w-4" />
                  Login Issues increased 42% this week
                </div>
              </motion.div>
            )}

            <section className="mb-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">Weekly App Review Pulse</h2>
                  <p className="mt-1 text-[rgb(var(--md3-on-surface)/0.75)]">
                    {summary ? `${summary.reviewsAnalyzed} reviews analyzed from App Store + Play Store` : "Loading summary..."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {summary && (
                    <Badge className={`rounded-full border ${statusBadgeClass[summary.pipelineStatus]}`}>
                      {summary.pipelineStatus}
                    </Badge>
                  )}
                  {summary && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Last updated: {summary.lastUpdated}</span>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={handleRefresh}
                          disabled={isRefreshing || freshness.isFresh}
                          className={`rounded-xl ${!freshness.isFresh ? "animate-pulse" : ""}`}
                        >
                          {isRefreshing ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                          )}
                          Refresh Data
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {freshness.isFresh && (
                      <TooltipContent>
                        Next refresh available in {freshness.hours}h {freshness.mins}m
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <Badge className={`rounded-full border ${freshness.isFresh ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                    {freshness.isFresh ? "Fresh Data" : "Refresh Available"}
                  </Badge>
                  <Button variant="outline" className="rounded-xl">
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Report
                  </Button>
                </div>
              </div>
            </section>

            <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">Reviews Analyzed</CardTitle>
                        <div className="text-3xl font-semibold">{summary?.reviewsAnalyzed}</div>
                      </CardHeader>
                      <CardContent><KpiSparkline data={sparkline.reviews} color="#3b82f6" /></CardContent>
                    </Card>
                  </motion.div>
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">Avg Rating</CardTitle>
                        <div className="text-3xl font-semibold">{summary?.avgRating} ⭐</div>
                      </CardHeader>
                      <CardContent><KpiSparkline data={sparkline.rating} color="#8b5cf6" /></CardContent>
                    </Card>
                  </motion.div>
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">Positive Sentiment</CardTitle>
                        <div className="text-3xl font-semibold">{summary?.positiveSentiment}%</div>
                      </CardHeader>
                      <CardContent><KpiSparkline data={sparkline.positive} color="#10b981" /></CardContent>
                    </Card>
                  </motion.div>
                  <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">Critical Issues Detected</CardTitle>
                        <div className="text-3xl font-semibold">{summary?.criticalIssues}</div>
                      </CardHeader>
                      <CardContent><KpiSparkline data={sparkline.critical} color="#ef4444" /></CardContent>
                    </Card>
                  </motion.div>
                </>
              )}
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Top Themes This Week</h3>
                <Tabs defaultValue="ranked">
                  <TabsList className="rounded-xl">
                    <TabsTrigger value="ranked">Ranked</TabsTrigger>
                    <TabsTrigger value="volume">By Volume</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {themes.map((theme) => (
                  <motion.div key={theme.rank} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <Card className="h-full rounded-2xl border-slate-200/70 shadow-sm">
                      <CardHeader className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <Badge variant="outline" className="rounded-full">Rank #{theme.rank}</Badge>
                            <CardTitle className="text-lg">{theme.name}</CardTitle>
                          </div>
                          <Badge className={`rounded-full border ${sentimentBadgeClass[theme.sentiment]}`}>
                            {theme.sentiment}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <span>{theme.mentions} mentions</span>
                          <span>•</span>
                          <span className={theme.trendPercent >= 0 ? "text-emerald-600" : "text-rose-600"}>
                            {theme.trendPercent >= 0 ? "+" : ""}
                            {theme.trendPercent}% WoW
                          </span>
                          <span>•</span>
                          <Tooltip>
                            <TooltipTrigger className="underline decoration-dotted">AI confidence {theme.confidence}%</TooltipTrigger>
                            <TooltipContent>Confidence indicates model certainty in cluster consistency.</TooltipContent>
                          </Tooltip>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <blockquote className="rounded-xl bg-slate-50 p-3 text-sm italic text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                          "{theme.quote}"
                        </blockquote>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Platform split: Apple {theme.platformSplit.apple} / Android {theme.platformSplit.android}
                        </div>
                        <Button variant="outline" className="w-full rounded-xl">Open Details</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold">Suggested Actions</h3>
                <Badge variant="outline" className="rounded-full">High-value PM module</Badge>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {actions.map((item) => (
                  <Card key={item.id} className="rounded-2xl border-slate-200/70 shadow-sm transition hover:-translate-y-0.5">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium leading-6">{item.title}</p>
                        <Badge
                          className={`rounded-full ${
                            item.impact === "Critical"
                              ? "bg-rose-100 text-rose-700"
                              : item.impact === "High"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {item.impact}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span>Owner: {item.owner}</span>
                        <span>•</span>
                        <Select defaultValue="7d">
                          <SelectTrigger className="h-8 w-[130px] rounded-lg text-xs">
                            <SelectValue placeholder="ETA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3d">ETA 3 days</SelectItem>
                            <SelectItem value="7d">ETA 1 week</SelectItem>
                            <SelectItem value="14d">ETA 2 weeks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button className="rounded-xl">Create Jira Ticket</Button>
                        <Button variant="outline" className="rounded-xl">Mark Reviewed</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-8 grid gap-4 lg:grid-cols-2">
              <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Sentiment Trends (8 weeks)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoading ? (
                    <div className="h-full animate-pulse rounded-xl bg-slate-100" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="neutral" stroke="#64748b" strokeWidth={2} />
                        <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Top Complaint Categories Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {isLoading ? (
                    <div className="h-full animate-pulse rounded-xl bg-slate-100" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={complaintSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="login" stackId="a" fill="#ef4444" />
                        <Bar dataKey="performance" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="payment" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="ux" stackId="a" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
              <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                <CardHeader className="sticky top-24 z-20 rounded-t-2xl bg-white/95 backdrop-blur dark:bg-slate-950/95">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle>Review Feed</CardTitle>
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search reviews..."
                        className="h-9 w-52 rounded-lg"
                      />
                      <Select value={platformFilter} onValueChange={setPlatformFilter}>
                        <SelectTrigger className="h-9 w-32 rounded-lg"><SelectValue placeholder="Platform" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Platform</SelectItem>
                          <SelectItem value="Apple">Apple</SelectItem>
                          <SelectItem value="Android">Android</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger className="h-9 w-28 rounded-lg"><SelectValue placeholder="Rating" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Rating</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={themeFilter} onValueChange={setThemeFilter}>
                        <SelectTrigger className="h-9 w-48 rounded-lg"><SelectValue placeholder="Theme" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Theme</SelectItem>
                          {themes.map((t) => (
                            <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant={negativeOnly ? "default" : "outline"}
                        className="h-9 rounded-lg"
                        onClick={() => setNegativeOnly((v) => !v)}
                      >
                        Negative only
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredReviews.length === 0 ? (
                    <div className="grid h-40 place-items-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500">
                      No reviews found for current filters.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Theme</TableHead>
                            <TableHead>Sentiment</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Severity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReviews.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell>{r.date}</TableCell>
                              <TableCell>{r.platform}</TableCell>
                              <TableCell>{r.rating}</TableCell>
                              <TableCell>{r.theme}</TableCell>
                              <TableCell>
                                <Badge className={`rounded-full border ${sentimentBadgeClass[r.sentiment]}`}>{r.sentiment}</Badge>
                              </TableCell>
                              <TableCell className="max-w-md truncate">{r.text}</TableCell>
                              <TableCell>{r.severity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="rounded-2xl border-slate-200/70 shadow-sm">
                <CardHeader>
                  <CardTitle>Historical Runs / Pipeline Ops</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week Key</TableHead>
                        <TableHead>Run Date</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Delivery Sent?</TableHead>
                        <TableHead>Runtime</TableHead>
                        <TableHead>Errors</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {runs.map((run) => (
                        <TableRow key={run.weekKey}>
                          <TableCell>{run.weekKey}</TableCell>
                          <TableCell>{run.runDate}</TableCell>
                          <TableCell>{run.reviewsCount}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                run.status === "Success"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : run.status === "Partial"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                              }
                            >
                              {run.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {run.deliverySent ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" /> Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-500">
                                <Clock3 className="h-4 w-4" /> No
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{run.runtime}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{run.errors}</TableCell>
                          <TableCell>
                            <Button variant="outline" className="h-8 rounded-lg">View Logs</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
