export type ResourceType = "article" | "code_snippet" | "learning_resource";

export interface Article {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Type for articles fetched from Supabase with joined user data
export type ArticleWithUser = Omit<Article, 'author_name'> & {
  users: { name: string | null } | null;
};

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description: string | null;
  author_id: string;
  author_name?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  description: string;
  resource_type: "video" | "article" | "course" | "documentation" | "other";
  author_id: string;
  author_name?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type Resource = Article | CodeSnippet | LearningResource;
