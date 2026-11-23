import assert from "node:assert/strict";
import test from "node:test";
import { parseStateChoice } from "./audience";
import { topicOrBillPath, parseHotTopicReplace } from "./hot-topics";
import { blockedPublicPath, isStateLive, liveStates } from "./launch";
import { STATES } from "./states";

const idaho = STATES.find((state) => state.slug === "idaho");
const newYork = STATES.find((state) => state.slug === "new-york");
const texas = STATES.find((state) => state.slug === "texas");

const beforeIdaho = new Date("2026-11-21T06:59:59-05:00");
const atIdaho = new Date("2026-11-21T07:00:00-05:00");
const beforeHold = new Date("2099-01-01T06:59:59-05:00");
const atHold = new Date("2099-01-01T07:00:00-05:00");

function slugs(now: Date): string[] {
  return liveStates(now).map((state) => state.slug);
}

test("existing states stay live before any new launch", () => {
  assert.deepEqual(slugs(beforeIdaho), ["georgia", "pennsylvania", "arizona"]);
  for (const slug of ["georgia", "pennsylvania", "arizona"]) {
    const state = STATES.find((item) => item.slug === slug);
    assert.ok(state);
    assert.equal(state.launchesAt, null);
    assert.equal(isStateLive(state, beforeIdaho), true);
  }
});

test("each new state flips live at its timestamp and not one second earlier", () => {
  assert.equal(isStateLive(idaho!, beforeIdaho), false);
  assert.equal(isStateLive(idaho!, atIdaho), true);
  assert.equal(isStateLive(newYork!, atIdaho), false);
  assert.equal(isStateLive(texas!, atIdaho), false);

  assert.equal(newYork!.launchesAt, "2099-01-01T07:00:00-05:00");
  assert.equal(texas!.launchesAt, "2099-01-01T07:00:00-05:00");
  assert.deepEqual(slugs(atIdaho), ["georgia", "pennsylvania", "arizona", "idaho"]);
  assert.deepEqual(slugs(beforeHold), ["georgia", "pennsylvania", "arizona", "idaho"]);
  assert.deepEqual(slugs(atHold), ["georgia", "pennsylvania", "arizona", "idaho", "new-york", "texas"]);
});

test("state routes 404 by path until launch, including child routes", () => {
  assert.equal(blockedPublicPath("/idaho", beforeIdaho), true);
  assert.equal(blockedPublicPath("/idaho/bills", beforeIdaho), true);
  assert.equal(blockedPublicPath("/idaho/bills/h0489", beforeIdaho), true);
  assert.equal(blockedPublicPath("/idaho/legislators/joe-alfieri", beforeIdaho), true);
  assert.equal(blockedPublicPath("/idaho/topics/taxes", beforeIdaho), true);
  assert.equal(blockedPublicPath("/new-york/legislators", atIdaho), true);
  assert.equal(blockedPublicPath("/texas/topics/schools", beforeHold), true);

  assert.equal(blockedPublicPath("/idaho", atIdaho), false);
  assert.equal(blockedPublicPath("/idaho/bills/h0489", atIdaho), false);
  assert.equal(blockedPublicPath("/new-york", atHold), false);
  assert.equal(blockedPublicPath("/texas/bills", atHold), false);

  assert.equal(blockedPublicPath("/georgia/bills", beforeIdaho), false);
  assert.equal(blockedPublicPath("/pennsylvania", beforeIdaho), false);
  assert.equal(blockedPublicPath("/arizona/vetoes", beforeIdaho), false);
  assert.equal(blockedPublicPath("/", beforeIdaho), false);
  assert.equal(blockedPublicPath("/hot-topics", beforeIdaho), false);
  assert.equal(blockedPublicPath("/api/signup", beforeIdaho), false);
});

test("signup and hot-topic slugs follow the same clock", () => {
  assert.equal(parseStateChoice("idaho", beforeIdaho).ok, false);
  assert.equal(parseStateChoice("georgia", beforeIdaho).ok, true);
  const after = parseStateChoice("idaho", atIdaho);
  assert.equal(after.ok, true);
  if (after.ok) assert.deepEqual(after.states, ["idaho"]);
  assert.equal(parseStateChoice("new-york", atIdaho).ok, false);
  assert.equal(parseStateChoice("texas", beforeHold).ok, false);
  assert.equal(parseStateChoice("texas", atHold).ok, true);

  assert.equal(topicOrBillPath("/idaho/topics/taxes", beforeIdaho), false);
  assert.equal(topicOrBillPath("/idaho/bills/h0489", atIdaho), true);
  assert.equal(topicOrBillPath("/georgia/topics/taxes", beforeIdaho), true);
  const rejected = parseHotTopicReplace(
    {
      state: "texas",
      weekStart: "2026-11-16",
      topics: [{ rank: 1, title: "Schools", summary: "A topic." }],
    },
    beforeHold,
  );
  assert.equal(rejected.ok, false);
  const accepted = parseHotTopicReplace(
    {
      state: "texas",
      weekStart: "2026-11-16",
      topics: [{ rank: 1, title: "Schools", summary: "A topic." }],
    },
    atHold,
  );
  assert.equal(accepted.ok, true);
});
