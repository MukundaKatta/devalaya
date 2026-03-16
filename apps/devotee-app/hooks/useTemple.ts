import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Temple {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: Record<string, string>;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  timings: unknown;
  timezone: string;
  default_language: string;
  supported_languages: string[];
}

export function useTemple(templeId?: string) {
  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templeId) {
      setLoading(false);
      return;
    }

    async function fetchTemple() {
      const { data, error: fetchError } = await supabase
        .from("temples")
        .select("*")
        .eq("id", templeId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setTemple(data as Temple);
      }
      setLoading(false);
    }

    fetchTemple();
  }, [templeId]);

  return { temple, loading, error };
}

export function useTemples() {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemples() {
      const { data } = await supabase
        .from("temples")
        .select("*")
        .eq("status", "active")
        .order("name");

      setTemples((data as Temple[]) || []);
      setLoading(false);
    }

    fetchTemples();
  }, []);

  return { temples, loading };
}
