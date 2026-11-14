import { Resend } from "resend";
import { audienceStates } from "@/lib/audience";
import { logError } from "@/lib/errors";
import { isUnset } from "@/lib/email-address";
import { STATES, type StateSlug } from "@/lib/states";

export const STATE_PROPERTY_KEY = "acw_state";

export function topicName(stateName: string): string {
  return `American Capitol Watch: ${stateName}`.slice(0, 50);
}

export type StateTopicIds = Record<StateSlug, string>;

function topicSubscriptions(chosen: StateSlug[], topics: StateTopicIds) {
  return STATES.map((state) => ({
    id: topics[state.slug],
    subscription: chosen.includes(state.slug) ? ("opt_in" as const) : ("opt_out" as const),
  }));
}

export async function ensureAudienceSetup(
  resend: Resend,
): Promise<{ ok: true; topics: StateTopicIds } | { ok: false; reason: string }> {
  const property = await resend.contactProperties.list();
  if (property.error) return { ok: false, reason: property.error.message };
  const existingProperty = property.data?.data?.find((item) => item.key === STATE_PROPERTY_KEY);
  if (!existingProperty) {
    const created = await resend.contactProperties.create({
      key: STATE_PROPERTY_KEY,
      type: "string",
      fallbackValue: "georgia",
    });
    if (created.error && !/already exists/i.test(created.error.message)) {
      return { ok: false, reason: created.error.message };
    }
  }

  const listed = await resend.topics.list();
  if (listed.error) return { ok: false, reason: listed.error.message };
  const topics = {} as StateTopicIds;
  for (const state of STATES) {
    const name = topicName(state.name);
    const found = listed.data?.data?.find((topic) => topic.name === name);
    if (found) {
      topics[state.slug] = found.id;
      continue;
    }
    const created = await resend.topics.create({
      name,
      description: `Bills from the ${state.name} section.`.slice(0, 200),
      defaultSubscription: "opt_out",
    });
    if (created.error || !created.data?.id) {
      return { ok: false, reason: created.error?.message || `Could not create the ${state.name} topic.` };
    }
    topics[state.slug] = created.data.id;
  }
  return { ok: true, topics };
}

export async function syncSignupStates(
  resend: Resend,
  segmentId: string,
  topics: StateTopicIds,
  rows: { email: string; states: string[] }[],
): Promise<{ updated: number; failed: number }> {
  let updated = 0;
  let failed = 0;
  for (const row of rows) {
    const chosen = audienceStates(row.states);
    const properties = { [STATE_PROPERTY_KEY]: chosen.join(",") };
    const topicChoices = topicSubscriptions(chosen, topics);
    const existing = await resend.contacts.get({ email: row.email });
    if (existing.error || !existing.data?.id) {
      const created = await resend.contacts.create({
        email: row.email,
        unsubscribed: false,
        properties,
        segments: [{ id: segmentId }],
        topics: topicChoices,
      });
      if (created.error || !created.data?.id) failed += 1;
      else updated += 1;
      continue;
    }
    const updatedContact = await resend.contacts.update({ email: row.email, properties });
    const segment = await resend.contacts.segments.add({ contactId: existing.data.id, segmentId });
    const topicsUpdated = await resend.contacts.topics.update({ email: row.email, topics: topicChoices });
    const segmentOk = !segment.error || /already/i.test(segment.error.message);
    if (updatedContact.error || !segmentOk || topicsUpdated.error) failed += 1;
    else updated += 1;
  }
  return { updated, failed };
}

export async function tagContact(options: {
  email: string;
  states: StateSlug[];
  segmentId: string;
}): Promise<{ status: string; id: string | null }> {
  const key = process.env.RESEND_API_KEY;
  if (isUnset(key) || isUnset(options.segmentId)) return { status: "skipped", id: null };
  const chosen = audienceStates(options.states);
  try {
    const resend = new Resend(key);
    const setup = await ensureAudienceSetup(resend);
    if (!setup.ok) {
      await logError(new Error(setup.reason), "/api/signup");
      return { status: "failed", id: null };
    }
    const properties = { [STATE_PROPERTY_KEY]: chosen.join(",") };
    const topics = topicSubscriptions(chosen, setup.topics);
    const created = await resend.contacts.create({
      email: options.email,
      unsubscribed: false,
      properties,
      segments: [{ id: options.segmentId }],
      topics,
    });
    if (!created.error && created.data?.id) return { status: "added", id: created.data.id };
    const existing = await resend.contacts.get({ email: options.email });
    if (!existing.data?.id) return { status: "failed", id: null };
    const contactId = existing.data.id;
    await resend.contacts.update({ email: options.email, properties });
    await resend.contacts.segments.add({ contactId, segmentId: options.segmentId });
    const topicsUpdated = await resend.contacts.topics.update({ email: options.email, topics });
    if (topicsUpdated.error) {
      await logError(new Error(topicsUpdated.error.message), "/api/signup");
      return { status: "failed", id: contactId };
    }
    return { status: "added", id: contactId };
  } catch (error) {
    await logError(error, "/api/signup");
    return { status: "failed", id: null };
  }
}
