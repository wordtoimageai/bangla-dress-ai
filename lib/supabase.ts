import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Database = {
  public: {
    Tables: {
      designs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          price: number;
          category: string | null;
          designer_id: string | null;
          status: string;
          created_at: string;
          updated_at: string;
          measurements: Record<string, number> | null;
          style_tags: string[] | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          price: number;
          category?: string | null;
          designer_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          measurements?: Record<string, number> | null;
          style_tags?: string[] | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          price?: number;
          category?: string | null;
          designer_id?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
          measurements?: Record<string, number> | null;
          style_tags?: string[] | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          role: string;
          name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: string;
          name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: string;
          name?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
