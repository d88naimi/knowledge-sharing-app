// This file will be generated from your Supabase schema
// For now, we'll create a placeholder structure

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          author_id: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          author_id?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      code_snippets: {
        Row: {
          id: string;
          title: string;
          code: string;
          language: string;
          description: string | null;
          author_id: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          code: string;
          language: string;
          description?: string | null;
          author_id: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          code?: string;
          language?: string;
          description?: string | null;
          author_id?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_resources: {
        Row: {
          id: string;
          title: string;
          url: string;
          description: string;
          resource_type:
            | "video"
            | "article"
            | "course"
            | "documentation"
            | "other";
          author_id: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          description: string;
          resource_type:
            | "video"
            | "article"
            | "course"
            | "documentation"
            | "other";
          author_id: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          description?: string;
          resource_type?:
            | "video"
            | "article"
            | "course"
            | "documentation"
            | "other";
          author_id?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
