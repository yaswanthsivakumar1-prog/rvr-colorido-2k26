'use server';

import { createClient } from '@/lib/supabase/server';
import type { Registration, RegistrationFormData } from '@/types';
import { isSupabaseConfigured, MOCK_REGISTRATIONS, MOCK_EVENTS } from '@/lib/data/mock-data';

/**
 * Generate a unique registration ID like CLR26-XXXX.
 */
function generateRegistrationId(): string {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `CLR26-${randomPart}`;
}

/** In-memory store for fallback registrations during demonstration */
const memoryRegistrations: Registration[] = [...MOCK_REGISTRATIONS];

/** Submit a new registration */
export async function submitRegistration(
  formData: RegistrationFormData
): Promise<{ success: boolean; registrationId?: string; error?: string }> {
  // Server-side validation
  if (!formData.full_name || formData.full_name.trim().length < 2) {
    return { success: false, error: 'Full name is required (at least 2 characters).' };
  }
  const college = (formData.college || '').trim() || 'R.V.R. & J.C. College of Engineering';
  if (college.length < 2) {
    return { success: false, error: 'Please select or enter your college/institution.' };
  }
  const rollNumber = (formData.roll_number || '').trim().toUpperCase();
  if (!rollNumber || rollNumber.length < 4) {
    return { success: false, error: 'A valid Student Roll Number / ID is required.' };
  }
  if (!formData.department || formData.department.trim().length < 2) {
    return { success: false, error: 'Please select your academic department.' };
  }
  if (!formData.year) {
    return { success: false, error: 'Please select your year of study.' };
  }
  if (!formData.phone || !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
    return { success: false, error: 'A valid 10-digit phone number is required.' };
  }
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!formData.event_id) {
    return { success: false, error: 'Please select an event to register for.' };
  }
  if (!formData.agreement) {
    return { success: false, error: 'You must confirm your student status and agree to event rules.' };
  }

  // Duplicate registration check for in-memory tracking (protects against duplicate submissions in all modes)
  const isDuplicateInMemory = memoryRegistrations.some(
    (reg) =>
      (reg.event_id === formData.event_id) &&
      (reg.additional_info?.toUpperCase().includes(rollNumber) ||
       reg.email.toLowerCase() === formData.email.trim().toLowerCase())
  );

  if (isDuplicateInMemory) {
    return {
      success: false,
      error: `Student with Roll Number ${rollNumber} is already registered for this event. Duplicate registration is not permitted.`,
    };
  }

  const registrationId = generateRegistrationId();
  const matchedEvent = MOCK_EVENTS.find((e) => e.id === formData.event_id);

  if (!isSupabaseConfigured()) {
    // Record in local demonstration state
    memoryRegistrations.unshift({
      id: `reg-${Date.now()}`,
      registration_id: registrationId,
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      college: college,
      course: formData.department.trim(),
      year: formData.year,
      gender: formData.gender || 'open',
      event_id: formData.event_id,
      team_name: formData.team_name?.trim() || null,
      participant_count: formData.participant_count || 1,
      additional_info: `Roll No: ${rollNumber}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      event: matchedEvent,
    });

    return { success: true, registrationId };
  }

  // Supabase is configured: execute real database operations
  try {
    const supabase = await createClient();

    // Verify and resolve event UUID
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let resolvedEventId = formData.event_id;

    if (!UUID_REGEX.test(resolvedEventId)) {
      // Check if event_id is a slug or mock ID, and find its Supabase record
      const mockEvt = MOCK_EVENTS.find((e) => e.id === resolvedEventId || e.slug === resolvedEventId);
      const lookupSlug = mockEvt?.slug || resolvedEventId;
      const lookupName = mockEvt?.name;

      const { data: dbEvent } = await supabase
        .from('events')
        .select('id')
        .or(`slug.eq.${lookupSlug}${lookupName ? `,name.ilike.%${lookupName}%` : ''}`)
        .limit(1)
        .maybeSingle();

      if (dbEvent?.id) {
        resolvedEventId = dbEvent.id;
      }
    }

    if (!UUID_REGEX.test(resolvedEventId)) {
      return {
        success: false,
        error: 'The selected event could not be found in the database. Please select a valid event.',
      };
    }

    const isDuplicateResolved = memoryRegistrations.some(
      (reg) =>
        (reg.event_id === resolvedEventId || reg.event_id === formData.event_id) &&
        (reg.additional_info?.toUpperCase().includes(rollNumber) ||
         reg.email.toLowerCase() === formData.email.trim().toLowerCase())
    );

    if (isDuplicateResolved) {
      return {
        success: false,
        error: `Student with Roll Number ${rollNumber} is already registered for this event. Duplicate registration is not permitted.`,
      };
    }

    // Server-side Deadline & Capacity check (Sections 23 & 24)
    const { data: dbEventData } = await supabase
      .from('events')
      .select('id, name, registration_open, max_participants')
      .eq('id', resolvedEventId)
      .maybeSingle();

    if (dbEventData) {
      if (dbEventData.registration_open === false) {
        return {
          success: false,
          error: `Registration for "${dbEventData.name}" is officially closed.`,
        };
      }

      if (dbEventData.max_participants && dbEventData.max_participants > 0) {
        const { count: currentCount } = await supabase
          .from('registrations')
          .select('*', { count: 'exact', head: true })
          .eq('event_id', resolvedEventId)
          .neq('status', 'cancelled');

        if ((currentCount || 0) >= dbEventData.max_participants) {
          return {
            success: false,
            error: `Registration closed: "${dbEventData.name}" has reached maximum participant capacity (${dbEventData.max_participants}).`,
          };
        }
      }
    }

    // Check for existing registration in Supabase (Sections 7 & 20)
    const { data: { user } } = await supabase.auth.getUser();

    let duplicateQuery = supabase
      .from('registrations')
      .select('id')
      .eq('event_id', resolvedEventId)
      .neq('status', 'cancelled');

    if (user?.id) {
      duplicateQuery = duplicateQuery.or(`user_id.eq.${user.id},email.eq.${formData.email.trim().toLowerCase()},additional_info.ilike.%${rollNumber}%`);
    } else {
      duplicateQuery = duplicateQuery.or(`email.eq.${formData.email.trim().toLowerCase()},additional_info.ilike.%${rollNumber}%`);
    }

    const { data: existing, error: checkError } = await duplicateQuery.limit(1);

    if (checkError) {
      console.error('Supabase duplicate registration check error:', checkError);
      return {
        success: false,
        error: `Database check error: ${checkError.message}`,
      };
    }

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: `Student with Roll Number ${rollNumber} is already registered for this event. Duplicate registration is not permitted.`,
      };
    }

    let { error: insertError } = await supabase.from('registrations').insert({
      registration_id: registrationId,
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      college: college,
      course: formData.department.trim(),
      year: formData.year,
      gender: formData.gender || 'open',
      event_id: resolvedEventId,
      team_name: formData.team_name?.trim() || null,
      participant_count: formData.participant_count || 1,
      additional_info: `Roll No: ${rollNumber}`,
      status: 'pending',
      ...(user?.id ? { user_id: user.id } : {}),
    });

    if (insertError && insertError.message?.includes('user_id')) {
      const retry = await supabase.from('registrations').insert({
        registration_id: registrationId,
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        college: college,
        course: formData.department.trim(),
        year: formData.year,
        gender: formData.gender || 'open',
        event_id: resolvedEventId,
        team_name: formData.team_name?.trim() || null,
        participant_count: formData.participant_count || 1,
        additional_info: `Roll No: ${rollNumber}`,
        status: 'pending',
      });
      insertError = retry.error;
    }

    if (insertError) {
      console.error('Supabase registration insert failed:', insertError);
      if (
        insertError.code === '23505' ||
        insertError.message?.toLowerCase().includes('duplicate') ||
        insertError.message?.toLowerCase().includes('unique')
      ) {
        return {
          success: false,
          error: `Student with Roll Number ${rollNumber} is already registered for this event. Duplicate registration is not permitted.`,
        };
      }
      return {
        success: false,
        error: `Failed to record registration: ${insertError.message || 'Database error occurred. Please try again.'}`,
      };
    }

    // Cache registration in memory to ensure instant duplicate rejection
    memoryRegistrations.unshift({
      id: `reg-${Date.now()}`,
      registration_id: registrationId,
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      college: college,
      course: formData.department.trim(),
      year: formData.year,
      gender: formData.gender || 'open',
      event_id: resolvedEventId,
      team_name: formData.team_name?.trim() || null,
      participant_count: formData.participant_count || 1,
      additional_info: `Roll No: ${rollNumber}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      event: matchedEvent,
    });

    return { success: true, registrationId };
  } catch (err: any) {
    console.error('Registration exception:', err);
    return {
      success: false,
      error: `Registration failed: ${err?.message || 'An unexpected server error occurred.'}`,
    };
  }
}

/** Fetch all registrations (admin) */
export async function getRegistrations(status?: string): Promise<Registration[]> {
  if (!isSupabaseConfigured()) {
    if (status && status !== 'all') {
      return memoryRegistrations.filter((r) => r.status === status);
    }
    return memoryRegistrations;
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from('registrations')
      .select('*, event:events(*)')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 3500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);

    if (error || !data) {
      return memoryRegistrations;
    }

    return (data as Registration[]) || [];
  } catch (err) {
    console.warn('Supabase getRegistrations failed:', err);
    return memoryRegistrations;
  }
}

/** Update registration status (admin) */
export async function updateRegistrationStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  const typedStatus = status as Registration['status'];
  const reg = memoryRegistrations.find((r) => r.id === id || r.registration_id === id);
  if (reg) reg.status = typedStatus;

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('registrations')
      .update({ status: typedStatus })
      .or(`id.eq.${id},registration_id.eq.${id}`);

    if (error) {
      console.error('Error updating registration status:', error);
      return { success: false, error: 'Failed to update registration status in database.' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

/** Fetch a single registration by UUID or registration_id */
export async function getRegistrationById(idOrCode: string): Promise<Registration | null> {
  const cleanId = idOrCode.trim();

  if (!isSupabaseConfigured()) {
    const found = memoryRegistrations.find(
      (r) => r.id === cleanId || r.registration_id.toUpperCase() === cleanId.toUpperCase()
    );
    return found || null;
  }

  try {
    const supabase = await createClient();

    // Check UUID pattern
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let query = supabase.from('registrations').select('*, event:events(*)');

    if (UUID_REGEX.test(cleanId)) {
      query = query.eq('id', cleanId);
    } else {
      query = query.eq('registration_id', cleanId.toUpperCase());
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      // Fallback check in memory
      const fallback = memoryRegistrations.find(
        (r) => r.id === cleanId || r.registration_id.toUpperCase() === cleanId.toUpperCase()
      );
      return fallback || null;
    }

    return data as Registration;
  } catch (err) {
    console.warn('Failed to fetch registration by ID:', err);
    return null;
  }
}

/** Cancel a student registration (student authorized) */
export async function cancelStudentRegistration(
  idOrCode: string
): Promise<{ success: boolean; error?: string }> {
  const cleanId = idOrCode.trim();

  if (!isSupabaseConfigured()) {
    const reg = memoryRegistrations.find(
      (r) => r.id === cleanId || r.registration_id.toUpperCase() === cleanId.toUpperCase()
    );
    if (!reg) return { success: false, error: 'Registration record not found.' };
    if (reg.status !== 'pending') {
      return { success: false, error: 'Only pending registrations can be cancelled.' };
    }
    reg.status = 'cancelled';
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Authentication required to cancel registration.' };
    }

    // Verify registration ownership
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let query = supabase.from('registrations').select('*');
    if (UUID_REGEX.test(cleanId)) {
      query = query.eq('id', cleanId);
    } else {
      query = query.eq('registration_id', cleanId.toUpperCase());
    }

    const { data: reg, error: fetchErr } = await query.maybeSingle();
    if (fetchErr || !reg) {
      return { success: false, error: 'Registration record not found.' };
    }

    if (reg.user_id && reg.user_id !== user.id && reg.email?.toLowerCase() !== user.email?.toLowerCase()) {
      return { success: false, error: 'You are not authorized to cancel this registration.' };
    }

    if (reg.status !== 'pending') {
      return {
        success: false,
        error: `Cannot cancel registration with current status "${reg.status}". Only pending registrations can be cancelled.`,
      };
    }

    const { error: updateErr } = await supabase
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', reg.id);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to cancel registration.' };
  }
}
