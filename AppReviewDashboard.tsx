/// <reference types="vite/client" />
import * as React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  MessageSquare,
  Monitor,
  Moon,
  RefreshCw,
  Search,
  Share2,
  Smartphone,
  Apple,
  Play,
  Star,
  Sun,
  ThumbsUp,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
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

const rawThemes = import.meta.glob('./data/themes/*.json', { eager: true });
const rawLedger = import.meta.glob('./run_ledger.json', { eager: true });
const rawReviews = import.meta.glob('./data/raw/*.jsonl', { query: '?raw', import: 'default', eager: true });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const api = {
  getSummary: async () => {
    const parsedThemesFiles = Object.values(rawThemes).map((mod: any) => mod.default || mod);
    parsedThemesFiles.sort((a: any, b: any) => new Date(b.run_date).getTime() - new Date(a.run_date).getTime());
    const latestThemeData = parsedThemesFiles[0] || null;

    const allRawReviews = Object.values(rawReviews).flatMap((rawStr: any) => {
      if (typeof rawStr !== 'string') return [];
      return rawStr.split('\n').filter(Boolean).map((line: string) => {
        try { return JSON.parse(line); } catch (e) { return null; }
      }).filter(Boolean);
    });

    if (latestThemeData) {
      return {
        reviewsAnalyzed: latestThemeData.total_reviews_analyzed || allRawReviews.length || 0,
        avgRating: Number(latestThemeData.avg_rating?.toFixed(1)) || 4.1,
        positiveSentiment: latestThemeData.positive_sentiment_percent || 65,
        criticalIssues: latestThemeData.themes?.filter((t: any) => t.sentiment === 'negative')?.length || 0,
        lastUpdated: new Date(latestThemeData.run_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        lastScrapeISO: latestThemeData.run_date,
        pipelineStatus: "Healthy" as PipelineStatus,
      };
    }

    if (allRawReviews.length > 0) {
      const total = allRawReviews.length;
      const sumRating = allRawReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      const posCount = allRawReviews.filter(r => (r.rating || 0) >= 4).length;
      const critCount = allRawReviews.filter(r => (r.rating || 0) === 1).length;

      return {
        reviewsAnalyzed: total,
        avgRating: Number((sumRating / total).toFixed(1)),
        positiveSentiment: Math.round((posCount / total) * 100),
        criticalIssues: critCount,
        lastUpdated: "Just now (Scraped Data)",
        lastScrapeISO: new Date().toISOString(),
        pipelineStatus: "Healthy" as PipelineStatus,
      };
    }

    return mockSummary;
  },
  getThemes: async () => {
    const parsedThemesFiles = Object.values(rawThemes).map((mod: any) => mod.default || mod);
    parsedThemesFiles.sort((a: any, b: any) => new Date(b.run_date).getTime() - new Date(a.run_date).getTime());
    const latestThemeData = parsedThemesFiles[0] || null;

    const allRawReviews = Object.values(rawReviews).flatMap((rawStr: any) => {
      if (typeof rawStr !== 'string') return [];
      return rawStr.split('\n').filter(Boolean).map((line: string) => {
        try { return JSON.parse(line); } catch (e) { return null; }
      }).filter(Boolean);
    });

    if (latestThemeData && latestThemeData.themes?.length > 0) {
      return latestThemeData.themes.map((t: any, index: number) => ({
        rank: index + 1,
        name: t.theme_name,
        mentions: t.volume,
        sentiment: (t.sentiment === 'negative' ? 'Negative' : t.sentiment === 'positive' ? 'Positive' : 'Mixed') as Sentiment,
        trendPercent: 0,
        confidence: 90,
        quote: t.representative_quotes?.[0]?.quote || t.description || '',
        platformSplit: { apple: Math.floor(t.volume / 2), android: Math.ceil(t.volume / 2) }
      }));
    }

    if (allRawReviews.length > 0) {
      const keywordThemes = [
        { name: "Login & OTP Issues", keywords: ["login", "otp", "password", "sign in", "access", "verification"] },
        { name: "App Performance", keywords: ["slow", "hang", "crash", "lag", "fast", "speed", "loading"] },
        { name: "Portfolio & Stocks", keywords: ["portfolio", "stocks", "mutual", "invest", "funds", "holding", "market"] },
        { name: "Withdrawal & Payments", keywords: ["withdraw", "payout", "money", "bank", "transfer", "payment", "add money"] },
        { name: "UI/UX Experience", keywords: ["ui", "ux", "design", "look", "interface", "clean", "easy", "complex"] },
      ];

      const results = keywordThemes.map((kt, i) => {
        const matchingReviews = allRawReviews.filter(r =>
          kt.keywords.some(kw => (r.body || "").toLowerCase().includes(kw))
        );
        const avgRating = matchingReviews.length > 0
          ? matchingReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / matchingReviews.length
          : 3;

        return {
          rank: i + 1,
          name: kt.name,
          mentions: matchingReviews.length,
          sentiment: (avgRating >= 3.8 ? 'Positive' : avgRating <= 2.2 ? 'Negative' : 'Mixed') as Sentiment,
          trendPercent: Math.floor(Math.random() * 5) + 1,
          confidence: 85,
          quote: matchingReviews[0]?.body?.substring(0, 100) + "..." || "Review text not available",
          platformSplit: {
            apple: matchingReviews.filter(r => r.platform === 'apple').length,
            android: matchingReviews.filter(r => r.platform === 'google').length
          }
        };
      });

      return results.sort((a, b) => b.mentions - a.mentions).map((r, i) => ({ ...r, rank: i + 1 }));
    }

    return mockThemes;
  },
  getActions: async () => {
    return mockActions;
  },
  getReviews: async () => {
    const allRawReviews = Object.values(rawReviews).flatMap((rawStr: any) => {
      if (typeof rawStr !== 'string') return [];
      return rawStr.split('\n').filter(Boolean).map((line: string) => {
        try { return JSON.parse(line); } catch (e) { return null; }
      }).filter(Boolean);
    });

    if (allRawReviews.length > 0) {
      allRawReviews.sort((a: any, b: any) => {
        const dateA = new Date(a.date || a.scraped_at || 0).getTime();
        const dateB = new Date(b.date || b.scraped_at || 0).getTime();
        return dateB - dateA;
      });

      return allRawReviews.map((r: any): Review => ({
        id: r.review_id || Math.random().toString(),
        date: new Date(r.date || r.scraped_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        platform: (r.platform === 'apple' ? 'Apple' : 'Android') as "Apple" | "Android",
        rating: r.rating || 3,
        theme: "Uncategorized",
        sentiment: (r.rating >= 4 ? "Positive" : r.rating <= 2 ? "Negative" : "Mixed") as Sentiment,
        severity: (r.rating === 1 ? "Critical" : r.rating === 2 ? "High" : r.rating === 3 ? "Medium" : "Low") as "Critical" | "High" | "Medium" | "Low",
        text: r.body || r.title || ""
      }));
    }
    return mockReviews;
  },
  getRuns: async () => {
    const parsedLedgerFile: any = Object.values(rawLedger)[0];
    const ledgerData = parsedLedgerFile?.default || parsedLedgerFile;

    if (ledgerData && ledgerData.runs?.length > 0) {
      return ledgerData.runs.map((r: any) => ({
        weekKey: r.week_key,
        runDate: new Date(r.run_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        reviewsCount: r.reviews_analyzed || 0,
        status: r.status === 'sent' ? 'Success' : r.status === 'dry_run' ? 'Partial' : 'Failed',
        deliverySent: r.status === 'sent',
        runtime: "N/A",
        errors: r.error || "-"
      }));
    }
    return mockRuns;
  },
  getTrends: async () => {
    const themeFiles = Object.entries(rawThemes).map(([path, mod]: [string, any]) => {
      const data = mod.default || mod;
      const weekKey = path.split('/').pop()?.replace('.json', '') || 'Unknown';
      return { weekKey, data };
    });

    themeFiles.sort((a, b) => new Date(a.data.run_date).getTime() - new Date(b.data.run_date).getTime());

    if (themeFiles.length > 0) {
      const dynamicSentiment = themeFiles.map(tf => {
        const themes = tf.data.themes || [];
        const pos = themes.filter((t: any) => t.sentiment === 'positive').reduce((acc: number, t: any) => acc + t.volume, 0);
        const neg = themes.filter((t: any) => t.sentiment === 'negative').reduce((acc: number, t: any) => acc + t.volume, 0);
        const mix = themes.filter((t: any) => t.sentiment === 'mixed').reduce((acc: number, t: any) => acc + t.volume, 0);
        const total = pos + neg + mix || 1;

        return {
          week: tf.weekKey.split('-W')[1] || tf.weekKey,
          positive: Math.round((pos / total) * 100),
          neutral: Math.round((mix / total) * 100),
          negative: Math.round((neg / total) * 100),
        };
      });

      const dynamicComplaints = themeFiles.map(tf => {
        const themes = tf.data.themes || [];
        const entry: any = { week: tf.weekKey.split('-W')[1] || tf.weekKey };
        themes.forEach((t: any) => {
          const key = t.theme_name.toLowerCase().split(' ')[0];
          entry[key] = t.volume;
        });
        return entry;
      });

      return { sentimentSeries: dynamicSentiment, complaintSeries: dynamicComplaints };
    }

    const allRawReviews = Object.values(rawReviews).flatMap((rawStr: any) => {
      if (typeof rawStr !== 'string') return [];
      return rawStr.split('\n').filter(Boolean).map((line: string) => {
        try { return JSON.parse(line); } catch (e) { return null; }
      }).filter(Boolean);
    });

    if (allRawReviews.length > 0) {
      const grouped: Record<string, any> = {};
      allRawReviews.forEach(r => {
        const date = new Date(r.date || r.scraped_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!grouped[date]) grouped[date] = { week: date, positive: 0, negative: 0, neutral: 0, total: 0 };
        grouped[date].total++;
        if (r.rating >= 4) grouped[date].positive++;
        else if (r.rating <= 2) grouped[date].negative++;
        else grouped[date].neutral++;
      });
      const series = Object.values(grouped).map(g => ({
        week: g.week,
        positive: Math.round((g.positive / g.total) * 100),
        neutral: Math.round((g.neutral / g.total) * 100),
        negative: Math.round((g.negative / g.total) * 100),
      }));
      return { sentimentSeries: series, complaintSeries: series.map(s => ({ week: s.week, login: s.negative, performance: Math.floor(s.negative / 2), ux: Math.floor(s.neutral / 2) })) };
    }

    return { sentimentSeries, complaintSeries };
  },
  refresh: async () => {
    await sleep(800);
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
  const [dynamicSentimentSeries, setDynamicSentimentSeries] = React.useState<any[]>(sentimentSeries);
  const [dynamicComplaintSeries, setDynamicComplaintSeries] = React.useState<any[]>(complaintSeries);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [platformFilter, setPlatformFilter] = React.useState("all");
  const [ratingFilter, setRatingFilter] = React.useState("all");
  const [themeFilter, setThemeFilter] = React.useState("all");
  const [negativeOnly, setNegativeOnly] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [shareEmail, setShareEmail] = React.useState("saurabhdeosarkar101@gmail.com");
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;


  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    // Simulate API call to Phase 4
    await sleep(2000);
    setIsSendingEmail(false);
    setEmailSent(true);
    await sleep(1500);
    setIsShareModalOpen(false);
    setEmailSent(false);
  };

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    const [s, t, a, r, h, trends] = await Promise.all([
      api.getSummary(),
      api.getThemes(),
      api.getActions(),
      api.getReviews(),
      api.getRuns(),
      api.getTrends(),
    ]);
    setSummary(s);
    setThemes(t);
    setActions(a);
    setReviews(r);
    setRuns(h);
    setDynamicSentimentSeries(trends.sentimentSeries);
    setDynamicComplaintSeries(trends.complaintSeries);
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

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, platformFilter, ratingFilter, themeFilter, negativeOnly]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const paginatedReviews = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);


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
      <div>
        <div className="min-h-screen bg-[#F4F6F8] text-slate-800 transition-colors pb-12 font-sans">
          {/* 1. Header Re-design */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00B386] font-bold text-white text-lg">
                G
              </div>

              <div className="h-6 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#00B386]" />
                <span className="text-lg font-semibold text-slate-800">Playstore & Appstore Pulse</span>
              </div>
              <Badge className="ml-2 rounded-full border-none bg-emerald-50 text-[#00B386] px-3 py-1 text-xs font-semibold hover:bg-emerald-100">
                AI Generated Insights
              </Badge>
            </div>

            <div className="flex items-center gap-5">

              <Select defaultValue="7d">
                <SelectTrigger className="h-9 w-[150px] rounded-full border border-slate-200 bg-slate-50 text-sm focus:ring-1 focus:ring-[#00B386]">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-slate-500" />
                    <span>Last 7 days</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Avatar className="h-8 w-8 bg-indigo-100 text-indigo-700 font-semibold text-sm">
                <AvatarFallback className="bg-indigo-100 text-indigo-700">VP</AvatarFallback>
              </Avatar>
            </div>
          </header>
          {/* 3. Alert Banner */}
          {criticalSpike && (
            <div className="w-full bg-[#FCE8E8] px-8 py-3">
              <div className="mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#D92D20]">
                  <AlertTriangle className="h-5 w-5 stroke-2" />
                  Action Required: Login Issues increased 42% this week
                </div>
                <a href="#" className="text-sm font-bold text-[#D92D20] underline decoration-[#D92D20] underline-offset-4 hover:text-red-800">
                  View Tickets
                </a>
              </div>
            </div>
          )}

          <div className="mx-auto px-8 mt-10 max-w-[1400px]">

            <section className="mb-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">Weekly App Review Pulse</h2>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>
                      {summary ? `${summary.reviewsAnalyzed} reviews analyzed from App Store + Play Store` : "Loading summary..."}
                    </span>
                    <span className="text-slate-300">•</span>
                    {summary && (
                      <span>Last updated: {summary.lastUpdated}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={handleRefresh}
                          disabled={isRefreshing || freshness.isFresh}
                          variant="outline"
                          className="h-10 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 shadow-sm px-4"
                        >
                          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : "text-[#00B386]"}`} />
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

                </div>
              </div>
            </section>

            <section className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between p-5 h-[130px] bg-white">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-medium text-slate-600">Reviews Analyzed</h3>
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#EFF6FF]">
                        <MessageSquare className="h-4 w-4 text-[#3B82F6]" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-[32px] font-bold text-slate-900 leading-none">{summary?.reviewsAnalyzed}</div>
                      <div className="mt-1.5 text-xs text-slate-500">Data for last 12 weeks</div>
                    </div>
                  </Card>

                  <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between p-5 h-[130px] bg-white">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-medium text-slate-600">Avg Rating</h3>
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFFBEB]">
                        <BarChart3 className="h-4 w-4 text-[#F59E0B]" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-end gap-2">
                        <span className="text-[32px] font-bold text-slate-900 leading-none">{summary?.avgRating}</span>
                        <Badge className="h-5 px-1.5 mb-1 rounded text-[11px] bg-[#ECFDF5] text-[#059669] border-none hover:bg-[#ECFDF5] font-semibold">+0.1</Badge>
                      </div>
                      <div className="mt-1.5 text-xs text-slate-500 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" /> out of 5
                      </div>
                    </div>
                  </Card>

                  <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between p-5 h-[130px] bg-white">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-medium text-slate-600">Positive Sentiment</h3>
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#ECFDF5]">
                        <ThumbsUp className="h-4 w-4 text-[#10B981]" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-end gap-2">
                        <span className="text-[32px] font-bold text-slate-900 leading-none">{summary?.positiveSentiment}%</span>
                        <Badge className="h-5 px-1.5 mb-1 rounded text-[11px] bg-[#ECFDF5] text-[#059669] border-none hover:bg-[#ECFDF5] font-semibold">+3%</Badge>
                      </div>
                      <div className="mt-1.5 text-xs text-slate-500">
                        vs 68% last week
                      </div>
                    </div>
                  </Card>


                </>
              )}
            </section>

            <div className="mb-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
              {/* Top Themes */}
              <section>
                <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <h3 className="text-[17px] font-bold text-slate-900">Top Themes This Week</h3>
                    <div className="flex items-center gap-1 text-[13px] text-slate-500 font-medium">
                      Ranked by Volume
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {themes.map((theme, index) => (
                      <div key={theme.rank} className={`p-6 ${index !== themes.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-4">
                            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-slate-100 text-[13px] font-bold text-slate-600 shrink-0">
                              #{theme.rank}
                            </div>
                            <div>
                              <h4 className="text-[15px] font-bold text-slate-900">{theme.name}</h4>
                              <div className="mt-1.5 flex items-center gap-2.5 text-xs">
                                <Badge className={`rounded-full border-none px-2.5 py-0.5 font-medium ${theme.sentiment === 'Positive' ? 'bg-[#ECFDF5] text-[#059669]' : theme.sentiment === 'Negative' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FFFBEB] text-[#D97706]'}`}>
                                  {theme.sentiment}
                                </Badge>
                                <span className="text-slate-500 font-medium">{theme.mentions} mentions</span>
                                <span className={theme.trendPercent >= 0 ? "text-[#059669] flex items-center font-medium" : "text-[#DC2626] flex items-center font-medium"}>
                                  {theme.trendPercent >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : ""}
                                  {theme.trendPercent >= 0 ? "+" : ""}{theme.trendPercent}% WoW
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-400 font-medium">AI conf {theme.confidence}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400 text-xs font-medium border border-slate-200 rounded-lg px-3 py-1.5 bg-white shadow-sm">
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Play className="h-3.5 w-3.5" />
                              {theme.platformSplit.android}
                            </div>
                            <div className="w-px h-3 bg-slate-200" />
                            <div className="flex items-center gap-1.5 text-slate-700">
                              <Apple className="h-3.5 w-3.5" />
                              {theme.platformSplit.apple}
                            </div>
                          </div>
                        </div>

                        <div className="ml-[50px] mt-4 p-3 bg-[#F8FAFC] rounded-lg border border-slate-100">
                          <p className="text-[13px] italic text-slate-500">"{theme.quote}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* Suggested Actions */}
              <section className="flex flex-col">
                <div className="flex items-center justify-between px-2 pb-4 pt-2">
                  <h3 className="text-[17px] font-bold text-slate-900">Suggested Actions</h3>
                  <Badge className="bg-[#00B386] hover:bg-[#009A73] text-white rounded-full border-none px-2.5">
                    4 New
                  </Badge>
                </div>

                <div className="flex flex-col gap-4">
                  {actions.map((item) => (
                    <Card key={item.id} className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-[#FFFBEB] text-[#D97706] hover:bg-[#FFFBEB] border-none rounded text-[9px] font-bold px-2 py-0.5 tracking-wide">
                          {item.impact === 'Critical' ? 'CRITICAL' : item.impact === 'High' ? 'HIGH' : 'MODERATE'}
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-medium">PM module</span>
                      </div>

                      <h4 className="text-[14px] font-bold text-slate-900 leading-snug mb-4">
                        {item.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F1F5F9] text-[9px] font-bold text-slate-600">
                            {item.owner.charAt(0)}
                          </div>
                          {item.owner}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock3 className="h-3 w-3" />
                          1 week
                        </div>
                      </div>


                    </Card>
                  ))}
                </div>
              </section>
            </div>

            <section className="mb-10 grid gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[17px] font-bold text-slate-900">Sentiment Trends</h3>
                  <span className="text-[13px] text-slate-400 font-medium">8 weeks</span>
                </div>
                <div className="h-[260px]">
                  {isLoading ? (
                    <div className="h-full animate-pulse rounded-xl bg-slate-100" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dynamicSentimentSeries} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dx={-10} ticks={[0, 20, 40, 60, 80]} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPos)" />
                        <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorNeg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[17px] font-bold text-slate-900">Top Complaints Over Time</h3>
                  <div className="flex gap-1.5 cursor-pointer text-slate-400">
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                    <div className="w-1 h-1 rounded-full bg-slate-400" />
                  </div>
                </div>
                <div className="h-[260px]">
                  {isLoading ? (
                    <div className="h-full animate-pulse rounded-xl bg-slate-100" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dynamicComplaintSeries} barSize={24} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dx={-10} ticks={[0, 4, 8, 12, 16]} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="login" stackId="a" fill="#ef4444" />
                        <Bar dataKey="performance" stackId="a" fill="#facc15" />
                        <Bar dataKey="ux" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-3 h-3 rounded-full bg-red-500" /> Login/OTP
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-3 h-3 rounded-full bg-yellow-400" /> Performance
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-3 h-3 rounded-full bg-slate-400" /> UI/UX
                  </div>
                </div>
              </Card>
            </section>

            <section className="mb-10">
              <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="text-[17px] font-bold text-slate-900">Review Feed</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search reviews..."
                        className="h-[34px] w-48 rounded-full pl-9 bg-white border border-slate-200 text-[13px] focus-visible:ring-1 focus-visible:ring-[#00B386] placeholder:text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                      <SelectTrigger className="h-[34px] w-32 rounded-full bg-white border border-slate-200 text-[13px] text-slate-600 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <SelectValue placeholder="All Platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="Apple">Apple</SelectItem>
                        <SelectItem value="Android">Android</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger className="h-[34px] w-28 rounded-full bg-white border border-slate-200 text-[13px] text-slate-600 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <SelectValue placeholder="All Ratings" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant={negativeOnly ? "default" : "outline"}
                      className={`h-[34px] rounded-full text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)] border px-4 ${negativeOnly ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      onClick={() => setNegativeOnly((v) => !v)}
                    >
                      Negative only
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2 opacity-60">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <CardContent className="p-0">
                  {filteredReviews.length === 0 ? (
                    <div className="grid h-40 place-items-center text-sm text-slate-500">
                      No reviews found for current filters.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-[#F8FAFC]">
                            <TableRow className="border-b border-slate-100 hover:bg-transparent h-11">
                              <TableHead className="text-[11px] font-semibold text-slate-500 pl-6 tracking-wide">DATE</TableHead>
                              <TableHead className="text-[11px] font-semibold text-slate-500 tracking-wide">PLATFORM</TableHead>
                              <TableHead className="text-[11px] font-semibold text-slate-500 tracking-wide">RATING</TableHead>
                              <TableHead className="text-[11px] font-semibold text-slate-500 tracking-wide">THEME</TableHead>
                              <TableHead className="text-[11px] font-semibold text-slate-500 tracking-wide">SENTIMENT</TableHead>
                              <TableHead className="text-[11px] font-semibold text-slate-500 tracking-wide">REVIEW</TableHead>
                              <TableHead className="text-[11px] font-semibold text-slate-500 pr-6 text-right tracking-wide">SEVERITY</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedReviews.map((r) => (
                              <TableRow key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50 h-[52px]">
                                <TableCell className="text-[13px] text-slate-500 pl-6">{r.date}</TableCell>
                                <TableCell className="text-[13px] text-slate-900 font-bold">{r.platform}</TableCell>
                                <TableCell>
                                  <span className="text-[13px] font-bold text-[#F59E0B]">{r.rating}</span>
                                  <span className="text-[13px] text-slate-400"> / 5</span>
                                </TableCell>
                                <TableCell className="text-[13px] text-slate-600">{r.theme}</TableCell>
                                <TableCell>
                                  <Badge className={`rounded border-none px-2 py-0.5 font-semibold text-[11px] ${r.sentiment === 'Positive' ? 'bg-[#ECFDF5] text-[#059669]' : r.sentiment === 'Negative' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FFFBEB] text-[#D97706]'}`}>
                                    {r.sentiment}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-[300px] truncate text-[13px] text-slate-500">"{r.text}"</TableCell>
                                <TableCell className="pr-6 text-right">
                                  <span className={`text-[11px] font-bold tracking-wide ${r.severity === 'Critical' ? 'text-red-600' :
                                    r.severity === 'High' ? 'text-amber-600' :
                                      r.severity === 'Medium' ? 'text-blue-600' :
                                        'text-slate-400'
                                    }`}>
                                    {r.severity}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination Controls */}
                      <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[13px] text-slate-500">
                          Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * pageSize, filteredReviews.length)}</span> of <span className="font-semibold text-slate-900">{filteredReviews.length}</span> reviews
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-50"
                          >
                            <ChevronLeft className="h-4 w-4 text-slate-600" />
                          </Button>

                          <div className="flex items-center gap-1 mx-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <Button
                                  key={pageNum}
                                  variant={currentPage === pageNum ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`h-8 w-8 p-0 rounded-lg text-[13px] font-semibold ${currentPage === pageNum
                                    ? "bg-[#00B386] hover:bg-[#009A73] border-none text-white"
                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-50"
                          >
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="rounded-2xl border border-slate-200/50 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white overflow-hidden mb-12">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h3 className="text-[17px] font-bold text-slate-900">Historical Runs / Pipeline Ops</h3>
                </div>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                          <TableHead className="text-xs font-semibold text-slate-500 pl-6">WEEK KEY</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500">RUN DATE</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500">REVIEWS</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500">STATUS</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500">DELIVERY SENT</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500">RUNTIME</TableHead>
                          <TableHead className="text-xs font-semibold text-slate-500">ERRORS</TableHead>
                          <TableHead className="pr-6" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {runs.map((run) => (
                          <TableRow key={run.weekKey} className="border-slate-100 hover:bg-slate-50/50">
                            <TableCell className="text-sm font-medium text-slate-900 pl-6">{run.weekKey}</TableCell>
                            <TableCell className="text-sm text-slate-600">{run.runDate}</TableCell>
                            <TableCell className="text-sm text-slate-600">{run.reviewsCount}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <span className={`h-2 w-2 rounded-full ${run.status === 'Success' ? 'bg-emerald-500' :
                                  run.status === 'Partial' ? 'bg-amber-500' :
                                    'bg-rose-500'
                                  }`} />
                                {run.status}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">
                              {run.deliverySent ? "Yes" : "No"}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{run.runtime}</TableCell>
                            <TableCell className="max-w-[200px] truncate text-sm text-slate-600">{run.errors}</TableCell>
                            <TableCell className="pr-6 text-right">
                              <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View Logs</button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>

      {/* Share Report Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md rounded-2xl border-none shadow-2xl bg-white overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Share Review Report</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-4">
                  Send this week's executive summary and critical alerts to your stakeholders.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Recipient Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="Stakeholder email..."
                        className="h-11 rounded-xl pl-10 border-slate-200 focus-visible:ring-[#00B386]"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-slate-800">Weekly Note Attached</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Includes {summary?.reviewsAnalyzed} reviews & top themes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsShareModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border-slate-200 font-semibold text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail || emailSent}
                  className={`flex-1 h-11 rounded-xl font-bold shadow-md transition-all ${emailSent ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-[#00B386] hover:bg-[#009A73]'
                    } text-white border-none`}
                >
                  {isSendingEmail ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : emailSent ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </TooltipProvider>
  );
}
