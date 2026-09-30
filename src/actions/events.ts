'use server';

import { createClient } from '@/lib/supabase/server';
import type { Event } from '@/types';
import { isSupabaseConfigured, MOCK_EVENTS } from '@/lib/data/mock-data';

/** Fetch all events, optionally filtered by category */
export async function getEvents(category?: string): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    if (category) {
      return MOCK_EVENTS.filter((e) => e.category === category);
    }
    return MOCK_EVENTS;
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    // 1.8 second timeout safeguard
    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 1800)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      if (category) {
        return MOCK_EVENTS.filter((e) => e.category === category);
      }
      return MOCK_EVENTS;
    }

    return data as Event[];
  } catch (err) {
    console.warn('Supabase fetch failed, using fallback data:', err);
    if (category) {
      return MOCK_EVENTS.filter((e) => e.category === category);
    }
    return MOCK_EVENTS;
  }
}

/** Fetch a single event by its slug */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.find((e) => e.slug === slug) || null;
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data) {
      return MOCK_EVENTS.find((e) => e.slug === slug) || null;
    }

    return data as Event;
  } catch (err) {
    console.warn('Supabase fetch event by slug failed, using fallback:', err);
    return MOCK_EVENTS.find((e) => e.slug === slug) || null;
  }
}

/** Fetch events filtered by subcategory */
export async function getEventsBySubcategory(subcategory: string): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.filter((e) => e.subcategory === subcategory);
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('events')
      .select('*')
      .eq('subcategory', subcategory)
      .order('event_date', { ascending: true });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return MOCK_EVENTS.filter((e) => e.subcategory === subcategory);
    }

    return data as Event[];
  } catch (err) {
    console.warn('Supabase fetch events by subcategory failed, using fallback:', err);
    return MOCK_EVENTS.filter((e) => e.subcategory === subcategory);
  }
}

/** Fetch events filtered by gender */
export async function getEventsByGender(gender: string): Promise<Event[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_EVENTS.filter((e) => e.gender === gender);
  }

  try {
    const supabase = await createClient();

    const query = supabase
      .from('events')
      .select('*')
      .eq('gender', gender)
      .order('event_date', { ascending: true });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data || data.length === 0) {
      return MOCK_EVENTS.filter((e) => e.gender === gender);
    }

    return data as Event[];
  } catch (err) {
    console.warn('Supabase fetch events by gender failed, using fallback:', err);
    return MOCK_EVENTS.filter((e) => e.gender === gender);
  }
}
